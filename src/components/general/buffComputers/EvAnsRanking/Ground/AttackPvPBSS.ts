import { z } from 'zod';

import { BuffParams, type BuffParamsType } from '@schemas/baseSchemas';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import {
  specialSkillBook,
  type specialSkillBookType,
} from '@schemas/bookSchemas';

import { GroundPvPBuff } from './PvPBuff';

const DEBUG_BSS = false;

export const GroundAttackPvPBSS = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    const gc = eg.general;
    let BSS_Score = 0;

    if (
      eg.books !== undefined &&
      Array.isArray(eg.books) &&
      eg.books.length > 0
    ) {
      const book_score = eg.books.reduce((accumulator, book) => {
        if (book === undefined) {
          return accumulator;
        } else {
          const v = specialSkillBook.safeParse(book);
          if (v.error) {
            console.log(`${eg.general.name} invalid book: ${book.name}`);
            return accumulator;
          } else {
            const bisb: specialSkillBookType = v.data;
            const array_total = bisb.buff.reduce((a2, tb) => {
              if (DEBUG_BSS) {
                console.log(`--- start tb ---`);
                console.log(JSON.stringify(tb));
                console.log(`--- end tb ---`);
              }
              const tbscore = GroundPvPBuff(bisb.name, gc.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(JSON.stringify(tb));
                console.log(
                  `${eg.general.name}: ${book.name}: accumulating ${tbscore}`
                );
              }
              return tbscore + a2;
            }, 0);
            return accumulator + array_total;
          }
        }
        return accumulator;
      }, 0);
      if (DEBUG_BSS) {
        console.log(`${eg.general.name} total book buff: ${book_score}`);
        console.log('');
      }
      BSS_Score += Math.floor(book_score);
    }
    return Math.floor(BSS_Score);
  });