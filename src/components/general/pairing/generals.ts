import { atom, map, action, computed } from "nanostores";
import { persistentAtom, persistentMap } from '@nanostores/persistent'
import { logger } from '@nanostores/logger'

import * as z from "zod";

import {  type ZodError } from "zod";

const DEBUG = false;

import * as b from "@schemas/baseSchemas";

import * as util from '../../../lib/util';

import { type generalInvestment, } from './selectionStore'

import {
  GeneralClass,
  type GeneralClassType,
  GeneralPair,
  type GeneralPairType,
  GeneralArray,
  type GeneralArrayType,
  GeneralElement,
  type GeneralElementType,
  generalUseCase,
  type generalUseCaseType,
} from "@schemas/generalsSchema"

import { conflictingGenerals } from "./ConflictingSkillExcludes"

import { typeAndUseMap, primaryInvestmentMap, secondaryInvestmentMap } from "./selectionStore";

import { buffAdverbs, buff } from './buff';

export const GeneralToggle = z.record(
  z.string().min(1),
  z.boolean(),
);
export type GeneralToggleType = z.infer<typeof GeneralToggle>;

const SelectionObject = z.object({
  'primaries': z.array(GeneralToggle).nullish(),
  'secondaries': z.array(GeneralToggle).nullish(),
})
export type SelectionObjectType = z.infer<typeof SelectionObject>;

export const allGenerals = atom<GeneralArrayType | null>(null);

export const selections = map<SelectionObjectType>({
  'primaries': null,
  'secondaries': null,
})

export const filteredPrimaries = computed([allGenerals,selections], (ag, sp) => {
  const returnable = new Set<GeneralElementType>();
  const agv = GeneralArray.safeParse(ag);

  if(agv.success && (sp !== undefined && sp !== null )) {
    const primaries = sp.primaries;  
    if(primaries !== null && primaries !== undefined && !util.isEmpty(primaries)) {
      agv.data.map((one) => {
        if(one !== null && one !== undefined) {
          const os = primaries.filter((pv) => {
            const k = Object.keys(pv)[0];
            return (!k.localeCompare(one.general.name));
          })[0];
          if(os !== null && os !== undefined) {
            const osv = Object.values(os)[0];
            if(osv === true) {
              returnable.add(one);
            }
          }
        }
      })
      return [...returnable];
    }
  } else {
    if(agv.success) {
      if(DEBUG) {console.log(`returning unfiltered agv.data`)}
      return agv.data;
    } else {
      console.error(`I have no parsable avg`)
    }
  }
})

export const filteredSecondaries = computed([allGenerals, selections], (ag, ss) => {
  const returnable = new Set<GeneralElementType>();
  const agv = GeneralArray.safeParse(ag);

  if(agv.success && (ss !== undefined && ss !== null )) {
    const secondaries = ss.secondaries;  
    if(secondaries !== null && secondaries !== undefined && !util.isEmpty(secondaries)) {
      for(let i in agv.data) {
        const one = agv.data[i];
        const os = secondaries.filter((sv) => {
          const k = Object.keys(sv)[0];
          return (k.localeCompare(one.general.name));
        })[0];
        const osv = Object.values(os)[0];
        if(osv === true) {
          returnable.add(one);
        }
      }
      return [...returnable];
    }
  } else {
    if(agv.success) {
      if(DEBUG) {console.log(`returning unfiltered agv.data`)}
      return agv.data;
    } else {
      console.error(`I have no parsable avg`)
    }
  }
})

export const generalPairs = computed([allGenerals, primaryInvestmentMap, secondaryInvestmentMap, typeAndUseMap, conflictingGenerals],
  (g,  pim, sim, tam, c) => {
    const returnable = new Map<string, GeneralPairType[]>();
    const type = tam.type;


    if (DEBUG) { console.log(`generals.ts generalPairs start`) }
    if (g !== null && g !== undefined) {
      if (c !== null && c !== undefined) {
        const fpv:{ success: true; data: GeneralArrayType } | { success: false; error: ZodError; } = GeneralArray.safeParse(g);
        const fsv = GeneralArray.safeParse(g);
        if(!fpv.success){
          console.error(`filtered Generals invalid`)
        } else {
          if(DEBUG) {console.log(`fpv has ${fpv.data.length} entries`)}
        }
        if(!fsv.success){
          console.error(`filtered Generals invalid`)
        } else {
          if(DEBUG) {console.log(`fsv has ${fsv.data.length} entries`)}
        }
        const valid = GeneralArray.safeParse(g);
        if (valid.success && fpv.success && fsv.success) {
          for (let i in fpv.data) {
            const one = fpv.data[i];
            if (one.general.score_as !== null && one.general.score_as !== undefined) {
              if (one.general.score_as !== null && one.general.score_as !== undefined) {
                if (type !== null && type !== undefined && type !== b.ClassEnum.enum.all) {
                  if (one.general.score_as !== type) {
                    if (DEBUG) { console.log(`found a conflict between ${one.general.name} and ${type}`) }
                    continue;
                  }
                }
              }
            }

            const conflicts = c.get(one.general.name);
            const pairs = new Set<GeneralPairType>
            for (let j in fsv.data) {
              const two = fsv.data[j];
              if (one.general.name.localeCompare(two.general.name, undefined, { sensitivity: 'base' })) {
                if (conflicts !== null && conflicts !== undefined && conflicts.length >= 1) {
                  if (!conflicts.includes(two.general.name)) {
                    if (type !== null && type !== undefined && type !== b.ClassEnum.enum.all) {
                      if (two.general.score_as !== null && two.general.score_as !== undefined) {
                        if (two.general.score_as !== type) {
                          if (DEBUG) { console.log(`found a conflict between assistant ${two.general.name} and ${type}`) }
                          continue;
                        }
                      }
                    }
                    pairs.add({ primary: one.general, secondary: two.general })
                  }
                } else {
                  if (DEBUG) { console.log(`general ${one.general.name} has no conflicts`) }
                  if (type !== null && type !== undefined && type !== b.ClassEnum.enum.all) {
                    if (two.general.score_as !== null && two.general.score_as !== undefined) {
                      if (two.general.score_as !== type) {
                        if (DEBUG) { console.log(`found a conflict between assistant ${two.general.name} and ${type}`) }
                        continue;
                      }
                    }
                  }
                  pairs.add({ primary: one.general, secondary: two.general })
                }
              }
            }
            const r_array = [...pairs];
            if (DEBUG) { console.log(`found ${one.general.name} ${r_array.length ? r_array.length : 0} pairs`) }
            if (r_array !== undefined && r_array !== null && r_array.length >= 1) {
              returnable.set(one.general.name, [...pairs])
            }
          }
        } else {
          console.error(`wrong type in generalPairs compute`)
        }
      }
    } else {
      if (DEBUG) { console.log(`generalPairs computed before generals present`) }
    }
    if (returnable.size >= 1) {
      return returnable;
    } else {
      return null;
    }
  }
)


