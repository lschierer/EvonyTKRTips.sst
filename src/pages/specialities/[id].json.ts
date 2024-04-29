import {
  type APIRoute,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from 'astro';
import { getCollection, getEntry, type CollectionEntry  } from 'astro:content';

export const prerender = true;

export async function getStaticPaths() {
  const specialityObjects: CollectionEntry<'specialities'>[]  = await getCollection('specialities');
  return specialityObjects.map(entry => ({
    params: {id: entry.id,}, props: { entry },
  }));
}

type Params = InferGetStaticParamsType<typeof getStaticPaths>; // eslint-disable-line
type Props = InferGetStaticPropsType<typeof getStaticPaths>; // eslint-disable-line

export const GET: APIRoute = async ({ params, request }) => {
  let id: string = params.id ? params.id : '';
  const req = request;
  if(id !== '') {
    if(id.includes('/')){
      const temp = id.split('/').pop() ;
      if(temp !== undefined) {
        id = temp;
      }
    }
    console.log(`id is ${id}, request was ${req.url.toString()}`)
    const entry = await getEntry('specialities',id);
    if(entry !== null && entry !== undefined) {
      return new Response(
        JSON.stringify(entry.data)
      )
    }
  }
  return new Response(JSON.stringify(''))
}


