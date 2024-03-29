import { atom, map, action, computed } from "nanostores";
import { logger } from '@nanostores/logger'

import { z } from "zod";


const DEBUG = false;

import * as b from "@schemas/baseSchemas.ts"

import {
  GeneralClass,
  type GeneralClassType,
  GeneralArray,
  type GeneralArrayType,
  GeneralElementSchema,
  type GeneralElement,
} from "@schemas/generalsSchema.ts"

import {
  ConflictArray,
  type ConflictArrayType,
  ConflictDatum,
  type ConflictDatumType,
} from '@schemas/conflictSchemas.ts'

import {
  standardSkillBook,
  type standardSkillBookType
} from "@schemas/bookSchemas.ts"


type GeneralDictionary = {
  [key: string]: Array<string>;
}

const letters = new Set(["a", "b", "c"]);

export const conflictRecords = atom<ConflictArrayType | null>(null);

export const conflictingGenerals = computed(conflictRecords, CRs => {
  if (CRs !== undefined && CRs !== null) {
    const valid = ConflictArray.safeParse(CRs)
    if (valid.success) {
      let Returnable = new Map<string, Array<string>>();
      for (let i = 0; i < valid.data.length; i++) {
        let o1: ConflictDatumType = valid.data[i]
        let data: ConflictDatumType | undefined;
        let conflicts = o1.conflicts;
        for (const key in conflicts) {
          if (key.localeCompare('other')) {
            const items = conflicts[key as keyof typeof conflicts];
            items.forEach((g: string) => {
              const gc = new Set<string>;
              items.forEach((g2: string) => {
                if (g2.localeCompare(g)) {
                  gc.add(g2);
                }
              })
              const other = conflicts.other;
              if (other !== undefined && other !== null) {
                other.forEach((g2: string) => {
                  gc.add(g2)
                })
              }
              Returnable.set(g, [...gc])
            })
          }

        }
      }
      return Returnable;
    }
  }
});

export const conflictingBooks = computed(conflictRecords, CBs => {
  if (CBs !== null && CBs !== undefined) {
    const valid = ConflictArray.safeParse(CBs);
    if (valid.success) {
      let Returnable = new Map<string, Array<standardSkillBookType>>();
      for (let i = 0; i < valid.data.length; i++) {
        let o1: ConflictDatumType = valid.data[i]
        let conflicts = o1.conflicts;
        let valid3 = standardSkillBook.array().safeParse(o1.books);
        if (valid3.success) {
          let books = valid3.data;
          if (books !== null && conflicts !== null) {
            for (const key in conflicts) {
              if (key.localeCompare('other')) {
                const items = conflicts[key as keyof typeof conflicts];
                items.forEach((g: string) => {
                  Returnable.set(g, books);
                })
              }
            }
          }
        } else {
          if (DEBUG) {console.log(`skillbook detected wrong type`)}
        }

      }
      return Returnable;
    }
  }
  return null;
})

export function checkConflicts(name1: string, name2: string, generalType: b.ClassEnumType) {
  if(DEBUG) {console.log(`checkConflicts called for ${name1} and ${name2}`)}
  if (name1 === name2 || !name1.localeCompare(name2, undefined, { sensitivity: 'base' })) {
    return true;
  }
  let records = conflictingGenerals.get()
  if (records !== null && records !== undefined) {
    const personal = records.get(name1)
    if (personal !== null && personal !== undefined) {
      const searchable = Object.values(personal).flat(Infinity)
      return searchable.includes(name2);
    } else {
    }
  }
  console.error(`no records returned at all;`)
  return false;
}

export function checkBoSConflicts(name: string) {
  if(DEBUG) {console.log(`checking for Dragon/Beast conflicts for ${name}`)}
  let records = conflictingBooks.get();
  
}

let destroy = logger({
  'ConflictRecords': conflictRecords,
  'ConflictingGenerals': conflictingGenerals,
  'ConflictingBooks': conflictingBooks,
})