export const togglePrimary = action(selections, 'toggleP', (store, general: GeneralElementType, enabled: boolean) => {
  const data = store.get().primaries;
  const nd = new Array<GeneralToggleType>();
  if(data !== null && data !== undefined ) {
    for(let i =0; i < data.length; i++) {
      if(DEBUG){console.log(`nd has length ${nd.length}`)}
      const k = Object.keys(data[i])[0];
      const v = Object.values(data[i])[0];
      if(!k.localeCompare(general.general.name)){
        if(DEBUG) {console.log(`found ${k} to toggleP ${enabled}`)}
        nd.push({[general.general.name]: enabled});
      } else {
        nd.push(data[i]);
      }
    }
  } else {
    const ag = allGenerals.get();
    if(ag !== null && ag !== undefined) { 
      for(let i = 0; i < ag.length; i++) {
        if(ag[i].general.name.localeCompare(general.general.name)){
          nd.push({[ag[i].general.name]: true});
        }else {
          nd.push({[general.general.name]: enabled});      
        }
      }
    } else {
      if(DEBUG) {console.log(`ag was null or undefined in toggleP`)}
      nd.push({[general.general.name]: enabled});  
    }
    
    nd.push({[general.general.name]: enabled});
    
  }
  if(DEBUG){console.log(`nd has final length ${nd.length}`)}
  store.setKey('primaries',nd)
})

export const toggleSecondary = action(selections, 'toggleS', (store, general: GeneralElementType, enabled: boolean) => {
  const data = store.get().secondaries;
  
})

export const resetPrimary = action(selections, 'resetP', (store) => {
  if(store !== null && store !== undefined) {
    let nd = new Array<GeneralToggleType>();
    const generals = allGenerals.get();
    if(generals !== null && generals !== undefined) {
      for(let i = 0; i < generals.length; i++){
        const value = generals[i];
        if(value !== null && value !== undefined ){
          if(nd !== null && nd !== undefined) {
            nd.push({[value.general.name]:true});
          }
        }
      }
      store.setKey('primaries',nd);
    }
    else { 
      store.setKey('primaries', null);
    }
  }
})

export const resetSecondary = action(selections, 'reset', (store) => {
  if(store !== null && store !== undefined) {
    let nd = new Array<GeneralToggleType>();
    const generals = allGenerals.get();
    if(generals !== null && generals !== undefined) {
      for(let i = 0; i < generals.length; i++){
        const value = generals[i];
        if(value !== null && value !== undefined ){
          if(nd !== null && nd !== undefined) {
            nd.push({[value.general.name]:true});
          }
        }
      }
      store.setKey('secondaries',nd);
    }
    else { 
      store.setKey('secondaries', null);
    }
  }
})

let d1 = null;

if(DEBUG) {
  d1 = logger({
    'AllGenerals': allGenerals,
  });
}

/*
let d2 = logger({
  'selections': selections,
});
*/
let d3 = null;
if(DEBUG) {
  logger({
    'filteredPrimaries': filteredPrimaries,
    'filteredSecondaries': filteredSecondaries,
    
  });
}

let d4 = logger({
  'GeneralPairs': generalPairs,
});

export const getValue = (key:'primary' | 'secondary', general: GeneralElementType) =>  {
  let store: null | undefined | GeneralToggleType[] = null;
  if(key === 'primary') {
    store = selections.get().primaries;
  } else if (key === 'secondary') {
    store = selections.get().secondaries;
  } else {
    console.error(`this should not happen in getValue`)
  }
  if(store !== null && store !== undefined) {
    const fv = store.filter((tv) => {
      if(tv !== null && tv !== undefined) {
        const k = Object.keys(tv)[0];
        return(!k.localeCompare(general.general.name));
      }
    }).pop();
    if(fv === undefined) {
      return false;
    }
    return Object.values(fv)[0];
  }
  return false;
}
