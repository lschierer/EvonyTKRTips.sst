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
  type generalObject, generalConflictArraySchema
} from "@schemas/evonySchemas.ts";


export const GET: APIRoute = async ({ params, request }) => {
  const conflictArrayObject: CollectionEntry<'generalConflictData'>[]  = await getCollection('generalConflictData');
  if(conflictArrayObject !== null && conflictArrayObject !== undefined) {
    const validation = generalConflictArraySchema.safeParse(conflictArrayObject);
    if(validation.success) {
      return new Response(
        JSON.stringify(validation.data)
      )
    }
  }
  return new Response(JSON.stringify(''))
}
