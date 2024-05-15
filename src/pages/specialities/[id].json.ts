import {
  type APIRoute,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
  type getStaticPaths,
} from 'astro';
import { getCollection, getEntry, type CollectionEntry  } from 'astro:content';

export const prerender = true;
const DEBUG = false;

export const getStaticPaths = (async () => {
  const specialityObjects: CollectionEntry<'specialities'>[]  = await getCollection('specialities');
  return specialityObjects.map(entry => ({
    params: {id: entry.id,}, props: { entry },
  }));
}) satisfies getStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>; // eslint-disable-line
type Props = InferGetStaticPropsType<typeof getStaticPaths>; // eslint-disable-line

export const GET: APIRoute = async ({ params }) => {
  let id: string = params.id ? params.id : '';
  if(id !== '') {
    if(id.includes('/')){
      const temp = id.split('/').pop() ;
      if(temp !== undefined) {
        id = temp;
      }
    }
    if (DEBUG) console.log(`id is ${id}, params were ${JSON.stringify(params)}`)
    const entry = await getEntry('specialities',id);
    if(entry !== null && entry !== undefined) {
      return new Response(
        JSON.stringify(entry.data)
      )
    }
  }
  return new Response(JSON.stringify(''))
}


