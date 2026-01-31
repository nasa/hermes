import asyncio
import base64
from contextlib import asynccontextmanager
import os
import grpc

from typing import AsyncGenerator, AsyncIterable, Coroutine, Dict, List, Optional, TypeVar
import typing

from fsw_pb2 import *
from bus_pb2 import *
from file_pb2 import *
from msg_pb2 import *
from dictionary_pb2 import *
from time_pb2 import *
from type_pb2 import *

from hermes_pb2_grpc import ProviderStub


class ConnectionBase:
    capabilities: List[int]

    def __init__(self):
        self.capabilities = self._detect_capabilities()

    def _detect_capabilities(self) -> List[int]:
        implemented: List[int] = []
        # Filter out the 'stubbed' class from the MRO listing
        classes = [c for c in self.__class__.mro() if c not in [
            Connection,
            ConnectionBase
        ]]

        check = {
            "command": FswCapability.COMMAND,
            "parse_command": FswCapability.PARSE_COMMAND,
            "sequence": FswCapability.SEQUENCE,
            "parse_sequence": FswCapability.PARSE_SEQUENCE,
            "file_uplink": FswCapability.FILE,
        }

        for name, capability in check.items():
            for cl in classes:
                if name in cl.__dict__:
                    implemented.append(capability)
                    break

        return implemented


class Connection(ConnectionBase):
    id: str
    type_name: str
    forwards: List[str]

    def __init__(
        self,
        id: str,
        type_name: str,
        forwards: List[str] = [],
    ) -> None:
        """
        :param id: Unique ID (human friendly) denoting the name/identifier of the connection
        :type id: str
        :param type_name: An identifier denoting the type of connection (ex: 'fprime')
        :type type_name: str
        :param forwards: An optional list of connection ids that this connection wraps (this is rarely needed)
        :type forwards: List[str]
        """
        super().__init__()
        self.id = id
        self.type_name = type_name
        self.forwards = forwards

    async def command(self, cmd: CommandValue) -> bool:
        """
        Execute a command against the connection.
        If there is an error encoding or transmitting the command, raise an error instead of
        returning 'False'

        :param cmd: Command uplinked
        :type cmd: CommandValue
        :return: Success (True) or failure (False) executing command
        """
        raise NotImplementedError()

    async def sequence(self, sequence: CommandSequence) -> Optional[int]:
        """
        Execute a sequence against the connection

        :param sequence: Command sequence to execute
        :type sequence: CommandSequence
        :return: None if the sequence successfully finish or an integer index denoting the failed command
        """
        raise NotImplementedError()

    async def parse_command(self, cmd: RawCommandValue) -> CommandValue:
        """
        Parse a 'raw' command into an actual command

        :param cmd: Raw command to parse
        :type cmd: RawCommandValue
        :return: Parsed command
        :rtype: CommandValue
        """
        raise NotImplementedError()

    async def parse_sequence(self, seq: RawCommandSequence) -> CommandSequence:
        """
        Parse a 'raw' command into an actual command

        :param seq: Raw sequence to parse
        :type seq: RawCommandSequence
        :return: Parsed sequence
        :rtype: CommandSequence
        """
        raise NotImplementedError()

    async def file_uplink(
        self, header: FileHeader, data: AsyncGenerator[bytearray, None]
    ) -> None:
        """
        Handle file uplink. Uplink a file to the on-board filesystem behind
        a connection

        :param header: File header denoting metadata about the file uplink
        :type header: FileHeader
        :param data: A generator yieling chunks of the file during uplink, these chunks
        are determined by the initiator and may need to be re-chunked depending on the uplink protocol.
        :type data: AsyncGenerator[bytearray, None]
        """
        raise NotImplementedError()


T = TypeVar("T")


async def queue_to_async_generator(queue: asyncio.Queue[T]) -> AsyncGenerator[T, None]:
    """
    An async generator that yields items from an asyncio.Queue.
    It stops when a special sentinel value (None in this case) is received.
    """
    while True:
        item = await queue.get()
        if item is None:
            break

        yield item
        queue.task_done()

    queue.task_done()


class Client:
    _profile_name: str
    _stub: ProviderStub

    _event_stream: Optional[asyncio.Queue[SourcedEvent]]
    _telemetry_stream: Optional[asyncio.Queue[SourcedTelemetry]]

    _tasks: Dict[str, asyncio.Task]
    _task_streams: Dict[str, asyncio.Queue]

    def __init__(self, profile_name: str, stub: ProviderStub) -> None:
        self._stub = stub
        self._profile_name = profile_name
        self._event_stream = None
        self._telemetry_stream = None
        self._tasks = {}
        self._task_streams = {}

    async def run_event_stream(self):
        q = asyncio.Queue()
        self._event_stream = q
        try:
            await self._stub.Event(queue_to_async_generator(q))
        except Exception as _e:
            pass
        finally:
            self._event_stream = None

    async def run_telemetry_stream(self):
        q = asyncio.Queue()
        self._telemetry_stream = q
        try:
            await self._stub.Telemetry(queue_to_async_generator(q))
        except Exception as _e:
            pass
        finally:
            self._telemetry_stream = None

    def _run_request(
        self, id: str, coro: Coroutine[None, None, T]
    ) -> asyncio.Task[T]:
        task = asyncio.create_task(coro)
        self._tasks[id] = task

        async def cleanup(_task):
            del self._tasks[id]

        task.add_done_callback(cleanup)

        return task

    async def _handle_request(
        self, connection: Connection, msg: Uplink
    ) -> Optional[bytes]:
        if msg.HasField("cmd"):
            success = await self._run_request(msg.id, connection.command(msg.cmd))
            if success:
                return b"true"
            else:
                return b"false"
        elif msg.HasField("parse_cmd"):
            p = await self._run_request(msg.id, connection.parse_command(msg.parse_cmd))
            return p.SerializeToString()
        elif msg.HasField("seq"):
            reply = await self._run_request(msg.id, connection.sequence(msg.seq))
            replyMsg = (
                SequenceReply(success=True)
                if reply is None
                else SequenceReply(success=False, command_index=reply)
            )

            return replyMsg.SerializeToString()
        elif msg.HasField("parse_seq"):
            p = await self._run_request(msg.id, connection.parse_sequence(msg.parse_seq))
            return p.SerializeToString()
        elif msg.HasField("file"):
            if msg.file.HasField("header"):
                # This is the start of a new request
                file_queue = asyncio.Queue[bytearray]()
                self._task_streams[msg.id] = file_queue
                await self._run_request(
                    msg.id,
                    connection.file_uplink(
                        msg.file.header, queue_to_async_generator(file_queue)
                    ),
                )

                del self._task_streams[msg.id]
                return b""
            elif msg.file.HasField("data"):
                # Look up the on-going file uplink
                if msg.id in self._task_streams:
                    await self._task_streams[msg.id].put(msg.file.data)
                else:
                    raise KeyError(f"no ongoing file uplink with id {msg.id}")

                # We don't need to reply to this packet
                # The header will reply once the uplink is actually finished
                return None
            else:
                raise RuntimeError(
                    "expected file packet to have 'header' or 'data' fields"
                )
        elif msg.HasField("final"):
            # Finish up an ongoing uplink stream
            if msg.id in self._task_streams:
                self._task_streams[msg.id].put_nowait(None)
            else:
                raise KeyError(f"no ongoing request with id {msg.id}")

            return None
        elif msg.HasField("cancel"):
            # Cancel an on-going request
            if msg.id in self._tasks:
                if not self._tasks[msg.id].cancel():
                    raise KeyError(f"task with id {msg.id} already finished")
            else:
                raise KeyError(f"no ongoing request with id {msg.id}")

            return None
        else:
            raise RuntimeError("invalid uplink packet")

    def event(self, ev: SourcedEvent):
        if not self._event_stream:
            raise RuntimeError("event stream not initialized Client.run_event_stream() needs to be run first")

        self._event_stream.put_nowait(ev)

    def telemetry(self, tlm: SourcedTelemetry):
        if not self._telemetry_stream:
            raise RuntimeError("telemetry stream not initialized Client.run_telemetry_stream() needs to be run first")

        self._telemetry_stream.put_nowait(tlm)

    def file(self, args):
        raise NotImplementedError(
            "file downlink is not implemented in the python client library yet"
        )

    async def _connection(self, connection: Connection):
        reply_q = asyncio.Queue()
        req_stream = typing.cast(
            AsyncIterable[Uplink],
            self._stub.Connection(queue_to_async_generator(reply_q)),
        )

        # Send the initial packet to notify the backend what this connection is
        await reply_q.put(
            FswConnectionPacket(
                info=FswInitialPacket(
                    info=Fsw(
                        id=connection.id,
                        type=connection.type_name,
                        forwards=connection.forwards,
                        capabilities=connection.capabilities, # type: ignore
                    ),
                    profile=self._profile_name,
                )
            )
        )

        try:
            async for msg in req_stream:
                def handle_done(task: asyncio.Task[bytes | None]):
                    try:
                        reply = task.result()

                        if reply is None:
                            # Don't need to reply to this packet
                            # This is an intermediate packet
                            pass
                        else:
                            reply_q.put_nowait(
                                FswConnectionPacket(
                                    reply=UplinkReply(id=msg.id, reply=reply)
                                )
                            )
                    except BaseException as e:
                        reply_q.put_nowait(
                            FswConnectionPacket(
                                reply=UplinkReply(id=msg.id, error=str(e))
                            )
                        )

                task = asyncio.create_task(self._handle_request(connection, msg))
                task.add_done_callback(handle_done)
        finally:
            reply_q.put_nowait(None)

    def connection(self, connection: Connection) -> asyncio.Task[None]:
        return asyncio.create_task(self._connection(connection))


ENVIRONMENT_HELP = """
Environment variables:
- HERMES_HOST: Connect to a remote Hermes host
- HERMES_AUTH_METHOD: 'none', 'userpass' or 'token
- HERMES_USERPASS: Username/Password for the 'userpass' authentication method in the form '<username>:<password>' 
- HERMES_USERPASS_B64: Base64 version of HERMES_USERPASS
- HERMES_TOKEN: Authentication Token used for the 'token' authentication method
"""

env_host = "HERMES_HOST"
env_auth_method = "HERMES_AUTH_METHOD"
env_user_pass = "HERMES_USERPASS"
env_user_pass_b64 = "HERMES_USERPASS_B64"
env_token = "HERMES_TOKEN"


class BasicAuthMetadataPlugin(grpc.AuthMetadataPlugin):
    def __init__(self, is_user_pass: bool, creds_b64: str):
        self._creds = creds_b64
        self._is_user_pass = is_user_pass

    def __call__(self, context, callback):
        # Create the metadata dictionary
        auth = ("Basic " if self._is_user_pass else "Bearer ") + self._creds

        metadata = (("authorization", auth),)
        callback(metadata, None)  # Pass metadata to the callback


def transport_credentials() -> Optional[grpc.ChannelCredentials]:
    match os.environ.get(env_auth_method, "none"):
        case "" | "none":
            return None
        case "userpass":
            creds: str
            if os.environ.get(env_user_pass, "") == "":
                if os.environ.get(env_user_pass_b64, ""):
                    raise EnvironmentError(
                        "authentication type 'userpass' must have HERMES_USERPASS or HERMES_USERPASS_B64 set"
                    )

                creds = os.environ[env_user_pass_b64]
            else:
                # creds = base64.StdEncoding.EncodeToString([]byte(os.Getenv(envUserPass)))
                creds = base64.b64encode(
                    os.environ[env_user_pass].encode("utf-8")
                ).decode("utf-8")

            return grpc.composite_channel_credentials(
                grpc.ssl_channel_credentials(),
                call_credentials=grpc.metadata_call_credentials(
                    BasicAuthMetadataPlugin(
                        is_user_pass=True,
                        creds_b64=creds,
                    )
                ),
            )
        case "token":
            if os.environ.get(env_token, "") == "":
                raise EnvironmentError(
                    "authentication type 'token' must have HERMES_TOKEN"
                )

            return grpc.composite_channel_credentials(
                grpc.ssl_channel_credentials(),
                call_credentials=grpc.metadata_call_credentials(
                    BasicAuthMetadataPlugin(
                        is_user_pass=False,
                        creds_b64=os.environ[env_token],
                    )
                ),
            )
        case auth_method:
            raise EnvironmentError(f"invalid authentication method '{auth_method}'")


@asynccontextmanager
async def connect(profile_name: str):
    host = os.environ.get(env_host, "localhost:6880")
    creds = transport_credentials()
    if creds is None:
        async with grpc.aio.insecure_channel(host) as channel:
            stub = ProviderStub(channel)
            yield Client(profile_name, stub)
    else:
        async with grpc.aio.secure_channel(host, creds) as channel:
            stub = ProviderStub(channel)
            yield Client(profile_name, stub)
