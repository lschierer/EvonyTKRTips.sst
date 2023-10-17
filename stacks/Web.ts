import {use, AppSyncApi, StaticSite, Table, Api as ApiGateway} from "sst/constructs";
import type { StackContext } from 'sst/constructs';
import * as cdk from "aws-cdk-lib";

export function Web({ stack }: StackContext) {


  const site = new StaticSite(stack, "Site", {
    path: './',
    buildCommand: "pnpm run build",
    buildOutput: "dist",
    cdk: {
      distribution: {
        defaultRootObject: "index.html",
      },
    },

    customDomain: {
      domainName: stack.stage === "prod" ? "evonytkrtips.net" : `${stack.stage}.evonytkrtips.net`,
      domainAlias: stack.stage === "prod" ? "www.evonytkrtips.net" : `www.${stack.stage}.evonytkrtips.net`,
      hostedZone: "evonytkrtips.net",
    },
    environment: {

    },
  });

  stack.addOutputs({
    SITE: site.url,
  });

  return {

    site
  };
}

// vi: ts=2:sw=2:expandtab:

