import {
  AscendingLevels,
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
import {
  CovenantAttributeCategory,
  type CovenantAttributeType,
  type generalUseCaseType,
} from '@schemas/generalsSchema.ts';

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


export const CovComputer = (eg: ExtendedGeneralType, bp: BuffParamsType, typedBuffFunction: BuffFunctionInterface, useCase: generalUseCaseType, am: AttributeMultipliersType) => {
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
        if(
          (
            !cur.category.localeCompare(CovenantAttributeCategory.enum['War Covenant']) ||
            !cur.category.localeCompare(CovenantAttributeCategory.enum['Cooperation Covenant'])
          ) &&
          ((
              bp.special1.localeCompare(qualityColor.enum.Disabled) &&
              bp.special1.localeCompare(qualityColor.enum.Green) &&
              bp.special1.localeCompare(qualityColor.enum.Blue) &&
              bp.special2.localeCompare(qualityColor.enum.Disabled) &&
              bp.special2.localeCompare(qualityColor.enum.Green) &&
              bp.special2.localeCompare(qualityColor.enum.Blue) &&
              bp.special3.localeCompare(qualityColor.enum.Disabled) &&
              bp.special3.localeCompare(qualityColor.enum.Green) &&
              bp.special3.localeCompare(qualityColor.enum.Blue)
            ) ||
            (
              bp.stars.localeCompare(AscendingLevels.enum['0stars']) &&
              bp.stars.localeCompare(AscendingLevels.enum['1red'])
            ))
        ) {
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
        if(
          (
            !cur.category.localeCompare(CovenantAttributeCategory.enum['Peace Covenant']) ||
            !cur.category.localeCompare(CovenantAttributeCategory.enum['Faith Covenant'])
          ) &&
          ((
              (
                !bp.special1.localeCompare(qualityColor.enum.Orange) ||
                !bp.special1.localeCompare(qualityColor.enum.Gold)
              ) &&
              (
                !bp.special2.localeCompare(qualityColor.enum.Orange) ||
                !bp.special2.localeCompare(qualityColor.enum.Gold)
              ) &&
              (
                !bp.special3.localeCompare(qualityColor.enum.Orange) ||
                !bp.special3.localeCompare(qualityColor.enum.Gold)
              )
            ) ||
            (
              bp.stars.localeCompare(AscendingLevels.enum['0stars']) &&
              bp.stars.localeCompare(AscendingLevels.enum['1red']) &&
              bp.stars.localeCompare(AscendingLevels.enum['2red']) &&
              bp.stars.localeCompare(AscendingLevels.enum['3red'])
            ))
        ) {
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
        if(
          (
            !cur.category.localeCompare(CovenantAttributeCategory.enum['Honor Covenant']) ||
            !cur.category.localeCompare(CovenantAttributeCategory.enum['Civilization Covenant'])
          ) &&
          ((
              !bp.special1.localeCompare(qualityColor.enum.Gold) &&
              !bp.special2.localeCompare(qualityColor.enum.Gold) &&
              !bp.special3.localeCompare(qualityColor.enum.Gold) &&
              !bp.special4.localeCompare(qualityColor.enum.Gold)
            ) ||
            !bp.stars.localeCompare(AscendingLevels.enum['5red'])
          )
        ) {
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
      }
      return acc;
    }, 0)
  }
  return Score;
}
