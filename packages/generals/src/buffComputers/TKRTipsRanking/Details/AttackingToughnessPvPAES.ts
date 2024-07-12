import { z } from 'zod';

import {
  AscendingLevels,
  Buff,
  type BuffType,
  type BuffParamsType,
} from '../../../schemas/baseSchemas';

import {
  type AscendingType,
  type generalUseCaseType,
} from '../../../schemas/generalsSchema';

import { type ExtendedGeneralType } from '../../../schemas/ExtendedGeneral';

import { type BuffFunctionInterface } from '../../../RankingInterfaces';
import type { AttributeMultipliersType } from '../../../schemas/EvAns.zod';

const DEBUG_AES = false;
const DEBUG = false;

function buffDetailsReducerLogic(
  tbf: BuffFunctionInterface,
  index: number,
  ab: AscendingType,
  eg: ExtendedGeneralType,
  actual: BuffType,
  bp: BuffParamsType,
  useCase: generalUseCaseType,
  am: AttributeMultipliersType,
) {
  let a3 = 0;
  let tbscore = 0;

  tbscore = tbf.HP(
    `Star ${index} ${ab.level}`,
    eg.name,
    actual,
    bp,
    useCase,
    am,
  );
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a3 += tbscore;
  tbscore = tbf.Defense(
    `Star ${index} ${ab.level}`,
    eg.name,
    actual,
    bp,
    useCase,
    am,
  );
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a3 += tbscore;
  tbscore = tbf.DeAttack(
    `Star ${index} ${ab.level}`,
    eg.name,
    actual,
    bp,
    useCase,
    am,
  );
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a3 += tbscore;

  return a3;
}

export const PvPAES = (
  eg: ExtendedGeneralType,
  bp: BuffParamsType,
  typedBuffFunction: BuffFunctionInterface,
  useCase: generalUseCaseType,
  am: AttributeMultipliersType,
) => {
  let BSS_Score = 0;

  //I will assume you set the bp to disabled if it is an assistant.
  if (bp.stars.localeCompare(AscendingLevels.enum['0stars'])) {
    if (!Array.isArray(eg.ascending)) {
      if (DEBUG_AES) {
        console.log(`${eg.name} is not ascended`);
      }
      return -11;
    }
    const ascending_score = eg.ascending.reduce((accumulator, ab, index) => {
      if (DEBUG_AES) {
        console.log('');
        console.log(`${eg.name}: Ascending ${index}`);
        console.log(`accumulator currently ${accumulator}`);
      }
      if (!eg.stars?.localeCompare(AscendingLevels.enum['0stars'])) {
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
                !bp.stars.localeCompare(AscendingLevels.enum['5red']) &&
                !eg.stars.localeCompare(AscendingLevels.enum['5red']) &&
                !ab.level.localeCompare(AscendingLevels.enum['5red'])
              ) {
                if (DEBUG) {
                  console.log(`PvPAES matched 5Red`);
                }
                a2 += buffDetailsReducerLogic(
                  typedBuffFunction,
                  index,
                  ab,
                  eg,
                  actual,
                  bp,
                  useCase,
                  am,
                );
                return a2;
              } else if (
                (!bp.stars.localeCompare(AscendingLevels.enum['5red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['4red'])) &&
                !ab.level.localeCompare(AscendingLevels.enum['4red']) &&
                (!eg.stars.localeCompare(AscendingLevels.enum['5red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['4red']))
              ) {
                if (DEBUG) {
                  console.log(`PvPAES matched 4Red`);
                }
                a2 += buffDetailsReducerLogic(
                  typedBuffFunction,
                  index,
                  ab,
                  eg,
                  actual,
                  bp,
                  useCase,
                  am,
                );
                return a2;
              } else if (
                (!bp.stars.localeCompare(AscendingLevels.enum['5red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['4red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['3red'])) &&
                !ab.level.localeCompare(AscendingLevels.enum['3red']) &&
                (!eg.stars.localeCompare(AscendingLevels.enum['5red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['4red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['3red']))
              ) {
                if (DEBUG) {
                  console.log(`PvPAES matched 3Red`);
                }
                a2 += buffDetailsReducerLogic(
                  typedBuffFunction,
                  index,
                  ab,
                  eg,
                  actual,
                  bp,
                  useCase,
                  am,
                );
                return a2;
              } else if (
                (!bp.stars.localeCompare(AscendingLevels.enum['5red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['4red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['3red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['2red'])) &&
                !ab.level.localeCompare(AscendingLevels.enum['2red']) &&
                (!eg.stars.localeCompare(AscendingLevels.enum['5red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['4red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['3red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['2red']))
              ) {
                if (DEBUG) {
                  console.log(`PvPAES matched 2Red`);
                }
                a2 += buffDetailsReducerLogic(
                  typedBuffFunction,
                  index,
                  ab,
                  eg,
                  actual,
                  bp,
                  useCase,
                  am,
                );
                return a2;
              } else if (
                (!bp.stars.localeCompare(AscendingLevels.enum['5red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['4red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['3red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['2red']) ||
                  !bp.stars.localeCompare(AscendingLevels.enum['1red'])) &&
                !ab.level.localeCompare(AscendingLevels.enum['1red']) &&
                (!eg.stars.localeCompare(AscendingLevels.enum['5red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['4red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['3red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['2red']) ||
                  !eg.stars.localeCompare(AscendingLevels.enum['1red']))
              ) {
                if (DEBUG) {
                  console.log(`PvPAES matched 1Red`);
                }
                a2 += buffDetailsReducerLogic(
                  typedBuffFunction,
                  index,
                  ab,
                  eg,
                  actual,
                  bp,
                  useCase,
                  am,
                );
                return a2;
              }
              return a2;
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
            `${eg.name} has a null or undefined buff ${JSON.stringify(ab)}`,
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
};
