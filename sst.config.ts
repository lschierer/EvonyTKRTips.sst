/// <reference path="./.sst/platform/config.d.ts" />

import { HostedZone } from "aws-cdk-lib/aws-route53";

export default $config({
  app(input) {
    return {
      name: "EvonyTKRTips",
      profile: "home",
      buildCommand: "pnpm run build",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      domain: {
        name: input?.stage === 'production' ? "evonytkrtips.net" : `${input?.stage}.evonytkrtips.net`,
        aliases: input?.stage === 'production' ? ["www.evonytkrtips.net"] : [`www.${input?.stage}.evonytkrtips.net`],
        dns: sst.aws.dns({
          zone: 'Z02705452UES0AYN9485J',
        })
      },
    };
  },
  async run() {
    new sst.aws.Astro("EvonyTKRTips");
  },
});
