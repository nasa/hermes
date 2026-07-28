import { exec, spawn } from 'child_process';
import { createConnection } from 'net';
import { test, expect } from '@grafana/plugin-e2e';
import { MyDataSourceOptions, MySecureJsonData } from '../src/types';

function runCommand(dir: string, name: string, ...args: string[]) {
  return new Promise((resolve, reject) => exec(`${name} ${args.join(' ')}`, { cwd: dir }, (error, stdout, stderr) => {
    if (error) {
      reject(error);
    } else {
      resolve({ stdout, stderr });
    }
  }));
}

function startCommand(dir: string, name: string, ...args: string[]): () => Promise<void> {
  const backend = spawn(name, args, { cwd: dir, stdio: 'inherit' })
    .on('error', (err) => console.error(err));
  return () => new Promise<void>(resolve => {
    backend.kill();
    backend.once('exit', resolve);
  });
}

function waitPort(target: string, retries = 10, timeout = 500) {
  const [host, portStr] = target.split(':');
  const port = Number(portStr);

  return new Promise<void>((resolve, reject) => {
    const tryPort = () => {
      const socket = createConnection({ host, port }).setTimeout(timeout);
      let done = false;

      const onFinish = (sucess: boolean) => {
        if (done) return;
        done = true;
        socket.destroy();
        if (sucess) {
          resolve();
        } else if (retries-- <= 0) {
          reject(new Error(`Port ${target} did not open in time`));
        } else {
          setTimeout(tryPort, timeout);
        }
      };
      socket.on('connect', () => onFinish(true))
        .on('error', () => onFinish(false))
        .on('timeout', () => onFinish(false))
    };
    tryPort();
  });
}

test('smoke: should render config editor', async ({ createDataSourceConfigPage, readProvisionedDataSource, page }) => {
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await createDataSourceConfigPage({ type: ds.type });
  await expect(page.getByRole('textbox', { name: 'Host' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'User' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Database' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Hermes' })).toBeVisible();
});

test('"Save & test" should be successful when configuration is valid', async ({
  createDataSourceConfigPage,
  readProvisionedDataSource,
  page,
}) => {
  const ds = await readProvisionedDataSource<MyDataSourceOptions, MySecureJsonData>({ fileName: 'datasources.yml' });

  // Bind to 0.0.0.0 in CI so docker can connect to it
  const bindHost = process.env.CI ? '0.0.0.0' : 'localhost';
  await runCommand('..', 'make', 'out/backend').catch((err) => console.error(err));
  const backendKill = startCommand('..', './out/backend', '--bind-type', 'tcp', '--bind', `${bindHost}:6880`);
  await waitPort('localhost:6880').catch((err) => console.error(err));

  try {
    const configPage = await createDataSourceConfigPage({ type: ds.type });
    await page.getByRole('textbox', { name: 'Host' }).fill(ds.jsonData.host ?? '');
    await page.getByRole('textbox', { name: 'User' }).fill(ds.jsonData.user ?? '');
    await page.locator('#config-editor-password').fill(ds.secureJsonData?.password ?? '');
    await page.getByRole('textbox', { name: 'Database' }).fill(ds.jsonData.database ?? '');
    await page.getByRole('textbox', { name: 'Hermes' }).fill(ds.jsonData.hermes ?? '');
    await expect(configPage.saveAndTest()).not.toBeOK();
    await expect(configPage).toHaveAlert('error', { hasText: 'Status of connection to Hermes is unknown, no dictionaries are loaded or registered yet.' });
  } finally {
    await backendKill();
  }
});

test('"Save & test" should fail when configuration is invalid', async ({
  createDataSourceConfigPage,
  readProvisionedDataSource,
  page,
}) => {
  const ds = await readProvisionedDataSource<MyDataSourceOptions, MySecureJsonData>({ fileName: 'datasources.yml' });
  const configPage = await createDataSourceConfigPage({ type: ds.type });
  await page.getByRole('textbox', { name: 'Hermes' }).fill(ds.jsonData.hermes ?? '');
  await expect(configPage.saveAndTest()).not.toBeOK();
  await expect(configPage).toHaveAlert('error', { hasText: 'unable to initialize hermes client' });
});
