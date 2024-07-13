import mojo, { yamlConfigPlugin } from '@mojojs/core';
import { type MojoApp } from '@mojojs/core';
import nunjucksPlugin from 'mojo-plugin-nunjucks';

export const app: MojoApp = mojo();
app.plugin(nunjucksPlugin);
app.renderer.defaultEngine = 'njk';

app.plugin(yamlConfigPlugin);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
app.secrets = app.config.secrets;

app.get('/', async (ctx) => {
  await ctx.render({
    view: 'index',
  });
});

await app.start();
