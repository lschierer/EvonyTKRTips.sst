import { StaticSite, StackContext, use } from "sst/constructs";
import { Api } from "./Api.js";
import * as cdk from "aws-cdk-lib";


import { RemovalPolicy } from "aws-cdk-lib";
import {
  ViewerProtocolPolicy,
  AllowedMethods,
} from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";


export function Web({ app, stack }: StackContext) {

  const api = use(Api);

  const site = new StaticSite(stack, "Site", {
    path: './',
    buildCommand: "pnpm run build",
    buildOutput: "dist",
    environment: {
      VITE_GRAPHQL_URL: api.url + "/graphql",
    },
    cdk: {
      distribution: {
        defaultRootObject: "index.html",
      },
    },
    nodejs: {
      minify: false,
      sourcemap: true,
    },
    customDomain: {
      domainName: app.stage === "prod" ? "evonytkrtips.net" : `${app.stage}.evonytkrtips.net`,
      domainAlias: app.stage === "prod" ? "www.evonytkrtips.net" : `www.${app.stage}.evonytkrtips.net`,
      hostedZone: "evonytkrtips.net",
    },

  });

  stack.addOutputs({
    URL: site.url,
  });
}

// vi: ts=2:sw=2:expandtab:
