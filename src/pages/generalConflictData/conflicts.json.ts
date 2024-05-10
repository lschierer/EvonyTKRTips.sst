import {
  type APIRoute,
} from 'astro';
import { getCollection,  type CollectionEntry  } from 'astro:content';

import {
  ConflictDatum
} from "@schemas/index";


export const GET: APIRoute = async () => {
  const collectionArray:CollectionEntry<'generalConflictData'>[]  = await getCollection('generalConflictData');
  if(collectionArray !== null && collectionArray !== undefined) {
    const result = collectionArray.map((ca) => {
      const validation = ConflictDatum.safeParse(ca.data);
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
