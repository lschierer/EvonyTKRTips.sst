import {
  BuffParams,
  type BuffParamsType, type BuffType,
  qualityColor,
} from '@schemas/baseSchemas';

import { Speciality, type SpecialityType } from '@schemas/specialitySchema';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import { type BuffFunctionInterface } from '@lib/RankingInterfaces';
import type { AttributeMultipliersType } from '@schemas/EvAns.zod.ts';
import type { CovenantAttributeType, generalUseCaseType } from '@schemas/generalsSchema.ts';

const DEBUG = true;

const buffReductionLogic = (buffName: string, eg: ExtendedGeneralType, ab: BuffType, bp: BuffParamsType, tbfo: BuffFunctionInterface, useCase: generalUseCaseType, am: AttributeMultipliersType) => {
  let ba = 0;
  let total = tbfo.Attack(
    buffName, eg.name, ab, bp, useCase, am);
  if (DEBUG) {
    console.log(`CovBuff Attack adding ${total} to: ${ba}`);
  }
  ba += total;
  total = tbfo.MarchSize(
    buffName, eg.name, ab, bp, useCase, am);
  if (DEBUG) {
    console.log(`CovBuff MarchSize adding ${total} to: ${ba}`);
  }
  ba += total;

  total = tbfo.DeHP(
    buffName, eg.name, ab, bp, useCase, am);
  if (DEBUG) {
    console.log(`CovBuff DeHP adding ${total} to: ${ba}`);
  }
  ba += total;
  total = tbfo.DeDefense(
    buffName, eg.name, ab, bp, useCase, am);
  if (DEBUG) {
    console.log(`CovBuff DeDefense adding ${total} to: ${ba}`);
  }
  ba += total;

  total = tbfo.Range(buffName, eg.name, ab, bp, useCase, am);
  if (DEBUG) {
    console.log(`CovBuff Range adding ${total} to: ${ba}`);
  }
  ba += total;
  return Math.floor(ba);
};


export const PvPCov = (eg: ExtendedGeneralType, bp: BuffParamsType, typedBuffFunction: BuffFunctionInterface, useCase: generalUseCaseType, am: AttributeMultipliersType) => {
  let Score = 0;
  if(DEBUG) {
    console.log(`PvPCov start`)
  }
  if(eg.covenants.length < 1){
    if(DEBUG) {
      console.log(`${eg.name} has no covenants: ${eg.covenants.length}`)
    }
    return Score;
  } else {
    Score = eg.covenants.reduce((acc, cur: CovenantAttributeType) => {
      if(cur === null || cur === undefined) {
        return acc;
      } else {
        if(Array.isArray(cur.buff) && cur.buff.length > 0){
          const bValue = cur.buff.reduce((ac2, thisB: BuffType) => {
            if(thisB === null || thisB === undefined) {
              return ac2;
            } else {
              if(thisB.value === null || thisB.value === undefined) {
                return ac2;
              } else {
                return buffReductionLogic(cur.category, eg, thisB, bp, typedBuffFunction, useCase, am);
              }
            }
          }, 0)
          if(DEBUG) {
            console.log(`PvPCov adding ${bValue} to ${acc} for ${cur.category}`)
          }
          acc += bValue;
        }
      }
      return acc;
    }, 0)
  }
  return Score;
}
