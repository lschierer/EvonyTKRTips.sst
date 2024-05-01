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
  type GeneralElementType,
} from "@schemas/index";


export const GET: APIRoute = async ({ params, request }) => {
  const generalObjects: CollectionEntry<'generals'>[]  = await getCollection('generals');
  if(generalObjects !== null && generalObjects !== undefined) {
    
    const generalIterator = generalObjects.values();
    const allGenerals = new Array<GeneralElementType>();
    for (const v of generalIterator) {
      const validation = GeneralElement.safeParse(v.data);
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
