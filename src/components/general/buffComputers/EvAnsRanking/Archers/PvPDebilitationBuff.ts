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

import { checkInvalidConditions } from '../EvAnsScoreComputer';

import { RangedPvPAttackAttributeMultipliers } from '@lib/EvAnsAttributeRanking';

const DEBUGT = false;

/* Debuffs have an extra consideration, as they are one of the primary places that push
 * the "condition" field into being an array instead of a singular adjective.
 * A DeBuff can be
 * 1) Generic
 * 2) Limited to Attacking or Marching (consensus is these are the same)
 * 3) Limited to defending one's own city
 * 4) Limited to defending *something else*
 * 5) Limited to being in a specific role then applying generically.
 */

const PvPDeDebilitationBuffDetailCheck = z
  .function()
  .args(Buff, BuffParams)
  .returns(z.number())
  .implement((tb: BuffType, iv: BuffParamsType) => {
    let score = 0;
    let multiplier = 0;
    if (tb !== null && tb !== undefined) {
      if (tb.condition !== null && tb.condition !== undefined) {
        if (tb.value !== null && tb.value !== undefined) {
          if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
            if (tb.class !== null && tb.class !== undefined) {
              //I don't think I've ever seen a class limited Debilitation debuff. I think
              // this is how it would be handled by EvAns.
              if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                if (
                  tb.condition.includes(Condition.enum.Attacking) ||
                  tb.condition.includes(Condition.enum.Marching) ||
                  tb.condition.includes(
                    Condition.enum.Reduces_Enemy_in_Attack
                  ) ||
                  tb.condition.includes(
                    Condition.enum.brings_dragon_or_beast_to_attack
                  ) ||
                  tb.condition.includes(
                    Condition.enum.When_Defending_Outside_The_Main_City
                  )
                ) {
                  multiplier =
                    RangedPvPAttackAttributeMultipliers.Debilitation
                      .Wounded2DeathWhenAttacking;
                } else if (
                  tb.condition.includes(Condition.enum.Enemy_In_City)
                ) {
                  RangedPvPAttackAttributeMultipliers.Debilitation
                    .InCityWounded2Death;
                } else {
                  multiplier =
                    RangedPvPAttackAttributeMultipliers.Debilitation
                      .Wounded2Death;
                }
              } else if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                multiplier = 0;
              } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                multiplier = 0;
              } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                multiplier = 0;
              } else {
                multiplier = 0;
              }
            } else {
              if (
                tb.condition.includes(Condition.enum.Attacking) ||
                tb.condition.includes(Condition.enum.Marching) ||
                tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
                tb.condition.includes(
                  Condition.enum.brings_dragon_or_beast_to_attack
                ) ||
                tb.condition.includes(
                  Condition.enum.When_Defending_Outside_The_Main_City
                )
              ) {
                multiplier =
                  RangedPvPAttackAttributeMultipliers.Debilitation
                    .Wounded2DeathWhenAttacking;
              } else if (tb.condition.includes(Condition.enum.Enemy_In_City)) {
                RangedPvPAttackAttributeMultipliers.Debilitation
                  .InCityWounded2Death;
              } else {
                multiplier =
                  RangedPvPAttackAttributeMultipliers.Debilitation
                    .Wounded2Death;
              }
            }
            const additional = Math.abs(tb.value.number) * multiplier;
            if (DEBUGT) {
              console.log(`adding ${additional} to ${score}`);
            }
            score += additional;
          }
        }
      }
    }
    return score;
  });

export const PvPDebilitationBuff = z
  .function()
  .args(z.string(), z.string(), Buff, BuffParams)
  .returns(z.number())
  .implement(
    (
      buffName: string,
      generalName: string,
      tb: BuffType,
      iv: BuffParamsType
    ) => {
      if (tb === null || tb === undefined || iv === null || iv === undefined) {
        return -1000;
      } else {
        if (DEBUGT) {
          console.log(`PvPDebilitationBuff: ${generalName}: ${buffName}`);
        }
        let score = 0;
        if (tb?.value === undefined || tb.value === null) {
          console.log(
            `how to score a buff with no value? gc is ${generalName}`
          );
          return score;
        } else {
          if (DEBUGT) {
            console.log(
              `PvPDebilitationBuff: ${generalName}: ${buffName} has value`
            );
          }
          if (tb.attribute === undefined || tb.attribute === null) {
            if (DEBUGT) {
              console.log(
                `PvPDebilitationBuff: ${generalName}: ${buffName} has null attribute`
              );
            }
            return score;
          } else if (
            Attribute.enum.Wounded_to_Death.localeCompare(tb.attribute)
          ) {
            if (DEBUGT) {
              console.log(
                `PvPDebilitationBuff: ${generalName}: ${buffName} is not an Debilitation buff`
              );
            }
            return score;
          } else {
            //check if buff has some conditions that never work for PvP
            if (tb.condition !== null && tb.condition !== undefined) {
              if (checkInvalidConditions(tb, iv)) {
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
                  if (DEBUGT) {
                    console.log(
                      `PvPDebilitationBuff: ${generalName}: ${buffName} detected Debilitation buff`
                    );
                  }
                  return PvPDeDebilitationBuffDetailCheck(tb, iv);
                } else {
                  //I am *ONLY* looking for debuffs here. DO NOT handle anything not a debuff.
                  return score;
                }
              } else {
                //if I get here, there were invalid conditions
                return score;
              }
            } else {
              //I am *ONLY* looking for debuffs here. DO NOT handle anything not a debuff.
              //Debuffs *always* have conditions.
              return score;
            }
          }
        }
        return score;
      }
    }
  );