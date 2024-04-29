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
  Speciality,
  type SpecialityType,
} from "@schemas/index";


export const GET: APIRoute = async ({ params, request }) => {
  const specialityObjects: CollectionEntry<'specialities'>[]  = await getCollection('specialities');
  if(specialityObjects !== null && specialityObjects !== undefined) {
    
    let specialityIterator = specialityObjects.values();
    let allSpecialities = new Array<SpecialityType>();
    for (const v of specialityIterator) {
      const validation = Speciality.safeParse(v.data);
      if(validation.success) {
        allSpecialities.push(validation.data);
      }
    }
    return new Response(
      JSON.stringify(allSpecialities)
    )
  }

  return new Response(JSON.stringify(''))
}
