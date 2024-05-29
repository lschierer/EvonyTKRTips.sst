import { GeneralClass, type GeneralClassType } from '@schemas/generalsSchema';
import {
  type APIRoute,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from 'astro';
import { getCollection, getEntry, type CollectionEntry  } from 'astro:content';

export const prerender = true;

export async function getStaticPaths() {
  const generalObjects: CollectionEntry<'generals'>[]  = await getCollection('generals');
  return generalObjects.map(entry => ({
    params: {id: entry.id,}, props: { entry },
  }));
}

type Params = InferGetStaticParamsType<typeof getStaticPaths>; // eslint-disable-line
type Props = InferGetStaticPropsType<typeof getStaticPaths>; // eslint-disable-line

export const GET: APIRoute = async ({ params, locals }) => {
  let id: string = params.id ? params.id : '';
  if(id !== '') {
    if(id.includes('/')){
      const temp = id.split('/').pop() ;
      if(temp !== undefined) {
        id = temp;
      }
    }
    console.log(`id is ${id}, params were ${JSON.stringify(params)}`)
    if(Array.isArray(locals.CachedGenerals) && locals.CachedGenerals.length > 0) {
      const found = locals.CachedGenerals.find((thisG: GeneralClassType) => {
        if(!id.localeCompare(thisG.name)) {
          return true;
        }
        return false
      })
      if(found !== null && found !== undefined) {
        const v1 = GeneralClass.safeParse(found)
        if(found.success) {
          return new Response(
            JSON.stringify(v1.data),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
        }
      }
    } else {
      const entry = await getEntry('generals',id);
      if(entry !== null && entry !== undefined) {
        const v1 = GeneralClass.safeParse(entry.data.general)
        return new Response(
          JSON.stringify(v1.data),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      }
    }
  }
  return new Response(null, {
    status: 404,
    statusText: 'Not found'
  });
  
}


