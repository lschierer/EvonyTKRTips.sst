/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "evonytkrtips",
      removal: input?.stage.toLocaleLowerCase().includes('prod') ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: 'home',
        }
      },
    };
  },
  async run() {
    new sst.aws.Astro("MyWeb", {
      domain: {
        name: $app?.stage.toLocaleLowerCase().includes('prod') ? 
          'evonytkrtips.net' :
          `${$app.stage}.evonytkrtips.net`,
      },
    });
  },
});
