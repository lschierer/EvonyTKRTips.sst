import {
  type APIRoute,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
  type GetStaticPaths
} from 'astro';
import { getCollection,  type CollectionEntry  } from 'astro:content';

import type { HTMLAttributes } from 'astro/types'
import {z, ZodError} from 'zod'

import {
  generalSchema,
  type General,
  generalObjectSchema,
  type generalObject
} from "@schemas/evonySchemas.ts";


export const GET: APIRoute = async ({ params, request }) => {
  const generalObjects: CollectionEntry<'generals'>[]  = await getCollection('generals');
  if(generalObjects !== null && generalObjects !== undefined) {
    
    let generalIterator = generalObjects.values();
    let allGenerals = new Array<generalObject>();
    for (const v of generalIterator) {
      const validation = generalObjectSchema.safeParse(v.data);
      if(validation.success) {
        allGenerals.push(validation.data);
      }
    }
    return new Response(
      JSON.stringify(allGenerals)
    )
  }

  return new Response(JSON.stringify(''))
}
