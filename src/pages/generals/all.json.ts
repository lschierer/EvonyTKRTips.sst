import {
  type APIRoute,
} from 'astro';
import { getCollection,  type CollectionEntry  } from 'astro:content';

import {
  GeneralElement,
  type GeneralElementType,
} from "@schemas/index";


export const GET: APIRoute = async () => {
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
