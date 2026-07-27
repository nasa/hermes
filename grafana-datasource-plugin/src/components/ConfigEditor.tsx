import React, { ChangeEvent } from 'react';
import { InlineField, Input, SecretInput } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const { jsonData, secureJsonFields, secureJsonData } = options;

  const onHostChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: { ...jsonData, host: event.target.value },
    });
  };

  const onUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: { ...jsonData, user: event.target.value },
    });
  };

  const onDatabaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: { ...jsonData, database: event.target.value },
    });
  };

  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: { password: event.target.value },
    });
  };

  const onResetPassword = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: { ...options.secureJsonFields, password: false },
      secureJsonData: { ...options.secureJsonData, password: '' },
    });
  };

  return (
    <>
      <InlineField label="Host" labelWidth={14} tooltip="TimescaleDB host and port (e.g. localhost:5432, or timescaledb:5432 if using docker)" required>
        <Input
          id="config-editor-host"
          onChange={onHostChange}
          value={jsonData.host ?? ''}
          placeholder="localhost:5432"
          width={40}
        />
      </InlineField>
      <InlineField label="User" labelWidth={14} tooltip="Database user. Leave blank to use the OS user.">
        <Input
          id="config-editor-user"
          onChange={onUserChange}
          value={jsonData.user ?? ''}
          placeholder=""
          width={40}
        />
      </InlineField>
      <InlineField label="Password" labelWidth={14} tooltip="Database password. Leave blank if not required.">
        <SecretInput
          id="config-editor-password"
          isConfigured={secureJsonFields.password}
          value={secureJsonData?.password}
          placeholder=""
          width={40}
          onReset={onResetPassword}
          onChange={onPasswordChange}
        />
      </InlineField>
      <InlineField label="Database" labelWidth={14} tooltip="Database name where telemetry and events will be stored." required>
        <Input
          id="config-editor-database"
          onChange={onDatabaseChange}
          value={jsonData.database ?? ''}
          placeholder=""
          width={40}
        />
      </InlineField>
    </>
  );
}
