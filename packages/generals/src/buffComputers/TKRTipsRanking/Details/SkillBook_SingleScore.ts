import type { BookType } from '../../../schemas/bookSchemas';

const DEBUG = false;

import { type ExtendedGeneralType } from '../../../schemas/ExtendedGeneral';
import { type generalUseCaseType } from '../../../schemas/generalsSchema';
import { type BuffParamsType } from '../../../schemas/baseSchemas';
import { type AttributeMultipliersType } from '../../../schemas/EvAns.zod';

import { type BuffFunction } from '../../../RankingInterfaces';

export const SkillBookBuffs = (
  eg: ExtendedGeneralType,
  useCase: generalUseCaseType,
  bp: BuffParamsType,
  am: AttributeMultipliersType,
  BuffComp: BuffFunction,
) => {
  let accumulator = 0;
  if (eg.books && Array.isArray(eg.books) && eg.books.length > 0) {
    eg.books.forEach((tb: BookType) => {
      if (tb !== null && tb !== undefined) {
        if (DEBUG) {
          console.log(`scoring ${tb.name} for ${eg.name}`);
          console.log(JSON.stringify(tb));
        }
        const additional = tb.buff.reduce((a2, bb, index) => {
          if (bb === null || bb === undefined) {
            if (DEBUG) {
              console.log(`bb null or undefined`);
            }
            return a2;
          } else {
            if (DEBUG) {
              console.log(`calling BuffComp: ${eg.name} ${tb.name} ${index}`);
              console.log(JSON.stringify(bb));
            }
            const value = BuffComp(tb.name, eg.name, bb, bp, useCase, am);
            if (DEBUG) {
              console.log(`${eg.name} gets value ${value}`);
            }
            a2 += value;
          }
          return a2;
        }, 0);
        accumulator += additional;
      }
    });
  } else {
    if (DEBUG) {
      console.log(`no books for ${eg.name}`);
    }
  }
  return Math.floor(accumulator);
};
