import { z } from 'zod';

import {
  Attribute,
  Buff,
  type BuffType,
  BuffParams,
  type BuffParamsType,
  ClassEnum,
  Condition,
  UnitSchema,
} from '@schemas/baseSchemas';

import {AttributeMultipliers, type AttributeMultipliersType} from '@schemas/EvAns.zod';
import { checkInvalidConditions } from '../checkConditions';
import { generalUseCase, type generalUseCaseType } from '@schemas/generalsSchema.ts';

const DEBUGRB = false;

const PvPRangeBuffClassCheck = z
  .function()
  .args(Buff, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement((tb: BuffType, iv: BuffParamsType, am: AttributeMultipliersType) => {
    let score = 0;
    let multiplier = 0;
    if (tb !== null && tb !== undefined) {
      if (tb.value !== null && tb.value !== undefined) {
        if (tb.class !== null && tb.class !== undefined) {
          if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
            multiplier =
              am?.Offensive.RangedRangeBonus ??
              0;
          } else if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
            multiplier = 0;
          } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
            multiplier = 0;
          } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
            if (tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
              multiplier =
                am?.Offensive
                  .SiegeRangeBonusPercent ?? 0;
            } else {
              multiplier =
                am?.Offensive
                  .SiegeRangeBonusFlat ?? 0;
            }
          } else {
            multiplier = 0;
          }
        } else {
          multiplier = 0;
        }
        const additional = tb.value.number * multiplier;
        if (DEBUGRB) {
          console.log(`adding ${additional} to ${score}`);
        }
        score += additional;
      }
    }
    return score;
  });

export const RangeBuff = z
  .function()
  .args(z.string(), z.string(), Buff, BuffParams, generalUseCase, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (
      buffName: string,
      generalName: string,
      tb: BuffType,
      iv: BuffParamsType,
      useCase: generalUseCaseType,
      am: AttributeMultipliersType
    ) => {
      const multiplier = 0;
      if (tb === null || tb === undefined || iv === null || iv === undefined) {
        return -1000;
      } else {
        if (DEBUGRB) {
          console.log(`PvPRangeBuff: ${generalName}: ${buffName}`);
        }
        let score = 0;
        if (tb?.value === undefined || tb.value === null) {
          console.log(
            `how to score a buff with no value? gc is ${generalName}`
          );
          return score;
        } else {
          if (DEBUGRB) {
            console.log(`PvPRangeBuff: ${generalName}: ${buffName} has value`);
          }
          if (tb.attribute === undefined || tb.attribute === null) {
            if (DEBUGRB) {
              console.log(
                `PvPRangeBuff: ${generalName}: ${buffName} has null attribute`
              );
            }
            return score;
          } else if (Attribute.enum.Range.localeCompare(tb.attribute)) {
            if (DEBUGRB) {
              console.log(
                `PvPRangeBuff: ${generalName}: ${buffName} is not an Range buff`
              );
            }
            return score;
          } else {
            //check if buff has some conditions that never work for PvP
            if (tb.condition !== null && tb.condition !== undefined) {
              if (checkInvalidConditions(tb, iv, useCase)) {
                //I probably ought to rename that function, but if I get here,
                //there were no invalid conditions
                if (
                  tb.condition.includes(Condition.enum.Enemy) ||
                  tb.condition.includes(Condition.enum.Enemy_In_City) ||
                  tb.condition.includes(Condition.enum.Reduces_Enemy) ||
                  tb.condition.includes(
                    Condition.enum.Reduces_Enemy_in_Attack
                  ) ||
                  tb.condition.includes(
                    Condition.enum.Reduces_Enemy_with_a_Dragon
                  )
                ) {
                  if (DEBUGRB) {
                    console.log(
                      `PvPRangeBuff: ${generalName}: ${buffName} detected attack debuff`
                    );
                  }
                  return 0;
                } else {
                  //I think all other conditions that matter have been checked
                  score = PvPRangeBuffClassCheck(tb, iv, am);
                }
              } else {
                //if I get here, there were invalid conditions
                return score;
              }
            } else {
              //if I get here, there were no conditions to check, but there is
              //an attack attribute.
              score = PvPRangeBuffClassCheck(tb, iv, am);
            }
          }
        }
        return score;
      }
    }
  );
