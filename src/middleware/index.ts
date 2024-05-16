import { defineMiddleware, sequence } from "astro:middleware";

import { DisplayGeneralsMW } from "./generals";

const DEBUG = true;

const defaultHandler = defineMiddleware((context, next) => {
    if(DEBUG) console.log(`toplevel Middleware running`)
    const thisRoute = context.url.pathname;
    
    return next();
});

export const onRequest = sequence(DisplayGeneralsMW, defaultHandler);