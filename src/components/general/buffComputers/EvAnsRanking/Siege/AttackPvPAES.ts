import { z } from 'zod';

import {
  AscendingLevels,
  Buff,
  type BuffType,
  BuffParams,
  type BuffParamsType,
} from '@schemas/baseSchemas';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import { PvPAttackBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPAttackBuff.ts';
import { PvPMarchSizeBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPMarchSizeBuff';
import { PvPHPBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPHPBuff.ts';
import { PvPDefenseBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPDefenseBuff.ts';
import { PvPDeAttackBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPDeAttackBuff.ts';
import { PvPDeHPBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPDeHPBuff.ts';
import { PvPDeDefenseBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPDeDefense.ts';
import { PvPPreservationBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPPreservationBuff.ts';
import { PvPDebilitationBuff } from '@components/general/buffComputers/AttackRanking/Archers/PvPDebilitationBuff.ts';

const DEBUG_AES = false;
const DEBUG = false;

export const AttackPvPAES = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    let BSS_Score = 0;

    //I will assume you set the bp to disabled if it is an assistant.
    if (bp.stars.localeCompare(AscendingLevels.enum[0])) {
      if (!Array.isArray(eg.ascending)) {
        console.log(`${eg.name} is not ascended`);
        return -11;
      }
      const ascending_score = eg.ascending.reduce((accumulator, ab, index) => {
        if (DEBUG_AES) {
          console.log('');
          console.log(`${eg.name}: Ascending ${index}`);
          console.log(`accumulator currently ${accumulator}`);
        }
        if (!eg.stars?.localeCompare(AscendingLevels.enum[0])) {
          return accumulator;
        } else {
          if (DEBUG_AES) {
            console.log(`${index} starting detection`);
          }
          if (ab.buff !== undefined && ab.buff !== null) {
            if (DEBUG_AES) {
              console.log(`${eg.name} Star ${index} pass null check`);
            }
            const v = z.array(Buff).safeParse(ab.buff);
            if (v.success) {
              const barray = v.data;
              if (DEBUG_AES) {
                console.log('--Array--');
                console.log(JSON.stringify(barray));
                console.log('--Array--');
              }
              const array_total = barray.reduce((a2, actual: BuffType) => {
                if (DEBUG_AES) {
                  console.log(JSON.stringify(actual));
                }
                if (eg.stars === undefined || eg.stars === null) {
                  return a2;
                }
                if (
                  !eg.stars.localeCompare(AscendingLevels.enum[10]) &&
                  !ab.level.localeCompare(AscendingLevels.enum[10])
                ) {
                  let tbscore = PvPAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPMarchSizeBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPPreservationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDebilitationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  return a2
                } else if (
                  (!eg.stars.localeCompare(AscendingLevels.enum[10]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[9])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[9])
                ) {
                  let tbscore = PvPAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPMarchSizeBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPPreservationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDebilitationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  return a2
                } else if (
                  (!eg.stars.localeCompare(AscendingLevels.enum[10]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[9]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[8])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[8])
                ) {
                  let tbscore = PvPAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPMarchSizeBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPPreservationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDebilitationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  return a2
                } else if (
                  (!eg.stars.localeCompare(AscendingLevels.enum[10]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[9]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[8]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[7])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[7])
                ) {
                  let tbscore = PvPAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPMarchSizeBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPPreservationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDebilitationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  return a2
                } else if (
                  (!eg.stars.localeCompare(AscendingLevels.enum[10]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[9]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[8]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[7]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[6])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[6])
                ) {
                  let tbscore = PvPAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPMarchSizeBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeAttackBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeHPBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDeDefenseBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPPreservationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  tbscore = PvPDebilitationBuff(
                    `Star ${index} ${ab.level}`, eg.name, actual, bp);
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  a2 += tbscore;
                  return a2
                } else {
                  console.log(
                    `${eg.name} Star ${index} ${ab.level} did not match anywhere deciding`
                  );
                  console.log(JSON.stringify(ab.buff));
                  return a2;
                }
              }, 0);
              accumulator += array_total;
              if (DEBUG_AES) {
                console.log(`returning ${accumulator}`);
              }
              return accumulator;
            } else {
              console.log(`${eg.name} error parsing ${index}`);
            }
          } else {
            console.log(
              `${eg.name} has a null or undefined buff ${JSON.stringify(ab)}`
            );
            return accumulator;
          }
          console.log(`${eg.name} reached final Ascending return 0`);
          return accumulator;
        }
      }, 0);
      if (DEBUG) {
        console.log(`${eg.name}: total ascending score: ${ascending_score} `);
        console.log('');
      }
      BSS_Score += Math.floor(ascending_score);
    }

    return Math.floor(BSS_Score);
  });
