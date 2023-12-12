const DEBUG = false;

import {
  buffUnion,
  type buff,
  generalSchema,
  type General,
  generalConflictCollection,
  generalObjectSchema,
  type generalObject,
  standardSkillBook,
  type standardSkillBookType,
  troopClass,
  type troopClassType, generalConflicts, type generalConflictsType,
    type nameConflictsTypes,
    type otherConflictType,
    type bookConflictsType,
} from '@schemas/evonySchemas';

import {atom, map, action, computed} from "nanostores";
import { logger } from '@nanostores/logger'

import {z} from "zod";

type GeneralDictionary = {
  [key: string]: Array<string>;
}

const letters = new Set(["a","b","c"]);

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
          let data: generalConflictsType | undefined;
          if(valid2.data !== undefined && valid2.data.conflicts !== undefined) {
            let conflicts = valid2.data.conflicts;
            for(const key in conflicts) {
              if(key.localeCompare('other')) {
                const items = conflicts[key as keyof typeof conflicts];
                items.forEach((g) => {
                  const gc = new Set<string>;
                  items.forEach((g2) => {
                    if(g2.localeCompare(g)) {
                      gc.add(g2);
                    }
                  })
                  const other = conflicts.other;
                  if(other !== undefined && other !== null) {
                    other.forEach((g2) => {
                      gc.add(g2)
                    })
                  }
                  Returnable.set(g, [...gc])
                })
              }
            }
          }
        }
      }
      return Returnable;
    }
  }
});

export const conflictingBooks = computed(conflictRecords, CBs => {
  if (CBs !== null && CBs !== undefined) {
    const valid = generalConflictCollection.safeParse(CBs);
    if (valid.success) {
      let Returnable = new Map<string, Array<standardSkillBookType>>();
      for (let i = 0; i < valid.data.length; i++) {
        let o1 = valid.data[i]
        let valid2 = generalConflicts.safeParse(o1);
        if (valid2.success) {
          let data: generalConflictsType | undefined;
          if (valid2.data !== undefined && valid2.data.conflicts !== undefined && valid2.data.books !== undefined) {
            let conflicts = valid2.data.conflicts;
            let valid3 = standardSkillBook.array().safeParse(valid2.data.books);
            if (valid3.success) {
              let books = valid3.data;
              if (books !== null && conflicts !== null) {
                for (const key in conflicts) {
                  if (key.localeCompare('other')) {
                    const items = conflicts[key as keyof typeof conflicts];
                    items.forEach((g) => {
                      Returnable.set(g, books);
                    })
                  }
                }
              }
            } else {
              console.log(`wrong type`)
            }

          }
        }
      }
      return Returnable;
    }
  }
  return null;
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

let destroy = logger({
  'ConflictRecords': conflictRecords,
  'ConflictingGenerals': conflictingGenerals,
  'ConflictingBooks': conflictingBooks,
})
