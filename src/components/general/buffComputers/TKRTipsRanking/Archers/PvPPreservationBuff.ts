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

import { checkInvalidConditions } from '@components/general/buffComputers/AttackRanking/AttackScoreComputer';

import {
  RangedPvPAttackAttributeMultipliers
} from '@lib/EvAnsAttributeRanking';

const DEBUGP = false;

const PvPPreservationBuffDetailCheck = z
  .function()
  .args(Buff, BuffParams)
  .returns(z.number())
  .implement((tb: BuffType, iv: BuffParamsType) => {
    let score = 0;
    let multiplier = 0;
    if (tb !== null && tb !== undefined) {
      if (tb.value !== null && tb.value !== undefined) {
        if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
          if (tb.class !== null && tb.class !== undefined) {
            //I have never actually seen a class condition on this buff, but this is how I think it would get scored by EvAns.
            if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
              if (tb.condition!.includes(Condition.enum.Attacking)) {
                multiplier =
                  RangedPvPAttackAttributeMultipliers.Preservation
                    .Death2WoundedWhenAttacking;
              } else {
                multiplier =
                  RangedPvPAttackAttributeMultipliers.Preservation
                    .Death2Wounded;
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
            if (tb.condition && tb.condition.includes(Condition.enum.Attacking)) {
              multiplier =
                RangedPvPAttackAttributeMultipliers.Preservation.Death2WoundedWhenAttacking;
            } else {
              multiplier =
                RangedPvPAttackAttributeMultipliers.Preservation.Death2Wounded;
            }
          }
          const additional = tb.value.number * multiplier;
          if (DEBUGP) {
            console.log(`adding ${additional} to ${score}`);
          }
          score += additional;
        }
      }
    }
    return score;
  });

export const PvPPreservationBuff = z
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
      let multiplier = 0;
      if (tb === null || tb === undefined || iv === null || iv === undefined) {
        return -1000;
      } else {
        if (DEBUGP) {
          console.log(`PvPHPBuff: ${generalName}: ${buffName}`);
        }
        let score = 0;
        if (tb?.value === undefined || tb.value === null) {
          console.log(
            `how to score a buff with no value? gc is ${generalName}`
          );
          return score;
        } else {
          if (DEBUGP) {
            console.log(`PvPHPBuff: ${generalName}: ${buffName} has value`);
          }
          if (tb.attribute === undefined || tb.attribute === null) {
            if (DEBUGP) {
              console.log(
                `PvPHPBuff: ${generalName}: ${buffName} has null attribute`
              );
            }
            return score;
          } else if (
            Attribute.enum.Death_to_Wounded.localeCompare(tb.attribute) &&
            Attribute.enum.Death_to_Soul.localeCompare(tb.attribute)
          ) {
            //as best I can tell, these are effectively the same thing.
            //EvAns scores them slightly differently, *unless* you tack
            //on the "when attacking" condition to the "to wounded" buff
            //in which case he does treat it the same as the "to souls."
            //I don't completely get these buffs.  As best I can tell
            // during SvS or Battlefield they are both effectively the same
            //and both effectively useless.
            if (DEBUGP) {
              console.log(
                `PvPHPBuff: ${generalName}: ${buffName} is not a Preservation buff`
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
                  if (DEBUGP) {
                    console.log(
                      `PvPHPBuff: ${generalName}: ${buffName} detected debuff`
                    );
                  }
                  return 0;
                } else {
                  //I think all other conditions that matter have been checked
                  score = PvPPreservationBuffDetailCheck(tb, iv);
                }
              } else {
                //if I get here, there were invalid conditions
                return score;
              }
            } else {
              //if I get here, there were no conditions to check, but there is
              //an attack attribute.
              score = PvPPreservationBuffDetailCheck(tb, iv);
            }
          }
        }
        return score;
      }
    }
  );
