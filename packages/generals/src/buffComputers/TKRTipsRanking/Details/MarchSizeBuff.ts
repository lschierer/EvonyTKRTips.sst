const DEBUG = false;
import { z } from 'zod';

import {
  Attribute,
  Buff,
  type BuffType,
  BuffParams,
  type BuffParamsType,
  ClassEnum,
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

const PvPMarchSizeBuffClassCheck = z
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
                multiplier = am?.Offensive.MarchSizeIncrease ?? 0;
              } else if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                multiplier = am?.Offensive.MarchSizeIncrease ?? 0;
              } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                multiplier = am?.Offensive.MarchSizeIncrease ?? 0;
              } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                multiplier = am?.Offensive.MarchSizeIncrease ?? 0;
              } else {
                //honestly only this one should ever be hit.  I can't think
                //of a case where a general would have a class specific march
                //increase.
                multiplier = am?.Offensive.MarchSizeIncrease ?? 0;
              }
            } else {
              multiplier = am?.Offensive.MarchSizeIncrease ?? 0;
            }
            const additional = tb.value.number * multiplier;
            if (DEBUG) {
              console.log(`adding ${additional} to ${score}`);
            }
            score += additional;
          }
        }
      }
      return score;
    },
  );

export const MarchSizeBuff = z
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
        if (DEBUG) {
          console.log(`PvPMarchSizeBuff: ${generalName}: ${buffName}`);
        }
        let score = 0;
        if (tb?.value === undefined || tb.value === null) {
          console.log(
            `how to score a buff with no value? gc is ${generalName}`,
          );
          return score;
        } else {
          if (DEBUG) {
            console.log(
              `PvPMarchSizeBuff: ${generalName}: ${buffName} has value`,
            );
          }
          if (tb.attribute === undefined || tb.attribute === null) {
            if (DEBUG) {
              console.log(
                `PvPMarchSizeBuff: ${generalName}: ${buffName} has null attribute`,
              );
            }
            return score;
          } else if (
            Attribute.enum.March_Size_Capacity.localeCompare(tb.attribute)
          ) {
            if (DEBUG) {
              console.log(
                `PvPMarchSizeBuff: ${generalName}: ${buffName} ${tb.attribute} is not an March Size buff`,
              );
            }
            return score;
          } else {
            if (DEBUG) {
              console.log(
                `PvPMarchSizeBuff: ${generalName}: ${buffName} ${tb.attribute} IS a March Size buff`,
              );
            }
            //check if buff has some conditions that never work for PvP
            if (tb.condition !== null && tb.condition !== undefined) {
              if (checkInvalidConditions(tb, iv, useCase, false)) {
                score = PvPMarchSizeBuffClassCheck(tb, iv, am);
              } else {
                if (DEBUG) {
                  console.log(
                    `detected invalid conditions for ${useCase} ${generalName}`,
                  );
                }
                //if I get here, there were invalid conditions
                return score;
              }
            } else {
              //if I get here, there were no conditions to check, but there is
              //an MarchSize attribute.
              if (DEBUG) {
                console.log(
                  `calling PvPMarchSizeBuffClassCheck with no conditions`,
                );
              }
              score = PvPMarchSizeBuffClassCheck(tb, iv, am);
            }
          }
        }
        return score;
      }
    },
  );
