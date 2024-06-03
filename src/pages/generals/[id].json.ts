import { GeneralClass, type GeneralClassType } from '@schemas/generalsSchema';
import {
  type APIRoute,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from 'astro';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral.ts';
import type { SpecialityType } from '@schemas/specialitySchema.ts';
import type { BookType } from '@schemas/bookSchemas.ts';

export const prerender = true;

export async function getStaticPaths() {
  const generalObjects: CollectionEntry<'generals'>[] =
    await getCollection('generals');
  return generalObjects.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

type Params = InferGetStaticParamsType<typeof getStaticPaths>; // eslint-disable-line
type Props = InferGetStaticPropsType<typeof getStaticPaths>; // eslint-disable-line

export const GET: APIRoute = async ({ params, locals }) => {
  let id: string = params.id ? params.id : '';
  if (id !== '') {
    if (id.includes('/')) {
      const temp = id.split('/').pop();
      if (temp !== undefined) {
        id = temp;
      }
    }
    console.log(`id is ${id}, params were ${JSON.stringify(params)}`);

    const entry = await getEntry('generals', id);
    if (entry !== null && entry !== undefined) {
      const gc = entry.data.general;
      const eg: ExtendedGeneralType = {
        name: gc.name,
        leadership: gc.leadership,
        leadership_increment: gc.leadership_increment,
        attack: gc.attack,
        attack_increment: gc.attack_increment,
        defense: gc.defense,
        defense_increment: gc.defense_increment,
        politics: gc.politics,
        politics_increment: gc.politics_increment,
        level: gc.level,
        stars: gc.stars,
        score_as: gc.score_as,
        note: gc.note,
        books: new Array<BookType>(),
        ascending: gc.ascending,
        specialities: new Array<SpecialityType>(),
      };
      gc.books &&
        (await Promise.all(
          gc.books.map(async (gb) => {
            const gbe = await getEntry('skillBooks', gb);
            if (gbe !== null && gbe !== undefined) {
              eg.books.push(gbe.data);
            }
          })
        ));
      gc.specialities &&
        (await Promise.all(
          gc.specialities.map(async (gs) => {
            const gse = await getEntry('specialities', gs);
            if (gse !== null && gse !== undefined) {
              eg.specialities.push(gse.data);
            }
          })
        ));
      return new Response(JSON.stringify(eg), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  return new Response(null, {
    status: 404,
    statusText: 'Not found',
  });
};
