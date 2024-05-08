export const prerender = false;

import {
  type APIContext
} from 'astro';
import { getCollection,  type CollectionEntry  } from 'astro:content';

import {
  ConflictDatum,
  type ConflictDatumType,
  generalConflicts
} from "@schemas/index";

export async function GET ({ params }: APIContext) {
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
