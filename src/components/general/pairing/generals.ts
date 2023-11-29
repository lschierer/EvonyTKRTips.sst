import { atom, map, action, computed } from "nanostores";
import { persistentAtom, persistentMap } from '@nanostores/persistent'
import { logger } from '@nanostores/logger'

import { z, type ZodError } from "zod";

const DEBUG = true;

import * as b from "@schemas/baseSchemas.ts";

import { type generalInvestment, } from './selectionStore'

import {
  GeneralClass,
  type GeneralClassType,
  GeneralPair,
  type GeneralPairType,
  GeneralArray,
  type GeneralArrayType,
  GeneralElementSchema,
  type GeneralElement,
  generalUseCase,
  type generalUseCaseType,
} from "@schemas/generalsSchema.ts"

import { conflictingGenerals } from "./ConflictingSkillExcludes.ts"

import { typeAndUseMap, primaryInvestmentMap, secondaryInvestmentMap } from "./selectionStore.ts";

import { buffAdverbs, buff } from './buff';

export interface GeneralToggle {
  [key: string]: boolean;
}

export const allGenerals = atom<GeneralArrayType | null>(null);


export const selectedPrimaries = persistentAtom<WeakMap<GeneralElement,boolean>>('evonyTKRTipsPrimaries', new WeakMap(), {
  listen: false,
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const selectedSecondaries = persistentAtom<Record<string,boolean>[]>('secondaries', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
})

export const filteredPrimaries = computed([allGenerals,selectedPrimaries], (ag, sp) => {
  const returnable = new Set<GeneralElement>();
  const agv = GeneralArray.safeParse(ag);
  
  if(agv.success && (sp !== undefined && sp !== null)) {
    
    for(let i in agv.data) {
      const one = agv.data[i];
      if(sp.size > 0 && sp.has(one) && (sp.get(one) === true)) {
        returnable.add(one);
      }
    }
  }
  return [...returnable];
})

export const filteredSecondaries = computed([allGenerals, selectedSecondaries], (ag, ss) => {
  const returnable = new Set<GeneralElement>();
  const agv = GeneralArray.safeParse(ag);
  if(agv.success && ss.length > 0) {
    const ssS = new Set(ss.map((sse) => {
      const k = Object.keys(sse)[0]
      if(sse[k] === true) {
        return k;
      }
    }));
    
    for(let i in agv.data) {
      const one = agv.data[i];
      if(ssS.has(one.general.name)) {
        returnable.add(one);
      }
    }
  }
  return [...returnable];
})

export const generalPairs = computed([allGenerals, filteredPrimaries, filteredSecondaries, primaryInvestmentMap, secondaryInvestmentMap, typeAndUseMap, conflictingGenerals],
  (g,fp, fs,  pim, sim, tam, c) => {
    const returnable = new Map<string, GeneralPairType[]>();
    const type = tam.type;


    if (DEBUG) { console.log(`generals.ts generalPairs start`) }
    if (g !== null && g !== undefined) {
      if (c !== null && c !== undefined) {
        const fpv:{ success: true; data: GeneralArrayType } | { success: false; error: ZodError; } = GeneralArray.safeParse(fp);
        const fsv = GeneralArray.safeParse(fs);
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


export const togglePrimary = action(selectedPrimaries, 'toggle', (store, general: GeneralElement, enabled: boolean) => {
  const data = store.get();
  data.set(general,enabled);
  store.set(data);
})

export const toggleSecondary = action(selectedSecondaries, 'toggle', (store, general: string, enabled: boolean) => {
  const data = store.get();
  const keys = new Set(data.map((so) => Object.keys(so)[0]));
  
  if(DEBUG) {console.log(`set of ${keys.size}`)}
  const trueVersion = {[general]: true};
  const falseVersion = {[general]: false};
  if(DEBUG) {console.log(`true is ${JSON.stringify(trueVersion)} and false is ${JSON.stringify(falseVersion)}`)}
  const index = data.findIndex((element) => {
    const k = Object.keys(element)[0];
    return (!(k as string).localeCompare(general))
  })
  data[index] = {[general]: enabled}
  store.set(data);
})

export const resetPrimary = action(selectedPrimaries, 'reset', (store) => {
  let data = store.get();
  const generals = allGenerals.get();
  if(generals !== null && generals !== undefined) {
    generals.forEach((value,key) => {
      data.set(value,true);
    })
    store.set(data);
  }
})

export const resetSecondary = action(selectedSecondaries, 'reset', (store) => {
  let data = store.get();
  const keys = data.map((so) => Object.keys(so)[0]);
  data = data.map((value, index) => {
    return {[keys[index] as string]: true};
  })
  store.set(data);
})

let destroy = logger({
  'AllGenerals': allGenerals,
  'GeneralPairs': generalPairs,
  'selectedPrimaries': selectedPrimaries,
  'selectedSecondaries': selectedSecondaries,
})
