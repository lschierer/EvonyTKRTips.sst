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

import { PvPAttackBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPAttackBuff.ts';
import { PvPMarchSizeBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPMarchSizeBuff';
import { PvPHPBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPHPBuff.ts';
import { PvPDefenseBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPDefenseBuff.ts';
import { PvPDeAttackBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPDeAttackBuff.ts';
import { PvPDeHPBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPDeHPBuff.ts';
import { PvPDeDefenseBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPDeDefense.ts';
import { PvPPreservationBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPPreservationBuff.ts';
import { PvPDebilitationBuff } from '@components/general/buffComputers/EvAnsRanking/Siege/PvPDebilitationBuff.ts';

const DEBUG_BSS = false;

export const AttackPvPBSS = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
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
            console.log(`${eg.name} invalid book: ${book.name}`);
            return accumulator;
          } else {
            const bisb: specialSkillBookType = v.data;
            const array_total = bisb.buff.reduce((a2, tb: BuffType) => {
              if (DEBUG_BSS) {
                console.log(`--- start tb ---`);
                console.log(JSON.stringify(tb));
                console.log(`--- end tb ---`);
              }
              let tbscore = PvPAttackBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) { console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`); }
              a2 += tbscore;
              tbscore = PvPMarchSizeBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = PvPHPBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = PvPDefenseBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = PvPDeAttackBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = PvPDeHPBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = PvPDeDefenseBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = PvPPreservationBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              tbscore = PvPDebilitationBuff(bisb.name, eg.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(`${eg.name}: ${book.name}: accumulating ${tbscore}`);
              }
              a2 += tbscore;
              return a2;
            }, 0);
            return accumulator + array_total;
          }
        }
        return accumulator;
      }, 0);
      if (DEBUG_BSS) {
        console.log(`${eg.name} total book buff: ${book_score}`);
        console.log('');
      }
      BSS_Score += Math.floor(book_score);
    }
    return Math.floor(BSS_Score);
  });
