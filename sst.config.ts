/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "evonytkrtips",
      removal: input?.stage.toLocaleLowerCase().includes("prod")
        ? "retain"
        : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: "home",
          region: 'us-east-2',
        },
      },
    };
  },
  async run() {
    const site = new sst.aws.Astro("Site", {
      path: './',
      buildCommand: "pnpm build",
      dev: {
        command: "pnpm dev",
        url: "http://localhost:4321/",
      },
      server: {
        memory: "4 GB",
      },
      transform: {
        cdn: {
          defaultRootObject: "index.html",
        }
      },
      domain: {
        name: $app.stage.toLocaleLowerCase().includes("prod") ? 
          "evonytkrtips.net" : 
          `${$app.stage.toLocaleLowerCase()}.evonytkrtips.net`,
        aliases: [
            $app.stage.toLocaleLowerCase().includes("prod") ? 
          "www.evonytkrtips.net" : 
          `www.${$app.stage.toLocaleLowerCase()}.evonytkrtips.net`,
        ],
        dns: sst.aws.dns({
            
          }),
      },
    });
    
  },
});
