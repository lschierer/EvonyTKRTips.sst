import { atom, map, action, computed } from "nanostores";
import { logger } from '@nanostores/logger'

import { z } from "zod";

const DEBUG = false;

import * as b from "@schemas/baseSchemas.ts";

import {type generalInvestment, } from './selectionStore'

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

import { buffAdverbs, buff} from './buff'


export const allGenerals = atom<GeneralArrayType | null>(null);

export const generalPairs = computed([allGenerals, primaryInvestmentMap, secondaryInvestmentMap, typeAndUseMap, conflictingGenerals],
   (g, pim, sim, tam, c) => {
    const returnable = new Map<string, GeneralPairType[]>();
    const type = tam.type;

    
    if (DEBUG) { console.log(`generals.ts generalPairs start`) }
    if (g !== null && g !== undefined) {
      if (c !== null && c !== undefined) {
        const valid = GeneralArray.safeParse(g);
        if (valid.success) {
          for (let i in valid.data) {
            const one = valid.data[i];
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
            for (let j in valid.data) {
              const two = valid.data[j];
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
                  if (DEBUG) {console.log(`general ${one.general.name} has no conflicts`)}
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
      if (DEBUG) {console.log(`generalPairs computed before generals present`)}
    }
    if (returnable.size >= 1) {
      return returnable;
    } else {
      return null;
    }
  })


let destroy = logger({
  'AllGenerals': allGenerals,
  'GeneralPairs': generalPairs,
})
