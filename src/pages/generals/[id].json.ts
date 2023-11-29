import {
  type APIRoute,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
  type GetStaticPaths
} from 'astro';
import { getCollection, getEntry, type CollectionEntry  } from 'astro:content';

import type { HTMLAttributes } from 'astro/types'
import {z, ZodError} from 'zod'

import {
  GeneralClass,
  type GeneralClassType,
  GeneralElement,
  type GeneralElementType
} from "@schemas/index";


export const GET: APIRoute = async ({ params, request }) => {
  let id: string = params.id ? params.id : '';
  if(id !== '') {
    if(id.includes('/')){
      const temp = id.split('/').pop() ;
      if(temp !== undefined) {
        id = temp;
      }
    }
    console.log(`id is ${id}`)
    const entry = await getEntry('generals',id);
    if(entry !== null && entry !== undefined) {
      return new Response(
        JSON.stringify(entry.data)
      )
    }
  }
  return new Response(JSON.stringify(''))
}

export async function getStaticPaths() {
  const generalObjects: CollectionEntry<'generals'>[]  = await getCollection('generals');
  return generalObjects.map(entry => ({
    params: {id: entry.id,}, props: { entry },
  }));
}

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
