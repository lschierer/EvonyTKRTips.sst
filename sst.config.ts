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
    const EvonyVpc = new sst.aws.Vpc('EvonyVpc',{
      transform: {
        vpc: {
          assignGeneratedIpv6CidrBlock: true,
          enableDnsHostnames: true,
          enableDnsSupport: true,
          cidrBlock: "10.0.0.0/16",
        }
      }
    });

    const EvonyCluster = new sst.aws.Cluster("EvonyTKRTips",{
      vpc: EvonyVpc,
    });

    EvonyCluster.addService('EvonyService', {
      scaling: {
        min: 1,
        max: 2,
      },
      public: {
        ports: [
          {
            listen: '4321/http'
          },
        ],
      },
    });


  },
});
