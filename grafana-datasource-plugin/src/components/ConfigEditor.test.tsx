import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigEditor } from './ConfigEditor';
import { MyDataSourceOptions, MySecureJsonData } from '../types';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';

function buildProps(
  overrides?: Partial<DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData>>
): DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {
  return {
    options: {
      id: 1,
      uid: 'test',
      orgId: 1,
      name: 'Test',
      type: 'nasa-hermes-datasource',
      typeName: 'Hermes',
      typeLogoUrl: '',
      access: 'proxy',
      url: '',
      user: '',
      basicAuth: false,
      basicAuthUser: '',
      database: '',
      isDefault: false,
      jsonData: {
        host: '',
        user: '',
        database: '',
      },
      secureJsonFields: {},
      secureJsonData: {},
      readOnly: false,
      withCredentials: false,
    },
    onOptionsChange: jest.fn(),
    ...overrides,
  } as DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData>;
}

describe('ConfigEditor', () => {
  it('renders all fields', () => {
    render(<ConfigEditor {...buildProps()} />);

    expect(screen.getByLabelText(/Host/)).toBeInTheDocument();
    expect(screen.getByLabelText(/User/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Database/)).toBeInTheDocument();
  });

  it('calls onOptionsChange when Host is changed', () => {
    const onOptionsChange = jest.fn();
    render(<ConfigEditor {...buildProps({ onOptionsChange })} />);

    const hostInput = screen.getByPlaceholderText('localhost:5432');
    fireEvent.change(hostInput, { target: { value: 'myhost:5432' } });

    expect(onOptionsChange).toHaveBeenCalledWith(
      expect.objectContaining({
        jsonData: expect.objectContaining({ host: 'myhost:5432' }),
      })
    );
  });

  it('calls onOptionsChange when Database is changed', () => {
    const onOptionsChange = jest.fn();
    render(<ConfigEditor {...buildProps({ onOptionsChange })} />);

    const dbInput = screen.getByLabelText(/Database/);
    fireEvent.change(dbInput, { target: { value: 'testdb' } });

    expect(onOptionsChange).toHaveBeenCalledWith(
      expect.objectContaining({
        jsonData: expect.objectContaining({ database: 'testdb' }),
      })
    );
  });

  it('displays existing values from jsonData', () => {
    const props = buildProps();
    props.options.jsonData = {
      host: 'localhost:5432',
      user: 'postgres',
      database: 'hermes',
    };
    render(<ConfigEditor {...props} />);

    expect(screen.getByDisplayValue('localhost:5432')).toBeInTheDocument();
    expect(screen.getByDisplayValue('postgres')).toBeInTheDocument();
    expect(screen.getByDisplayValue('hermes')).toBeInTheDocument();
  });
});
