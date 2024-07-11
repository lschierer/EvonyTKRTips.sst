import mojo, {yamlConfigPlugin} from '@mojojs/core';
import { type App } from '@mojojs/core/lib/app';

export const app: App = mojo();

app.plugin(yamlConfigPlugin);
app.secrets = app.config.secrets;

app.get('/').to('example#welcome');

app.start();
