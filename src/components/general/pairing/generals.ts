import { atom, map, action, computed } from "nanostores";
import { logger } from '@nanostores/logger'

import { z } from "zod";

const DEBUG = true;

import {
  GeneralClass,
  type GeneralClassType,
  GeneralPair,
  type GeneralPairType,
  GeneralArray,
  type GeneralArrayType,
  GeneralElementSchema,
  type GeneralElement,
} from "@schemas/generalsSchema.ts"

import { conflictingGenerals } from "./ConflictingSkillExcludes.ts"


export const allGenerals = atom<GeneralArrayType | null>(null);

export const generalPairs = computed([allGenerals, conflictingGenerals], (g, c) => {
  const returnable = new Map<string, GeneralPairType[]>();
  if(DEBUG) {console.log(`generals.ts generalPairs start`)}
  if (g !== null && g !== undefined) {
    if (c !== null && c !== undefined) {
      const valid = GeneralArray.safeParse(g);
      if (valid.success) {
        for (let i in valid.data) {
          const one = valid.data[i];
          const conflicts = c.get(one.general.name);
          const pairs = new Set<GeneralPairType>
          for (let j in valid.data) {
            const two = valid.data[j];
            if (one.general.name.localeCompare(two.general.name, undefined, { sensitivity: 'base' })) {
              if(conflicts !== null && conflicts !== undefined && conflicts.length >= 1) {
                if(!conflicts.includes(two.general.name)){
                  pairs.add({ primary: one.general, secondary: two.general })    
                }
              } else {
                pairs.add({ primary: one.general, secondary: two.general })
              }
            }
          }
          returnable.set(one.general.name, [...pairs])
        }
      } else {
        console.error(`wrong type in generalPairs compute`)
      }
    }
  } else {
    console.log(`generalPairs computed before generals present`)
  } 
  return returnable;
})

let destroy = logger({
  'AllGenerals': allGenerals,
  'GeneralPairs': generalPairs,
})
