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

import {AttributeMultipliers, type AttributeMultipliersType} from '@schemas/EvAns.zod'

import { RangedPvPAttackAttributeMultipliers } from '@lib/EvAnsAttributeRanking';

const DEBUGA = false;

const AttackBuffDetailCheck = z
  .function()
  .args(Buff, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement((tb: BuffType, iv: BuffParamsType, am: AttributeMultipliersType) => {
    let score = 0;
    let multiplier = 0;
    if (tb !== null && tb !== undefined) {
      if (tb.value !== null && tb.value !== undefined) {
        if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
          if (tb.class !== null && tb.class !== undefined) {
            if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
              multiplier =
                am.Offensive.RangedAttack ??
                0;
            } else if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
              multiplier =
                am.Offensive.GroundAttack ??
                0;
            } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
              multiplier =
                am.Offensive.MountedAttack ??
                0;
            } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
              multiplier =
                am.Offensive.SiegeAttack ?? 0;
            } else {
              multiplier = 0;
            }
          } else {
            multiplier =
              am.Offensive.AllTroopAttack ??
              0;
          }
          const additional = tb.value.number * multiplier;
          if (DEBUGA) {
            console.log(
              `adding ${additional} to ${score}, multiplier: ${multiplier}`
            );
          }
          score += additional;
        }
      }
    }
    return score;
  });

export const AttackBuff = z
  .function()
  .args(z.string(), z.string(), Buff, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (
      buffName: string,
      generalName: string,
      tb: BuffType,
      iv: BuffParamsType,
      am: AttributeMultipliersType
    ) => {
      const multiplier = 0;
      if (tb === null || tb === undefined || iv === null || iv === undefined) {
        return -1000;
      } else {
        if (DEBUGA) {
          console.log(`PvPAttackBuff: ${generalName}: ${buffName}`);
        }
        let score = 0;
        if (tb?.value === undefined || tb.value === null) {
          console.log(
            `how to score a buff with no value? gc is ${generalName}`
          );
          return score;
        } else {
          if (DEBUGA) {
            console.log(`PvPAttackBuff: ${generalName}: ${buffName} has value`);
          }
          if (tb.attribute === undefined || tb.attribute === null) {
            if (DEBUGA) {
              console.log(
                `PvPAttackBuff: ${generalName}: ${buffName} has null attribute`
              );
            }
            return score;
          } else if (Attribute.enum.Attack.localeCompare(tb.attribute)) {
            if (DEBUGA) {
              console.log(
                `PvPAttackBuff: ${generalName}: ${buffName} is not an attack buff`
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
                  if (DEBUGA) {
                    console.log(
                      `PvPAttackBuff: ${generalName}: ${buffName} detected attack debuff`
                    );
                  }
                  return 0;
                } else {
                  //I think all other conditions that matter have been checked
                  score = AttackBuffDetailCheck(tb, iv, am);
                  if (DEBUGA) {
                    console.log(
                      `\`PvPAttackBuff: ${generalName}: ${buffName} score: ${score}`
                    );
                  }
                }
              } else {
                //if I get here, there were invalid conditions
                return score;
              }
            } else {
              //if I get here, there were no conditions to check, but there is
              //an attack attribute.
              score = AttackBuffDetailCheck(tb, iv, am);
            }
          }
        }
        return score;
      }
    }
  );
