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
  const collectionArray:CollectionEntry<generalConflictData>[]  = await getCollection('generalConflictData');
  if(collectionArray !== null && collectionArray !== undefined) {
    let result = collectionArray.map((ca) => {
      console.error(JSON.stringify(ca))
      const validation = generalConflictArraySchema.safeParse(ca.data);
      if(validation.success) {

        return validation.data.conflicts
      } else{
        console.error(`bad validation`)
        console.error(validation.error)
        return new Response(
            JSON.stringify('bad validation')
        )
      }
    })
    return new Response(JSON.stringify(result))
  }
  return new Response(JSON.stringify('end'))
}
