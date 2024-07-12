import mojo, { yamlConfigPlugin } from '@mojojs/core';
import { App } from '@mojojs/core/lib/app';

export const app: App = mojo();

app.plugin(yamlConfigPlugin);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
app.secrets = app.config.secrets;

app.get('/').to('example#welcome');

await app.start();
