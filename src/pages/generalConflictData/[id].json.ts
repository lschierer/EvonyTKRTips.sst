export const prerender = true;

import {
  type APIContext,
  type APIRoute,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from 'astro';
import { getCollection,  type CollectionEntry  } from 'astro:content';

import {
  ConflictDatum,
  type ConflictDatumType,
  generalConflicts
} from "@schemas/index";

export async function getStaticPaths() {
  const generalObjects: CollectionEntry<'generals'>[]  = await getCollection('generals');
  const returnable =  generalObjects.map(entry => ({
    params: {id: entry.id,}, props: { entry },
  }));
  return returnable;
}

type Params = InferGetStaticParamsType<typeof getStaticPaths>; // eslint-disable-line
type Props = InferGetStaticPropsType<typeof getStaticPaths>; // eslint-disable-line

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if(id !== undefined && id !== null) {
    const collectionArray:CollectionEntry<'generalConflictData'>[]  = await 
    getCollection('generalConflictData', ({data}) => {
      const c =  Object.values(data.conflicts).flat();
      if(c.includes(id)) {
        return true;
      }
    });

    if(collectionArray !== null && collectionArray !== undefined) {
      const result = collectionArray.map((ca) => {
        const validation = generalConflicts.safeParse(ca.data);
        if(validation.success) {
  
          return validation.data
        } else{
          
          return new Response(JSON.stringify('bad validation'))
          
        }
      })
      return new Response(JSON.stringify(result))
    }
  }
  
  return new Response(JSON.stringify('id undefined'));
  
}
