import {use, StackContext, StaticSite, Table, Api} from "sst/constructs";
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
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      "POST /notes": "packages/functions/src/create.main",
    },
  });

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
      VITE_GRAPHQL_URL: api.url + "/graphql",
    },
  });

  stack.addOutputs({
    SITE: site.url,
  });
}

// vi: ts=2:sw=2:expandtab:

