export const prerender = true;

import {BaseN} from 'js-combinatorics';

import {
  type APIRoute,
  
  type GetStaticPaths,
  type GetStaticPathsItem,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from 'astro';

import { getEntry, getCollection, z } from 'astro:content'

import {
  type ActivationSituationsType,
  AscendingLevels,
  Attribute,
  
  type AttributeType,
  beast,
  Buff,
  Condition,
  type ConditionType,
  GeneralClass,
  generalUseCase,
  levels,
  qualityColor,
  ValueSchema,
  type GeneralClassType,
  generalSpecialists,
  type generalSpecialistsType,
  type generalUseCaseType,
} from '@schemas/index'

import { isBuffEffective } from '@lib/buffUtils';

const DEBUG = true;

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

  const ColorBaseN = new BaseN(qualityColor.options, 5);
  const ColorArray = [...ColorBaseN].filter((ca) => {
    if(ca[3].localeCompare(qualityColor.enum.Disabled)) {
      if(ca[0].localeCompare(qualityColor.enum.Gold)) {
        if(DEBUG) console.log(`ca false 1 for ${ca.toString()}`)
        return false
      }
      if(ca[1].localeCompare(qualityColor.enum.Gold)) {
        if(DEBUG) console.log(`ca false 2 for ${ca.toString()}`)
        return false
      }
      if(ca[2].localeCompare(qualityColor.enum.Gold)) {
        if(DEBUG) console.log(`ca false 3 for ${ca.toString()}`)
        return false
      }
    } else {
      if(DEBUG) console.log(`ca3 if passed ${ca.toString()}`)
    }
    if(ca[4].localeCompare(qualityColor.enum.Disabled)) {
      if(ca[3].localeCompare(qualityColor.enum.Gold)) {
        if(DEBUG) console.log(`ca false 4 for ${ca.toString()}`)
        return false
      }else {
        if(DEBUG) console.log(`ca3 if passed for ${ca.toString()}`)
      }
    } else {
      if (DEBUG) console.log(`ca4 if passed ${ca.toString()}`)
    }
    if (DEBUG) console.log(`ca returning true for ${ca.toString()}`)
    return true;
  })
  if (DEBUG) console.log(`ca after filtering, ${ColorArray.length} options left`)

  const generals = await getCollection('generals');
  generals.map((general) => {
    if (general?.id !== undefined && general?.id !== null) {
      const name = general.id;

      
      const r1: GetStaticPathsItem[] = ColorArray.map((ca)=> {
        const rs: GetStaticPathsItem[] = relevantLevels.map((sl) => {
          if(general.data.general.specialities?.length === 4) {
            return [
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${ca[3]}/${ca[4]}/${sl}/false/false`
                }
              },
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${ca[3]}/${sl}/false/false`
                }
              },
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${ca[3]}/${ca[4]}/${sl}/true/false`
                }
              },
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${ca[3]}/${sl}/true/false`
                }
              },
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${ca[3]}/${ca[4]}/${sl}/false/true`
                }
              },
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${ca[3]}/${sl}/false/true`
                }
              },
            ]
          } else if (general.data.general.specialities?.length === 3) {
            return [
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${sl}/false/false`
                }
              },
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${sl}/true/false`
                }
              },
              {
                params: {
                  path: `${name}/${ca[0]}/${ca[1]}/${ca[2]}/${sl}/false/true`
                }
              },
            ]
          } else {
            return [
              {
                params: {
                  path: `${name}/${sl}/false/false`
                }
              },
              {
                params: {
                  path: `${name}/${sl}/true/false`
                }
              },
              {
                params: {
                  path: `${name}/${sl}/false/true`
                }
              },
            ]
          }
          
        }).flat();
        return rs
      }).flat();
      returnable.push(...r1)
    }
  })
  return returnable;
}) satisfies GetStaticPaths;

const EvAnsAttributeMultipliers: Record<generalSpecialistsType, (s: ActivationSituationsType, bc: ConditionType, a: AttributeType) => number> = (s: ActivationSituationsType, bc: ConditionType, a: AttributeType) => {
  const effective = isBuffEffective(s, bc);
  if(effective) {
    
  }
}

//from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
const EvAnsBuff = z.function()
  .args(GeneralClass, generalUseCase, AttackParams)
  .returns(z.union([ValueSchema, z.array(ValueSchema)]))
  .implement((gc, gu, ap) => {
    const BAS = 0;
    const BSS = 0;
    const fourSB = 0;
    const threeSS = 0;
    const fourSS = 0;
    const AES = 0;


  })

export const GET: APIRoute = async ({ params }) => {
  const id: string = params.path?.split('/').shift() ?? '';
  if (id !== '') {
    if (DEBUG) console.log(`id is ${id}, path was ${params.path}`)
    const entry = await getEntry('generals', id);
    if (entry !== null && entry !== undefined) {
      const general = entry.data.general;

      return new Response(
        JSON.stringify(1)
      )
    }
  }
  return new Response(JSON.stringify('1'))
}


