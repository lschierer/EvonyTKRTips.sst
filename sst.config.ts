/// <reference path="./.sst/platform/config.d.ts" />

import { build } from "astro";
import { App } from "aws-cdk-lib";

export default $config({
  app(input) {
    return {
      name: "EvonyTKRTips",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      region: "us-east-2",
    };
  },
  async run() {
    new sst.aws.Astro("Site", {
      build: {
        command: 'pnpm build',
        output: 'dist',
      }
      
    });
  },
});
