import { z } from 'zod';

import {
  BuffParams,
  type BuffParamsType,
  type BuffType,
} from '@schemas/baseSchemas';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import {
  specialSkillBook,
  type specialSkillBookType,
} from '@schemas/bookSchemas';

import {type BuffFunctionInterface} from '@lib/RankingInterfaces.ts';

const DEBUG_BSS = false;

export const AttackPvPBSS = (eg: ExtendedGeneralType, bp: BuffParamsType, typedBuffFunction: BuffFunctionInterface) => {
    let BSS_Score = 0;

    if (
      eg.books !== undefined &&
      Array.isArray(eg.books) &&
      eg.books.length > 0
    ) {
      const book_score = eg.books.reduce((a1, book) => {
        if (book === undefined) {
          return a1;
        } else {
          const v = specialSkillBook.safeParse(book);
          if (v.error) {
            console.log(`${eg.name} invalid book: ${book.name}`);
            return a1;
          } else {
            const bisb: specialSkillBookType = v.data;
            const array_total = bisb.buff.reduce((a2, tb: BuffType) => {
              if (DEBUG_BSS) {
                console.log(`--- start tb ---`);
                console.log(JSON.stringify(tb));
                console.log(`--- end tb ---`);
              }
              let tbscore = (typedBuffFunction.Attack(bisb.name, eg.name, tb, bp) as number);
              if (DEBUG_BSS) { console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`); }
              a2 += tbscore;
              tbscore = (typedBuffFunction.MarchSize(bisb.name, eg.name, tb, bp) as number);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = (typedBuffFunction.Range(bisb.name, eg.name, tb, bp) as number);
              if(DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = (typedBuffFunction.DeHP(bisb.name, eg.name, tb, bp) as number);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = (typedBuffFunction.DeDefense(bisb.name, eg.name, tb, bp) as number);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              return a2;
            }, 0);
            if (DEBUG_BSS) {
              console.log(`a1 loop: ${array_total} to ${a1}`);
            }
            return a1 + array_total;
          }
        }
      }, 0);
      if (DEBUG_BSS) {
        console.log(`${eg.name} total book buff: ${book_score}`);
        console.log('');
      }
      BSS_Score += Math.floor(book_score);
    }
    return Math.floor(BSS_Score);
  }
