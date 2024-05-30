/// <reference path="./.sst/platform/config.d.ts" />

import { HostedZone } from "aws-cdk-lib/aws-route53";


export default $config({
  app(input) {
    return {
      name: "evonytkrtips",
      profile: "home",
      buildCommand: "pnpm run build",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-2"
        }
      },
    };
  },
  async run() {
    new sst.aws.Astro("EvonyTKRTips",{
      domain: {
        name: $app.stage === 'production' ? "evonytkrtips.net" : `${$app?.stage}.evonytkrtips.net`,
        aliases: $app?.stage === 'production' ? ["www.evonytkrtips.net"] : [`www.${$app?.stage}.evonytkrtips.net`],
      },
    });
  },
});
