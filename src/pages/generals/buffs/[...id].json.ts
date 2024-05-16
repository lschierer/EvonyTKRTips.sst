export const prerender = true;
const DEBUG = true;
const DEBUG2 = false;

import {BaseN} from 'js-combinatorics';

import {
  type APIContext,
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
  BuffParams,
  type BuffParamsType,
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

const ColorBaseN = new BaseN(qualityColor.options, 5);
const ColorArray = [...ColorBaseN].filter((ca) => {
  if(ca[3].localeCompare(qualityColor.enum.Disabled)) {
    if(ca[0].localeCompare(qualityColor.enum.Gold)) {
      if(DEBUG2) console.log(`ca false 1 for ${ca.toString()}`)
      return false
    }
    if(ca[1].localeCompare(qualityColor.enum.Gold)) {
      if(DEBUG2) console.log(`ca false 2 for ${ca.toString()}`)
      return false
    }
    if(ca[2].localeCompare(qualityColor.enum.Gold)) {
      if(DEBUG2) console.log(`ca false 3 for ${ca.toString()}`)
      return false
    }
  } else {
    if(DEBUG2) console.log(`ca3 if passed ${ca.toString()}`)
  }
  if(ca[4].localeCompare(qualityColor.enum.Disabled)) {
    if(ca[3].localeCompare(qualityColor.enum.Gold)) {
      if(DEBUG2) console.log(`ca false 4 for ${ca.toString()}`)
      return false
    }else {
      if(DEBUG2) console.log(`ca3 if passed for ${ca.toString()}`)
    }
  } else {
    if (DEBUG2) console.log(`ca4 if passed ${ca.toString()}`)
  }
  if (DEBUG2) console.log(`ca returning true for ${ca.toString()}`)
  return true;
})
if (DEBUG) console.log(`ca after filtering, ${ColorArray.length} options left`)

const InvestmentOptions = ColorArray.map((ca) => {
  const alMap =  AscendingLevels.options.map((al) => {
    return [
      [...ca,al,false,false],
      [...ca,al,true,false],
      [...ca,al,false,true]
    ]
  })
  return alMap.flat()
}).flat();


export const getStaticPaths = (async () => {
  const returnable = Array<GetStaticPathsItem>();

  const generals = await getCollection('generals');
  generals.sort((a, b) => {
    if(a.id === undefined || a.id === null) {
      if(b.id === undefined || b.id === null) {
        return 0;
      }
      return -1
    } else if (b.id === undefined || b.id === null) {
      return 1
    } else {
      return a.id.localeCompare(b.id, undefined, {sensitivity: 'base'});
    }
  })
  generals.map((general) => {
    if (general?.id !== undefined && general?.id !== null) {
      const name = general.id;
      const e = {
        params: {
          id: general.id
        }
      }
      returnable.push(e)
    }
  })  
      
  return returnable;
}) satisfies GetStaticPaths;


//from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
const EvAnsBuff = z.function()
  .args(GeneralClass, generalUseCase, BuffParams)
  .returns(z.union([z.number(), z.promise(z.number())]) )
  .implement(async (gc, gu, ap) => {

    //https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value explains the attribute to buff relationship. 
    const BasicAttack = (Math.min((gc.attack + (45 * gc.attack_increment)), 900) * .1) + 
      (((gc.attack + (45 * gc.attack_increment)) > 900) ?  
      ((gc.attack + (45 * gc.attack_increment))%900)*.2 : 0);
    const BasicDefense = (Math.min((gc.defense + (45 * gc.defense_increment)), 900) * .1) + 
      (((gc.defense + (45 * gc.defense_increment)) > 900) ?  
      ((gc.defense + (45 * gc.defense_increment))%900)*.2 : 0);
    const BasicLeaderShip = (Math.min((gc.leadership + (45 * gc.leadership_increment)), 900) * .1) + 
      (((gc.leadership + (45 * gc.leadership_increment)) > 900) ?  
      ((gc.leadership + (45 * gc.leadership_increment))%900)*.2 : 0);
    const BasicPolitics = (Math.min((gc.politics + (45 * gc.politics_increment)), 900) * .1) + 
      (((gc.politics + (45 * gc.politics_increment)) > 900) ?  
      ((gc.politics + (45 * gc.politics_increment))%900)*.2 : 0);
    const BAS = BasicAttack + BasicDefense + BasicLeaderShip + BasicPolitics;

    //Built-in SkillBook Score is much more complicated
    let BSS = 0;
    if (gc.books !== undefined && Array.isArray(gc.books) && gc.books.length > 0) {
      gc.books.map(async (book) => {
        const bisbC: CollectionEntry<'skillBooks'> | undefined = await getEntry('skillBooks', book);
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
      })
      
    }
    

    
    const fourSB = 0;
    const threeSS = 0;
    const fourSS = 0;
    const AES = 0;

    return BAS + BSS + fourSB + threeSS + AES;
      
  })

const responseCreator = z.function()
  .args(GeneralClass)
  .returns(z.promise(z.array(BuffParams)))
  .implement(async (general) => {
    const data = await Promise.all(InvestmentOptions.map(async (IO) => {
      const BP: BuffParamsType = ({
        id: general.name,
        special1: qualityColor.enum.Disabled,
        special2: qualityColor.enum.Disabled,
        special3: qualityColor.enum.Disabled,
        special4: qualityColor.enum.Disabled,
        special5: qualityColor.enum.Disabled,
        stars: AscendingLevels.enum[0],
        dragon: false,
        beast: false,
        EvAnsRanking: 0,
      })

      if(Array.isArray(general.specialities) && general.specialities.length > 0) {
        if(DEBUG2) console.log(JSON.stringify(IO))
        let t = qualityColor.safeParse(IO[0])
        if(t.success) {
          BP.special1 = t.data
        } else {
          console.log(`error parsing InvestmentOptions ${t.error.message}`)
          console.log(JSON.stringify(IO))
        }
        
        BP.special2 = qualityColor.parse(IO[1]);
        BP.special3 = qualityColor.parse(IO[2]);
        if(general.specialities.length >= 4) {
          BP.special4 = qualityColor.parse(IO[3]);
          if(general.specialities.length >= 5) {
            BP.special5 = qualityColor.parse(IO[4])
          }
        }
        BP.stars = AscendingLevels.parse(IO[5])
        BP.dragon = z.boolean().parse(IO[6])
        BP.beast = z.boolean().parse(IO[7])
      }
      BP.EvAnsRanking = Math.floor(await EvAnsBuff(general, generalUseCase.enum.Attack, BP))

      return BP;

    }))
    return data;
  })



export const GET: APIRoute = async  ({ params }: APIContext) => {
  const {id }= params ;
  if( id !== undefined && id.length > 0) {
    if (id.localeCompare('')) {
      if (DEBUG) console.log(`id is ${id}, params were ${JSON.stringify(params)}`)
      const entry: CollectionEntry<'generals'> | undefined = await getEntry('generals', id);
      if (entry !== null && entry !== undefined) {
        const general = entry.data.general;

        const data = await responseCreator(general)
            
        return new Response(
          JSON.stringify(data)
        )
        
      } else {
        if (DEBUG) console.log(`no general found, id was ${JSON.stringify(id)}`)
      }
    } else {
      if(DEBUG) console.log(`id was null, params were ${JSON.stringify(params)}`)
    }
  }
  
  return new Response(JSON.stringify('1'))
}
