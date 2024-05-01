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
  GeneralClass,
  type GeneralClassType,
  GeneralElement,
  type GeneralElementType, generalConflicts
} from "@schemas/index";


export const GET: APIRoute = async ({ params, request }) => {
  const collectionArray:CollectionEntry<'generalConflictData'>[]  = await getCollection('generalConflictData');
  if(collectionArray !== null && collectionArray !== undefined) {
    const result = collectionArray.map((ca) => {
      const validation = generalConflicts.safeParse(ca.data);
      if(validation.success) {

        return validation.data
      } else{
        
        return new Response(
            JSON.stringify('bad validation')
        )
      }
    })
    return new Response(JSON.stringify(result))
  }
  return new Response(JSON.stringify('end'))
}
