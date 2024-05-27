import {z} from 'zod';

import {
  ActivationSituations,
  type ActivationSituationsType,
  AscendingLevels,
  Attribute,
  Buff,
  type BuffType,
  BuffParams,
  type BuffParamsType,
  ClassEnum,
  type ClassEnumType,
  Condition,
  type ConditionType,
  type levelsType,
  qualityColor,
  type qualityColorType,
  syslogSeverity,
  UnitSchema,
} from "@schemas/baseSchemas";

import {
  ConflictArray, 
  ConflictDatum,   
  type bookConflictsType,
  type ConflictDatumType,
 } from '@schemas/conflictSchemas'

 import {
  Note,
  Display,
  type DisplayType,
  type NoteType,
  GeneralArray,
  type GeneralClassType,
  GeneralElement,
  type GeneralArrayType,
  type GeneralElementType,
  generalSpecialists,
  type generalUseCaseType,
 } from '@schemas/generalsSchema'

 import {
  Speciality,
  type SpecialityType,
 } from '@schemas/specialitySchema'

 import { 
  ExtendedGeneral,
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type GeneralPairType,
  } from "@schemas/ExtendedGeneral";

import { 
  type BookType,
  specialSkillBook,
  standardSkillBook,
  type specialSkillBookType,
  type standardSkillBookType,
 } from "@schemas/bookSchemas";
 
import { PvPBuff } from "./PvPBuff";



const DEBUG_AES = false;
const DEBUG = false;

export const AttackPvPAES = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    const gc = eg.general;
    let BSS_Score = 0;

    //I will assume you set the bp to disabled if it is an assistant.
    if (bp.stars.localeCompare(AscendingLevels.enum[0])) {
      if (!Array.isArray(eg.general.ascending)) {
        console.log(`${eg.general.name} is not ascended`);
        return -11;
      }
      
      const ascending_score = eg.general.ascending.reduce((accumulator, ab, index) => {
        if (DEBUG_AES) {
          console.log('');
          console.log(`${gc.name}: Ascending ${index} ${ab.level}`);
          console.log(`accumulator currently ${accumulator}`);
        }
        if (!eg.general.stars?.localeCompare(AscendingLevels.enum[0])) {
          return accumulator;
        } else {
          if (DEBUG_AES) {
            console.log(`${index} starting detection`);
          }
          if (ab.buff !== undefined &&
            ab.buff !== null) {
            if (DEBUG_AES) {
              console.log(`${gc.name} Star ${index} pass null check`);
            }
            const v = z.array(Buff).safeParse(ab.buff);
            if (v.success) {
              const barray = v.data;
              if (DEBUG_AES) {
                console.log('--Array--');
                console.log(JSON.stringify(barray));
                console.log('--Array--');
              }
              const array_total = barray.reduce((accumulator, actual: BuffType) => {
                if (DEBUG_AES) {
                  console.log(JSON.stringify(actual));
                }
                if (eg.general.stars === undefined || eg.general.stars === null) {
                  return accumulator;
                }
                if (!eg.general.stars.localeCompare(AscendingLevels.enum[10]) &&
                  !ab.level.localeCompare(AscendingLevels.enum[10])) {
                  const tbscore = PvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore + accumulator;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[9])) {
                  const tbscore = PvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore + accumulator;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[8])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[8])) {
                  const tbscore = PvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore + accumulator;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[8]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[7])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[7])) {
                  const tbscore = PvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[8]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[7]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[6])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[6])) {
                  const tbscore = PvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore + accumulator;
                } else {
                  console.log(`${gc.name} Star ${index} ${ab.level} did not match anywhere deciding`);
                  console.log(JSON.stringify(ab.buff));
                  return accumulator;
                }
              }, 0);
              return accumulator + array_total;
            } else {
              console.log(`${gc.name} error parsing ${index}`);
            }
          } else {
            console.log(`${gc.name} has a null or undefined buff ${JSON.stringify(ab)}`);
            return accumulator;
          }
          console.log(`${gc.name} reached final Ascending return 0`);
          return accumulator;
        }
      }, 0);
      if (DEBUG) {
        console.log(`${gc.name}: total ascending score: ${ascending_score} `);
        console.log('');
      }
      BSS_Score += Math.floor(ascending_score);
    }

    return Math.floor(BSS_Score);
  });
