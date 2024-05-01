const DEBUG = false;

import {
  buffUnion,
  type Buff,
  GeneralClass,
  type GeneralClassType,
  generalConflictCollection,
  GeneralElement,
  type GeneralElementType,
  standardSkillBook,
  type standardSkillBookType,
  ClassEnum,
  type ClassEnumType, 
  generalConflicts, 
  type generalConflictsType,
  type nameConflictsTypes,
  type otherConflictType,
  type bookConflictsType,
} from '@schemas/index';

import {atom, map, action, computed} from "nanostores";
import { logger } from '@nanostores/logger'

import {z} from "zod";

type GeneralDictionary = Record<string, string[]>;

const letters = new Set(["a","b","c"]);

export const conflictRecords = atom<generalConflictsType|null>(null);

export const conflictingGenerals = computed(conflictRecords, CRs => {
  if(CRs !== undefined && CRs !== null) {
    const valid = generalConflictCollection.safeParse(CRs)
    if (valid.success) {
      const Returnable = new Map<string,string[]>();
      for (let i = 0; i < valid.data.length; i++) {
        const o1 = valid.data[i]
        const valid2 = generalConflicts.safeParse(o1);
        if (valid2.success) {
          let data: generalConflictsType | undefined;
          if(valid2.data?.conflicts !== undefined) {
            const conflicts = valid2.data.conflicts;
            for(const key in conflicts) {
              if(key.localeCompare('other')) {
                const items = conflicts[key];
                items.forEach((g: string) => {
                  const gc = new Set<string>;
                  items.forEach((g2: string) => {
                    if(g2.localeCompare(g)) {
                      gc.add(g2);
                    }
                  })
                  const other = conflicts.other;
                  if(other !== undefined && other !== null) {
                    other.forEach((g2: string) => {
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
      const Returnable = new Map<string, standardSkillBookType[]>();
      for (let i = 0; i < valid.data.length; i++) {
        const o1 = valid.data[i]
        const valid2 = generalConflicts.safeParse(o1);
        if (valid2.success) {
          let data: generalConflictsType | undefined;
          if (valid2.data?.conflicts !== undefined && valid2.data.books !== undefined) {
            const conflicts = valid2.data.conflicts;
            const valid3 = standardSkillBook.array().safeParse(valid2.data.books);
            if (valid3.success) {
              const books = valid3.data;
              if (books !== null && conflicts !== null) {
                for (const key in conflicts) {
                  if (key.localeCompare('other')) {
                    const items = conflicts[key];
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

export function checkConflicts (name1: string, name2: string, generalClass?: ClassEnumType) {
  if(name1 === name2 || !name1.localeCompare(name2, undefined, {sensitivity: 'base'})) {
    return true;
  }
  const records = conflictingGenerals.get()
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

const destroy = logger({
  'ConflictRecords': conflictRecords,
  'ConflictingGenerals': conflictingGenerals,
  'ConflictingBooks': conflictingBooks,
})
