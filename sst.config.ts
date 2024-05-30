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
      domain: {
        name: input?.stage === 'production' ? "evonytkrtips.net" : `${input?.stage}.evonytkrtips.net`,
        aliases: input?.stage === 'production' ? ["www.evonytkrtips.net"] : [`www.${input?.stage}.evonytkrtips.net`],
      },
    };
  },
  async run() {
    new sst.aws.Astro("EvonyTKRTips");
  },
});
