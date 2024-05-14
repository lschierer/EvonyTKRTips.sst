export const prerender = false;

import {
  type APIRoute,
  
  type GetStaticPaths,
  type GetStaticPathsItem,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from 'astro';

import { getEntry, getCollection, z } from 'astro:content'

import {
  AscendingLevels,
  Attribute,
  beast,
  Buff,
  Condition,
  GeneralClass,
  generalUseCase,
  levels,
  qualityColor,
  ValueSchema,
} from '@schemas/index'


const AttackParams = z.object({
  id: z.string(),
  special1: qualityColor,
  special2: qualityColor,
  special3: qualityColor,
  special4: qualityColor,
  special5: qualityColor.optional(),
  stars: AscendingLevels,
  dragon: z.boolean().default(false),
  beast: z.boolean().default(false),
})

type AttackParamsType = z.infer<typeof AttackParams>;

const relevantLevels = ['0',
  '1',
  '2',
  '3',
  '4',
  '5',];

export const getStaticPaths = (async () => {
  const returnable = Array<GetStaticPathsItem>();

  const generals = await getCollection('generals');
  generals.map((general) => {
    if (general?.id !== undefined && general?.id !== null) {
      const name = general.id;
      qualityColor.options.map((s1) => {
        qualityColor.options.map((s2) => {
          qualityColor.options.map((s3) => {
            qualityColor.options.map((s4) => {
              const r1: Array<GetStaticPathsItem> = qualityColor.options.map((s5) => {
                const rs: Array<GetStaticPathsItem> = relevantLevels.map((sl) => {
                  return [
                    {
                      params: { 
                        path: `${name}/${s1}/${s2}/${s3}/${s4}/${s5}/${sl}/false/false`
                      }
                    },
                    {
                      params: {
                        path: `${name}/${s1}/${s2}/${s3}/${s4}/${s5}/${sl}/true/false`
                      }
                    },
                    {
                      params: {
                        path: `${name}/${s1}/${s2}/${s3}/${s4}/${s5}/${sl}/false/true`
                      }
                    }
                  ]
                }).flat();
                return rs.flat();
              }).flat();
              const r2: Array<GetStaticPathsItem> = relevantLevels.map((sL) => {
                const rs: Array<GetStaticPathsItem> = relevantLevels.map((sl) => {
                  return [
                    {
                      params: {
                        path: `${name}/${s1}/${s2}/${s3}/${s4}/${sl}/false/false`
                      }
                    },
                    {
                      params: {
                        path: `${name}/${s1}/${s2}/${s3}/${s4}/${sl}/true/false`
                      }
                    },
                    {
                      params: {
                        path: `${name}/${s1}/${s2}/${s3}/${s4}/${sl}/false/true`
                      }
                    }
                  ]
                }).flat()
                return r2;
              }).flat();
              returnable.push(...r1, ...r2)
            })
          })
        })
      })
    }
  })

  return returnable;
}) satisfies GetStaticPaths;

const attackBuff = z.function()
  .args(GeneralClass, generalUseCase, AttackParams)
  .returns(z.union([ValueSchema, z.array(ValueSchema)]))

export const GET: APIRoute = async ({ params, request }) => {
  let id: string = params.id ? params.id : '';
  const req = request;
  if (id !== '') {
    if (id.includes('/')) {
      const temp = id.split('/').pop();
      if (temp !== undefined) {
        id = temp;
      }
    }
    console.log(`id is ${id}, request was ${req.url.toString()}`)
    const entry = await getEntry('generals', id);
    if (entry !== null && entry !== undefined) {
      const general = entry.data.general;
      return new Response(
        JSON.stringify(entry.data)
      )
    }
  }
  return new Response(JSON.stringify(''))
}


