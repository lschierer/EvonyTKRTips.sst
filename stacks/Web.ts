import { AstroSite, StackContext } from "sst/constructs";
import * as cdk from "aws-cdk-lib";

import { RemovalPolicy } from "aws-cdk-lib";
import {
  ViewerProtocolPolicy,
  AllowedMethods,
} from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";


export function Web({ app, stack }: StackContext) {

  const site = new AstroSite(stack, "Site", {
    path: './',
    nodejs: {
      minify: false,
      sourcemap: true,
    },
    customDomain: {
      domainName: app.stage === "prod" ? "beta.evonytkrtips.net" : `${app.stage}.evonytkrtips.net`,
      domainAlias: app.stage === "prod" ? "www.beta.evonytkrtips.net" : `www.${app.stage}.evonytkrtips.net`,
      hostedZone: "evonytkrtips.net",
    },

  });

  stack.addOutputs({
    URL: site.url,
  });
}

// vi: ts=2:sw=2:expandtab:
