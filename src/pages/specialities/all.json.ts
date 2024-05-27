import {
  type APIRoute,
} from 'astro';
import { getCollection,  type CollectionEntry  } from 'astro:content';

import {
  Speciality,
  type SpecialityType,
} from '@schemas/specialitySchema'


export const GET: APIRoute = async () => {
  const specialityObjects: CollectionEntry<'specialities'>[]  = await getCollection('specialities');
  if(specialityObjects !== null && specialityObjects !== undefined) {
    
    const specialityIterator = specialityObjects.values();
    const allSpecialities = new Array<SpecialityType>();
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
