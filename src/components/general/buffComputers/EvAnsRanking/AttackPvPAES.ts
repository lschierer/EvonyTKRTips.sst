import { z } from 'zod';

import {
  AscendingLevels,
  Buff,
  type BuffType,
  BuffParams,
  type BuffParamsType,
} from '@schemas/baseSchemas';

import {
  Ascending,
  type AscendingType
} from '@schemas/generalsSchema.ts'

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import {type BuffFunctionInterface} from '@lib/RankingInterfaces';

const DEBUG_AES = false;
const DEBUG = false;

function buffDetailsReducerLogic(tbf: BuffFunctionInterface, index: number, ab: AscendingType, eg: ExtendedGeneralType, actual:BuffType, bp: BuffParamsType, a2: number) {
  let tbscore = tbf.Attack(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.MarchSize(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.HP(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.Defense(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.DeAttack(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.DeHP(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.DeHP(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.DeDefense(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.Preservation(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  a2 += tbscore;
  tbscore = tbf.Debilitation(
    `Star ${index} ${ab.level}`, eg.name, actual, bp);
  if (DEBUG_AES) {
    console.log(`accumulating ${tbscore}`);
  }
  return tbscore
}

export const AttackPvPAES = (eg: ExtendedGeneralType, bp: BuffParamsType, typedBuffFunction: BuffFunctionInterface) => {
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
                  a2 += buffDetailsReducerLogic(typedBuffFunction,index,ab, eg, actual, bp, a2)
                  return a2;
                } else if (
                  (!eg.stars.localeCompare(AscendingLevels.enum[10]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[9])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[9])
                ) {
                  a2 += buffDetailsReducerLogic(typedBuffFunction,index,ab, eg, actual, bp, a2)
                  return a2
                } else if (
                  (!eg.stars.localeCompare(AscendingLevels.enum[10]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[9]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[8])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[8])
                ) {
                  a2 += buffDetailsReducerLogic(typedBuffFunction,index,ab, eg, actual, bp, a2)
                  return a2
                } else if (
                  (!eg.stars.localeCompare(AscendingLevels.enum[10]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[9]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[8]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[7])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[7])
                ) {
                  a2 += buffDetailsReducerLogic(typedBuffFunction,index,ab, eg, actual, bp, a2)
                  return a2
                } else if (
                  (!eg.stars.localeCompare(AscendingLevels.enum[10]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[9]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[8]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[7]) ||
                    !eg.stars.localeCompare(AscendingLevels.enum[6])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[6])
                ) {
                  a2 += buffDetailsReducerLogic(typedBuffFunction,index,ab, eg, actual, bp, a2)
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
  }
