import { Bucket, Config, StackContext, StaticSite } from "sst/constructs";
import * as cdk from "aws-cdk-lib";

import { RemovalPolicy } from "aws-cdk-lib";
import {
  ViewerProtocolPolicy,
  AllowedMethods,
} from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";


export function Web({ app, stack }: StackContext) {

  const site = new StaticSite(stack, "Site", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "pnpm run build",
    indexPage: "index.html",
    cdk: {
      bucket: {
        cdk: {
          bucket: {
            autoDeleteObjects: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
          },
        },
        cors: [
          {
            allowedMethods: ["GET", "HEAD"],
            allowedOrigins: [
              "https://www.beta.evonytkrtips.net",
              "https://beta.evonytkrtips.net",
              `https://${app.stage}.evonytkrtips.net`,
              `https://www.${app.stage}.evonytkrtips.net`
            ],
          },
        ],
      },
      distribution: {
        defaultBehavior: {
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        },
      },
    },
    customDomain: {
      domainName: app.stage === "prod" ? "beta.evonytkrtips.net" : `${app.stage}.evonytkrtips.net`,
      domainAlias: app.stage === "prod" ? "www.beta.evonytkrtips.net" : `www.${app.stage}.evonytkrtips.net`,
      hostedZone: "evonytkrtips.net",
    },
    fileOptions: [
       {
         exclude: "*",
         include: ["*.html", "*.svg"],
         cacheControl: "max-age=0,no-cache,no-store,must-revalidate",
      },
      {
        exclude: "*",
        include: ["*.js", "*.css"],
        cacheControl: "max-age=60,public,immutable",
      },
    ]
  });

}

// vi: ts=2:sw=2:expandtab:
