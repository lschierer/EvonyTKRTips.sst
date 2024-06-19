const DEBUG = false;

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

import {
  AttributeMultipliers,
  type AttributeMultipliersType,
} from '@schemas/EvAns.zod';

import { checkInvalidConditions } from '../checkConditions';
import {
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema.ts';

/* Debuffs have an extra consideration, as they are one of the primary places that push
 * the "condition" field into being an array instead of a singular adjective.
 * A DeBuff can be
 * 1) Generic
 * 2) Limited to Attacking or Marching (consensus is these are the same)
 * 3) Limited to defending one's own city
 * 4) Limited to defending *something else*
 * 5) Limited to being in a specific role then applying generically.
 */

const DeDefenseBuffDetailCheck = z
  .function()
  .args(Buff, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (tb: BuffType, iv: BuffParamsType, am: AttributeMultipliersType) => {
      let score = 0;
      let multiplier = 0;
      if (tb !== null && tb !== undefined) {
        if (tb.condition !== null && tb.condition !== undefined) {
          if (tb.value !== null && tb.value !== undefined) {
            if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
              if (tb.class !== null && tb.class !== undefined) {
                if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                  if (
                    tb.condition.includes(Condition.enum.Attacking) ||
                    tb.condition.includes(Condition.enum.Marching) ||
                    tb.condition.includes(Condition.enum.Enemy_In_City) ||
                    tb.condition.includes(
                      Condition.enum.Reduces_Enemy_in_Attack,
                    ) ||
                    tb.condition.includes(
                      Condition.enum.brings_dragon_or_beast_to_attack,
                    ) ||
                    tb.condition.includes(
                      Condition.enum.When_Defending_Outside_The_Main_City,
                    )
                  ) {
                    multiplier =
                      am.AttackingToughnessDebuff.ReduceEnemyRangedDefense;
                  } else {
                    multiplier =
                      am.ReinforcingToughnessDebuff.ReduceEnemyRangedDefense;
                  }
                } else if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                  if (
                    tb.condition.includes(Condition.enum.Attacking) ||
                    tb.condition.includes(Condition.enum.Marching) ||
                    tb.condition.includes(Condition.enum.Enemy_In_City) ||
                    tb.condition.includes(
                      Condition.enum.Reduces_Enemy_in_Attack,
                    ) ||
                    tb.condition.includes(
                      Condition.enum.brings_dragon_or_beast_to_attack,
                    ) ||
                    tb.condition.includes(
                      Condition.enum.When_Defending_Outside_The_Main_City,
                    )
                  ) {
                    multiplier =
                      am.AttackingToughnessDebuff.ReduceEnemyGroundDefense;
                  } else {
                    multiplier =
                      am.ReinforcingToughnessDebuff.ReduceEnemyGroundDefense;
                  }
                } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                  if (
                    tb.condition.includes(Condition.enum.Attacking) ||
                    tb.condition.includes(Condition.enum.Marching) ||
                    tb.condition.includes(Condition.enum.Enemy_In_City) ||
                    tb.condition.includes(
                      Condition.enum.Reduces_Enemy_in_Attack,
                    ) ||
                    tb.condition.includes(
                      Condition.enum.brings_dragon_or_beast_to_attack,
                    ) ||
                    tb.condition.includes(
                      Condition.enum.When_Defending_Outside_The_Main_City,
                    )
                  ) {
                    multiplier =
                      am.AttackingToughnessDebuff.ReduceEnemyMountedDefense;
                  } else {
                    multiplier =
                      am.ReinforcingToughnessDebuff.ReduceEnemyMountedDefense;
                  }
                } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                  if (
                    tb.condition.includes(Condition.enum.Attacking) ||
                    tb.condition.includes(Condition.enum.Marching) ||
                    tb.condition.includes(Condition.enum.Enemy_In_City) ||
                    tb.condition.includes(
                      Condition.enum.Reduces_Enemy_in_Attack,
                    ) ||
                    tb.condition.includes(
                      Condition.enum.brings_dragon_or_beast_to_attack,
                    ) ||
                    tb.condition.includes(
                      Condition.enum.When_Defending_Outside_The_Main_City,
                    )
                  ) {
                    multiplier =
                      am.AttackingToughnessDebuff.ReduceEnemySiegeDefense;
                  } else {
                    multiplier =
                      am.ReinforcingToughnessDebuff.ReduceEnemySiegeDefense;
                  }
                } else {
                  multiplier = 0;
                }
              } else {
                if (
                  tb.condition.includes(Condition.enum.Attacking) ||
                  tb.condition.includes(Condition.enum.Marching) ||
                  tb.condition.includes(Condition.enum.Enemy_In_City) ||
                  tb.condition.includes(
                    Condition.enum.Reduces_Enemy_in_Attack,
                  ) ||
                  tb.condition.includes(
                    Condition.enum.brings_dragon_or_beast_to_attack,
                  ) ||
                  tb.condition.includes(
                    Condition.enum.When_Defending_Outside_The_Main_City,
                  )
                ) {
                  multiplier =
                    am.AttackingToughnessDebuff.ReduceEnemyAllDefense;
                } else {
                  multiplier =
                    am.ReinforcingToughnessDebuff.ReduceEnemyAllDefense;
                }
              }
              const additional = Math.abs(tb.value.number) * multiplier;
              if (DEBUG) {
                console.log(`adding ${additional} to ${score}`);
              }
              score += additional;
            }
          }
        }
      }
      return score;
    },
  );

export const DeDefenseBuff = z
  .function()
  .args(
    z.string(),
    z.string(),
    Buff,
    BuffParams,
    generalUseCase,
    AttributeMultipliers,
  )
  .returns(z.number())
  .implement(
    (
      buffName: string,
      generalName: string,
      tb: BuffType,
      iv: BuffParamsType,
      useCase: generalUseCaseType,
      am: AttributeMultipliersType,
    ) => {
      if (DEBUG) {
        console.log(`DeDefenseBuff ${generalName} ${buffName} ${useCase}`);
      }
      if (tb === null || tb === undefined || iv === null || iv === undefined) {
        return -1000;
      } else {
        if (DEBUG) {
          console.log(`PvPDeDefenseBuff: ${generalName}: ${buffName}`);
        }
        const score = 0;
        if (tb?.value === undefined || tb.value === null) {
          console.log(
            `how to score a buff with no value? gc is ${generalName}`,
          );
          return score;
        } else {
          if (DEBUG) {
            console.log(
              `PvPDeDefenseBuff: ${generalName}: ${buffName} has value`,
            );
          }
          if (tb.attribute === undefined || tb.attribute === null) {
            if (DEBUG) {
              console.log(
                `PvPDeDefenseBuff: ${generalName}: ${buffName} has null attribute`,
              );
            }
            return score;
          } else if (Attribute.enum.Defense.localeCompare(tb.attribute)) {
            if (DEBUG) {
              console.log(
                `PvPDeDefenseBuff: ${generalName}: ${buffName} is not an Defense debuff`,
              );
            }
            return score;
          } else {
            //check if buff has some conditions that never work for PvP
            if (tb.condition !== null && tb.condition !== undefined) {
              if (checkInvalidConditions(tb, iv, useCase, true)) {
                //I probably ought to rename that function, but if I get here,
                //there were no invalid conditions
                if (
                  tb.condition.includes(Condition.enum.Enemy) ||
                  tb.condition.includes(Condition.enum.Enemy_In_City) ||
                  tb.condition.includes(Condition.enum.Reduces_Enemy) ||
                  tb.condition.includes(
                    Condition.enum.Reduces_Enemy_in_Attack,
                  ) ||
                  tb.condition.includes(
                    Condition.enum.Reduces_Enemy_with_a_Dragon,
                  )
                ) {
                  if (DEBUG) {
                    console.log(
                      `PvPDeDefenseBuff: ${generalName}: ${buffName} detected Defense debuff`,
                    );
                  }
                  return DeDefenseBuffDetailCheck(tb, iv, am);
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
    },
  );
