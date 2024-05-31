export const prerender = true;

import {
  type APIRoute,
  type GetStaticPaths,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

import { ConflictDatum } from '@schemas/conflictSchemas';

export const getStaticPaths = (async () => {
  const generalObjects: CollectionEntry<'generals'>[] =
    await getCollection('generals');
  const returnable = generalObjects.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
  return returnable;
}) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>; // eslint-disable-line
type Props = InferGetStaticPropsType<typeof getStaticPaths>; // eslint-disable-line

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (id !== undefined && id !== null) {
    const collectionArray: CollectionEntry<'generalConflictData'>[] =
      await getCollection('generalConflictData', ({ data }) => {
        const c = Object.values(data.members).flat();
        if (Array.isArray(data.others)) {
          c.push(...Object.values(data.others).flat());
        }
        if (c.includes(id)) {
          return true;
        }
      });

    if (collectionArray !== null && collectionArray !== undefined) {
      const result = collectionArray.map((ca) => {
        const validation = ConflictDatum.safeParse(ca.data);
        if (validation.success) {
          return validation.data;
        } else {
          return new Response(JSON.stringify('bad validation'));
        }
      });
      return new Response(JSON.stringify(result));
    }
  }

  return new Response(JSON.stringify('id undefined'));
};
