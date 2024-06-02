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

import { PvPBuff } from './PvPBuff';

const DEBUG_AES = false;
const DEBUG = false;

export const PvPAES = z
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
      const ascending_score = eg.ascending.reduce(
        (accumulator, ab, index) => {
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
                const array_total = barray.reduce(
                  (accumulator, actual: BuffType) => {
                    if (DEBUG_AES) {
                      console.log(JSON.stringify(actual));
                    }
                    if (
                      eg.stars === undefined ||
                      eg.stars === null
                    ) {
                      return accumulator;
                    }
                    if (
                      !eg.stars.localeCompare(
                        AscendingLevels.enum[10]
                      ) &&
                      !ab.level.localeCompare(AscendingLevels.enum[10])
                    ) {
                      const tbscore = PvPBuff(
                        `Star ${index} ${ab.level}`,
                        eg.name,
                        actual,
                        bp
                      );
                      if (DEBUG_AES) {
                        console.log(`accumulating ${tbscore}`);
                      }
                      return tbscore + accumulator;
                    } else if (
                      (!eg.stars.localeCompare(
                        AscendingLevels.enum[10]
                      ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[9]
                        )) &&
                      !ab.level.localeCompare(AscendingLevels.enum[9])
                    ) {
                      const tbscore = PvPBuff(
                        `Star ${index} ${ab.level}`,
                        eg.name,
                        actual,
                        bp
                      );
                      if (DEBUG_AES) {
                        console.log(`accumulating ${tbscore}`);
                      }
                      return tbscore + accumulator;
                    } else if (
                      (!eg.stars.localeCompare(
                        AscendingLevels.enum[10]
                      ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[9]
                        ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[8]
                        )) &&
                      !ab.level.localeCompare(AscendingLevels.enum[8])
                    ) {
                      const tbscore = PvPBuff(
                        `Star ${index} ${ab.level}`,
                        eg.name,
                        actual,
                        bp
                      );
                      if (DEBUG_AES) {
                        console.log(`accumulating ${tbscore}`);
                      }
                      return tbscore + accumulator;
                    } else if (
                      (!eg.stars.localeCompare(
                        AscendingLevels.enum[10]
                      ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[9]
                        ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[8]
                        ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[7]
                        )) &&
                      !ab.level.localeCompare(AscendingLevels.enum[7])
                    ) {
                      const tbscore = PvPBuff(
                        `Star ${index} ${ab.level}`,
                        eg.name,
                        actual,
                        bp
                      );
                      if (DEBUG_AES) {
                        console.log(`accumulating ${tbscore}`);
                      }
                      return tbscore;
                    } else if (
                      (!eg.stars.localeCompare(
                        AscendingLevels.enum[10]
                      ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[9]
                        ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[8]
                        ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[7]
                        ) ||
                        !eg.stars.localeCompare(
                          AscendingLevels.enum[6]
                        )) &&
                      !ab.level.localeCompare(AscendingLevels.enum[6])
                    ) {
                      const tbscore = PvPBuff(
                        `Star ${index} ${ab.level}`,
                        eg.name,
                        actual,
                        bp
                      );
                      if (DEBUG_AES) {
                        console.log(`accumulating ${tbscore}`);
                      }
                      return tbscore + accumulator;
                    } else {
                      console.log(
                        `${eg.name} Star ${index} ${ab.level} did not match anywhere deciding`
                      );
                      console.log(JSON.stringify(ab.buff));
                      return accumulator;
                    }
                  },
                  0
                );
                return accumulator + array_total;
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
        },
        0
      );
      if (DEBUG) {
        console.log(`${eg.name}: total ascending score: ${ascending_score} `);
        console.log('');
      }
      BSS_Score += Math.floor(ascending_score);
    }

    return Math.floor(BSS_Score);
  });
