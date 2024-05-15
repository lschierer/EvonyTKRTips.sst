export const prerender = true;

import {BaseN} from 'js-combinatorics';

import {
  type APIRoute,
  
  type GetStaticPaths,
  type GetStaticPathsItem,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from 'astro';

import { getEntry, getCollection, z, type CollectionEntry } from 'astro:content'

import {
  type ActivationSituationsType,
  AscendingLevels,
  Attribute,
  
  type AttributeType,
  beast,
  Buff,
  type BuffType,
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
  specialSkillBook,
  type specialSkillBookType,
} from '@schemas/index'

import { isBuffEffective } from '@lib/buffUtils';

import  * as EvAnsRanking from '@lib/EvAnsAttributeRanking'
import { skillBook } from 'src/assets/evonySchemas';

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


//from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
const EvAnsBuff = z.function()
  .args(GeneralClass, generalUseCase, AttackParams)
  .returns(z.union([z.number(), z.promise(z.number())]) )
  .implement(async (gc, gu, ap) => {

    //Basic Attribute Score is easy. 
    const BasicAttack = gc.attack + (45 * gc.attack_increment);
    const BasicDefense = gc.defense + (45 * gc.defense_increment);
    const BasicLeaderShip = gc.leadership + (45 * gc.leadership_increment);
    const BasicPolitics = gc.politics + (45 * gc.politics_increment);
    const BAS = BasicAttack + BasicDefense + BasicLeaderShip + BasicPolitics;

    //Built-in SkillBook Score is much more complicated
    let BSS = 0;
    if (gc.books !== undefined && Array.isArray(gc.books) && gc.books.length > 0) {
      const bisbC: CollectionEntry<'skillBooks'> | undefined = await getEntry('skillBooks', gc.books[0]);
      if(bisbC !== undefined) {
        const v = specialSkillBook.safeParse(bisbC.data);
        if(v.success) {
          const bisb: specialSkillBookType = v.data;
          for( const tb of bisb.buff) {
            if(tb !== undefined && tb.value !== undefined) {
              if(tb.class === undefined) {
                //this is an all class buff
                if(gc.score_as !== undefined ) {
                  if(!gc.score_as.localeCompare(generalSpecialists.enum.Archers, undefined, {sensitivity: 'base'})) {
                    if(tb.attribute !== undefined) {
                      
                    }
                  }
                }
              }
            } else {
              console.log(`how to score a buff with no value? gc is ${gc.name}`)
            }
          }
        }
      }
    }
    

    
    const fourSB = 0;
    const threeSS = 0;
    const fourSS = 0;
    const AES = 0;

    return BAS + BSS + fourSB + threeSS + AES;
      
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


