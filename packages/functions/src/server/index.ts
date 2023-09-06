import {General} from '@core/general';
import {publicProcedure, router} from './trpc';
import {CreateAWSLambdaContextOptions, awsLambdaRequestHandler} from '@trpc/server/adapters/aws-lambda';
import {inferAsyncReturnType} from '@trpc/server';
import {z} from 'zod';
import {APIGatewayProxyEventV2} from "aws-lambda";

const appRouter = router({
  generalList: publicProcedure
    .query(async () => {
      // Retrieve users from a datasource, this is an imaginary database
      const generals = await General.list();
      return generals;
    }),
  
  generalByID: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const {input} = opts;
      const general = await General.generalByID(input);
      return general;
    }),
  
  
});

const createContext = ({
                         event,
                         context,
                       }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({}) // no context

type Context = inferAsyncReturnType<typeof createContext>;

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
})