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
} from '../../../schemas/baseSchemas';

import {
  AttributeMultipliers,
  type AttributeMultipliersType,
} from '../../../schemas/EvAns.zod';
import { checkInvalidConditions } from '../checkConditions';
import {
  generalUseCase,
  type generalUseCaseType,
} from '../../../schemas/generalsSchema';

const DEBUGD = false;

const PvPDefenseBuffClassCheck = z
  .function()
  .args(Buff, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (tb: BuffType, _iv: BuffParamsType, am: AttributeMultipliersType) => {
      let score = 0;
      let multiplier = 0;
      if (tb !== null && tb !== undefined) {
        if (tb.value !== null && tb.value !== undefined) {
          if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
            if (tb.class !== null && tb.class !== undefined) {
              if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                multiplier = am?.Toughness.RangedDefense ?? 0;
              } else if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                multiplier = am?.Toughness.GroundDefense ?? 0;
              } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                multiplier = am?.Toughness.MountedDefense ?? 0;
              } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                multiplier = am?.Toughness.SiegeDefense ?? 0;
              } else {
                multiplier = 0;
              }
            } else {
              multiplier = am?.Toughness.AllTroopDefense ?? 0;
            }
            const additional = tb.value.number * multiplier;
            if (DEBUGD) {
              console.log(`adding ${additional} to ${score}`);
            }
            score += additional;
          }
        }
      }
      return score;
    },
  );

export const DefenseBuff = z
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
      if (tb === null || tb === undefined || iv === null || iv === undefined) {
        return -1000;
      } else {
        if (DEBUGD) {
          console.log(`PvPDefenseBuff: ${generalName}: ${buffName}`);
        }
        let score = 0;
        if (tb?.value === undefined || tb.value === null) {
          console.log(
            `how to score a buff with no value? gc is ${generalName}`,
          );
          return score;
        } else {
          if (DEBUGD) {
            console.log(
              `PvPDefenseBuff: ${generalName}: ${buffName} has value`,
            );
          }
          if (tb.attribute === undefined || tb.attribute === null) {
            if (DEBUGD) {
              console.log(
                `PvPDefenseBuff: ${generalName}: ${buffName} has null attribute`,
              );
            }
            return score;
          } else if (Attribute.enum.Defense.localeCompare(tb.attribute)) {
            if (DEBUGD) {
              console.log(
                `PvPDefenseBuff: ${generalName}: ${buffName} is not an Defense buff`,
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
                    Condition.enum.Reduces_Enemy_in_Attack,
                  ) ||
                  tb.condition.includes(
                    Condition.enum.Reduces_Enemy_with_a_Dragon,
                  )
                ) {
                  if (DEBUGD) {
                    console.log(
                      `PvPDefenseBuff: ${generalName}: ${buffName} detected debuff`,
                    );
                  }
                  return 0;
                } else {
                  //I think all other conditions that matter have been checked
                  score = PvPDefenseBuffClassCheck(tb, iv, am);
                }
              } else {
                //if I get here, there were invalid conditions
                return score;
              }
            } else {
              //if I get here, there were no conditions to check, but there is
              //an attack attribute.
              score = PvPDefenseBuffClassCheck(tb, iv, am);
            }
          }
        }
        return score;
      }
    },
  );
