import argparse
from tqdm import tqdm
from influxdb_client import InfluxDBClient
from datetime import datetime
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import (
    OTLPLogExporter,
)
from opentelemetry.sdk.util.instrumentation import InstrumentationScope
from opentelemetry.sdk._logs import LogData, LogRecord
from opentelemetry.trace.span import TraceFlags
from opentelemetry._logs import (
    SeverityNumber
)
from opentelemetry.sdk.resources import Resource 

parser = argparse.ArgumentParser()
parser.add_argument('url', help='InfluxDB URL')
parser.add_argument('token', help='InfluxDB Token')
parser.add_argument('org', help='InfluxDB Organization')
parser.add_argument('bucket', help='InfluxDB Bucket')
parser.add_argument('start', type=int, help='Start date based on days relative from now.')
parser.add_argument('--stop', type=int, default='0', help='Stop date based on days relative from now.')
parser.add_argument('--decrement', type=int, default='30', help='Number of days in each split of data query')
args = parser.parse_args()

def get_data(start: str, stop: str):
    with InfluxDBClient(url=args.url, token=args.token, org=args.org, debug=False) as client:
        query_api = client.query_api()

        tables = query_api.query(f'''
            from(bucket: "{args.bucket}")
                |> range(start: {start}, stop: {stop})
                |> filter(fn: (r) => r._measurement == "evr" and r._field == "message")
                |> keep(columns: ["_time", "severity", "source", "component", "name", "_value"])
                |> group()
                |> sort(columns: ["_time"], desc: true)
        ''')

        return tables

def make_log_record(
    time: int, 
    value: str,
    component: str,
    name: str,
    severity_name: str,
    source: str
) -> LogRecord:
    return LogRecord(
        trace_id=0,
        trace_flags=TraceFlags(0),
        span_id=0,
        timestamp=time,
        body=value,
        severity_number=SeverityNumber(0),
        severity_text=severity_name,
        resource=Resource(
            attributes={
                'service.name': source,
                'service.namespace': args.bucket
            }
        ),
        observed_timestamp=None,
        attributes={
            'severity': severity_name_to_severity(severity_name=severity_name),
            'component': component,
            'name': name
        }
    )

def datetime_to_int(datetime_obj: datetime) -> int:
    return int(datetime_obj.timestamp() * 1e9)

def severity_name_to_severity(severity_name:str) -> str:
    severity_dict = {
        'DIAGNOSTIC': 'trace',
        'WARNING_LO': 'warning',
        'WARNING_HI': 'error',
        'COMMAND': 'debug',
        'ACTIVITY_LO': 'info',
        'ACTIVITY_HI': 'info',
        'FATAL': 'fatal'
    }
    return severity_dict.get(severity_name, 'unknown')

def main():
    exporter = OTLPLogExporter(insecure=True)
    instrumentation_scope = InstrumentationScope(
        name='InstrumentationScope'
    )
    start:int = args.start
    stop:int = args.stop
    range_index:int = start
    decrement_value:int = args.decrement
    all_log_data = []
    while (range_index >= stop):
        tables=[]
        if range_index - decrement_value > stop:
            print(f"Fetching from -{range_index}d to -{range_index - decrement_value}d")
            tables = get_data(start=f"-{range_index}d", stop=f"-{range_index - decrement_value}d")
        else:
            print(f"Fetching from -{range_index}d to -{stop}d")
            tables = get_data(start=f"-{range_index}d", stop=f"-{stop}d")

        for table in tables:
            for record in tqdm(table.records):
                log_record = make_log_record(
                    time=datetime_to_int(record.values.get('_time', datetime.now())),
                    value=record.values.get('_value', '') if record.values.get('_value', '') != None else '',
                    component=record.values.get('component', '') if record.values.get('component', '') != None else '',
                    name=record.values.get('name', '') if record.values.get('name', '') != None else '',
                    severity_name=record.values.get('severity', '') if record.values.get('severity', '') != None else '',
                    source=record.values.get('source', '') if record.values.get('source', '') != None else ''
                )
                if len(all_log_data) >= 1000: 
                    exporter.export(all_log_data)
                    all_log_data=[]

                log_data = LogData(log_record=log_record, instrumentation_scope=instrumentation_scope)
                all_log_data.append(log_data)

        range_index-=(decrement_value + 1)
    
    exporter.export(all_log_data)

if __name__ == '__main__':
    main()