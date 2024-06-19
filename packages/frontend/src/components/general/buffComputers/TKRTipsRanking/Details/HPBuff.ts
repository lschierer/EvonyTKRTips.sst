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

const DEBUGHP = false;

const PvPHPBuffClassCheck = z
  .function()
  .args(Buff, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (tb: BuffType, iv: BuffParamsType, am: AttributeMultipliersType) => {
      let score = 0;
      let multiplier = 0;
      if (tb !== null && tb !== undefined) {
        if (tb.value !== null && tb.value !== undefined) {
          if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
            if (tb.class !== null && tb.class !== undefined) {
              if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                multiplier = am?.Toughness.RangedHP ?? 0;
              } else if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                multiplier = am?.Toughness.GroundHP ?? 0;
              } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                multiplier = am?.Toughness.MountedHP ?? 0;
              } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                multiplier = am?.Toughness.SiegeHP ?? 0;
              } else {
                multiplier = 0;
              }
            } else {
              multiplier = am?.Toughness.AllTroopHP ?? 0;
            }
            const additional = tb.value.number * multiplier;
            if (DEBUGHP) {
              console.log(`adding ${additional} to ${score}`);
            }
            score += additional;
          }
        }
      }
      return score;
    },
  );

export const HPBuff = z
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
        if (DEBUGHP) {
          console.log(`PvPHPBuff: ${generalName}: ${buffName}`);
        }
        let score = 0;
        if (tb?.value === undefined || tb.value === null) {
          console.log(
            `how to score a buff with no value? gc is ${generalName}`,
          );
          return score;
        } else {
          if (DEBUGHP) {
            console.log(`PvPHPBuff: ${generalName}: ${buffName} has value`);
          }
          if (tb.attribute === undefined || tb.attribute === null) {
            if (DEBUGHP) {
              console.log(
                `PvPHPBuff: ${generalName}: ${buffName} has null attribute`,
              );
            }
            return score;
          } else if (Attribute.enum.HP.localeCompare(tb.attribute)) {
            if (DEBUGHP) {
              console.log(
                `PvPHPBuff: ${generalName}: ${buffName} is not an HP buff`,
              );
            }
            return score;
          } else {
            //check if buff has some conditions that never work for PvP
            if (tb.condition !== null && tb.condition !== undefined) {
              if (checkInvalidConditions(tb, iv, useCase, false)) {
                score = PvPHPBuffClassCheck(tb, iv, am);
              } else {
                //if I get here, there were invalid conditions
                return score;
              }
            } else {
              //if I get here, there were no conditions to check, but there is
              //an attack attribute.
              score = PvPHPBuffClassCheck(tb, iv, am);
            }
          }
        }
        return score;
      }
    },
  );