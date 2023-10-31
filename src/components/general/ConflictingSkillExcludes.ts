import {
  generalSchema,
  type General,
  generalObjectSchema,
  type generalObject,
  type standardSkillBookType,
  troopClass,
  type troopClassType, generalConflicts, type generalConflictsType,
} from '@schemas/evonySchemas.ts';

import {atom, map, action, computed} from "nanostores";
import { logger } from '@nanostores/logger'

import {z} from "zod";

type GeneralDictionary = {
  [key: string]: Array<string>;
}

const letters = new Set(["a","b","c"]);

const generalConflictCollection = z.array(generalConflicts);
export const conflictRecords = atom<generalConflictsType|null>(null);

export const conflictingGenerals = computed(conflictRecords, CRs => {
  if(CRs !== undefined && CRs !== null) {
    const valid = generalConflictCollection.safeParse(CRs)
    if (valid.success) {
      let Returnable = new Map<string,Array<string>>();
      for (let i = 0; i < valid.data.length; i++) {
        let o1 = valid.data[i]
        let valid2 = generalConflicts.safeParse(o1);
        if (valid2.success) {
          let data: Record<string, string[]> | Record<string, string[]>[] | Record<'books', standardSkillBookType[]> | undefined;
          if(valid2.data !== undefined && valid2.data.conflicts !== undefined) {
            let conflicts = [valid2.data.conflicts].flat(1);
            for (let j = 0; j < conflicts.length; j++) {
              const o2 = conflicts[j];
              const keys = Object.keys(o2);
              for (let k = 0; k < keys.length; k++) {
                if(keys[k].localeCompare('books')) {
                  if (keys[k].localeCompare('other')) {
                    for (let l = 0; l < o2[keys[k]].length; l++) {
                      const o3: string[] = o2[keys[k]];
                      let n1: string = o3[l];
                      let confl = new Set<string>();
                      for (let m = 0; m < keys.length; m++) {
                        for(let n = 0; n < o2[keys[m]].length; n++) {
                          const o4: string = o2[keys[m]][n];
                          if(n1.localeCompare(o4)) {
                            confl.add(o4);
                          }
                        }
                        let n2: string = o3[m]
                        if(n1.localeCompare(n2)) {
                          confl.add(n2);
                        }
                      }
                      const stringArray: string[] = [...confl];
                      Returnable.set(n1, stringArray);
                    }
                  }
                }
              }
            }
          }
        } else {
          console.error(`invalid assumption about zod data type`)
        }
      }
      return Returnable;
    }
  }
});

let destroy = logger({
  'ConflictRecords': conflictRecords,
  'ConflictingGenerals': conflictingGenerals,
})


export function checkConflicts (name1: string, name2: string, generalClass?: troopClassType) {
  if(name1 === name2 || !name1.localeCompare(name2, undefined, {sensitivity: 'base'})) {
    return true;
  }
  let records = conflictingGenerals.get()
  if(records !== null && records !== undefined) {
    const personal = records.get(name1)
    if(personal !== null && personal !== undefined){
        const searchable =Object.values(personal).flat(Infinity)
        return searchable.includes(name2);
    } else {
    }
  }
  console.error(`no records returned at all;`)
  return false;
}


