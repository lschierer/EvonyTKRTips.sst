import { use, GraphQLApi, StackContext, Api as ApiGateway } from "sst/constructs";
import { Database } from "./Database.js";

export function Api({ stack }: StackContext) {
    const api = new GraphQLApi(stack, "ApolloApi", {
        server: {
            handler: "packages/functions/src/lambda.handler",
            bundle: {
                format: "cjs",
            },
        },
    });

    // Show the API endpoint in output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    return api;
}