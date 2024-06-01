import { defineMiddleware, sequence } from 'astro:middleware';

import { DisplayGeneralsMW } from './generals';

const DEBUG = false;

const defaultHandler = defineMiddleware(async (context, next) => {
  if (DEBUG) console.log(`toplevel Middleware running`);
  const thisRoute = context.url.pathname;

  return next();
});

export const onRequest = await sequence(DisplayGeneralsMW, defaultHandler);