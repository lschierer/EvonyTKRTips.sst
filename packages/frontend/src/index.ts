import mojo, {yamlConfigPlugin} from '@mojojs/core';

export const app = mojo();

app.plugin(yamlConfigPlugin);
app.secrets = app.config.secrets;

app.get('/').to('example#welcome');

app.start();
