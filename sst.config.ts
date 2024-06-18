/// <reference path="./.sst/platform/config.d.ts" />
import { HostedZone } from "aws-cdk-lib/aws-route53";
import * as pulumi from "@pulumi/pulumi";
import { Subnet } from 'aws-cdk-lib/aws-ec2';


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
          region: "us-east-2",
        },
        docker: true,
        pulumi: true,
        awsx: {
          region: "us-east-2",
        },
      },
    };
  },
  async run() {

    const vpc = new sst.aws.Vpc("EvonyVpc", {
      transform: {
        vpc: {
          cidrBlock: "10.0.0.0/16",
          assignGeneratedIpv6CidrBlock: true,
        }
      }
    });

    const cluster = new sst.aws.Cluster("EvonyCluster", { vpc });

    cluster.addService("EvonyService", {
      public: {
        ports: [
          { listen: "80/http" },
        ],
      },
    });
  },
});
