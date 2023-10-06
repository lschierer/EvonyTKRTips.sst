import {use, AppSyncApi, StaticSite, Table, Api as ApiGateway} from "sst/constructs";
import type { StackContext } from 'sst/constructs';
import * as cdk from "aws-cdk-lib";

export function Web({ stack }: StackContext) {

  const table = new Table(stack, "db", {
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
    },
    primaryIndex: {
      partitionKey: "pk",
      sortKey: "sk",
    },
    globalIndexes: {
      gsi1: {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk",
      },

    },
    cdk: {
      table: {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    },
  });

  // Create the API
  const api = new ApiGateway(stack, "ApiGateway", {
    cors: {
      allowMethods: ["GET"],
    },
    routes: {
      "GET /generalList": "packages/functions/src/server/index.handler",
      "GET /generalByID": "packages/functions/src/server/index.handler",
    }
  });
  
  api.bind([table]);

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
      VITE_APP_API_URL: api.url ,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SITE: site.url,
  });

  return {
    table,
    api,
    site
  };
}

// vi: ts=2:sw=2:expandtab:

