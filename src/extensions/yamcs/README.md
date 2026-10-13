# Hermes YAMCS

Send YAMCS commands from Hermes notebooks.

In a Hermes notebook (`.hermes.md`), set a code cell's language to **YAMCS** and write one command per
line: its qualified name, then its arguments. Lines starting with `#` are comments.

```
/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP
/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING "hello"
```

Switch Hermes to YAMCS mode (**Hermes: Change Backend Mode**, then **YAMCS**) first. Completion,
hovers and argument checks come from the dictionary YAMCS mode builds from the instance's commands, so
they start working once YAMCS mode connects. Running a cell sends its commands through YAMCS, one at a
time. If the mission database gives a command verifiers, which are checks that tell YAMCS whether the
command succeeded, the cell waits for their verdict before it sends the next command, and fails if the
command failed. A command without verifiers passes once YAMCS has sent it, which doesn't mean the
flight software ran it. While a cell runs, the editor shows each command's status after the command's
line. The yamcs-grpc plugin's [README](https://github.com/nasa/hermes/tree/v6/yamcs-grpc-plugin)
explains YAMCS mode.
