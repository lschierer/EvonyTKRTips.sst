const DEBUG = false;

import { type ExtendedGeneralType } from '../../../schemas/ExtendedGeneral.ts';
import { type generalUseCaseType } from '../../../schemas/generalsSchema';
import {
  type BuffParamsType,
  qualityColor,
  type qualityColorType,
} from '../../../schemas/baseSchemas.ts';
import { type AttributeMultipliersType } from '../../../schemas/EvAns.zod';
import type {
  SpecialityLevelType,
  SpecialityType,
} from '../../../schemas/specialitySchema.ts';
import { type BuffFunction } from '../../../RankingInterfaces';

const specialExists = (
  generalName: string,
  specialName: string,
  useCase: generalUseCaseType,
  bp: BuffParamsType,
  am: AttributeMultipliersType,
  BuffComp: BuffFunction,
  tsl?: SpecialityLevelType,
): number => {
  let returnable = 0;
  if (tsl !== undefined && tsl !== null) {
    returnable = tsl.buff.reduce((a2, sb) => {
      if (sb === null || sb === undefined) {
        return a2;
      } else {
        a2 += BuffComp(specialName, generalName, sb, bp, useCase, am);
      }
      return a2;
    }, 0);
  }

  return returnable;
};

export const SpecialityBuffs = (
  eg: ExtendedGeneralType,
  useCase: generalUseCaseType,
  bp: BuffParamsType,
  am: AttributeMultipliersType,
  BuffComp: BuffFunction,
) => {
  const specialChoices: qualityColorType[] = new Array<qualityColorType>();
  specialChoices.push(bp.special1, bp.special2, bp.special3, bp.special4);
  if (DEBUG) {
    console.log(
      `SpecialityBuffs for ${eg.name} ${useCase} start ${JSON.stringify(specialChoices)}`,
    );
  }
  let accumulator = 0;
  specialChoices.forEach((choice) => {
    let additional = 0;
    if (
      eg.specialities &&
      Array.isArray(eg.specialities) &&
      eg.specialities.length > 0
    ) {
      eg.specialities.forEach((special: SpecialityType) => {
        let thisSpecial: SpecialityLevelType | undefined;
        switch (choice) {
          case qualityColor.enum.Gold:
            thisSpecial = special.levels.find((sa) => {
              return !sa.level.localeCompare(qualityColor.enum.Gold);
            });
            additional = specialExists(
              eg.name,
              special.name,
              useCase,
              bp,
              am,
              BuffComp,
              thisSpecial,
            );
            if (DEBUG) {
              console.log(
                `${eg.name} ${useCase} ${special.name} gold additional ${additional}`,
              );
            }
            accumulator += additional;
          // eslint-disable-next-line no-fallthrough
          case qualityColor.enum.Orange:
            thisSpecial = special.levels.find((sa) => {
              return !sa.level.localeCompare(qualityColor.enum.Orange);
            });
            additional = specialExists(
              eg.name,
              special.name,
              useCase,
              bp,
              am,
              BuffComp,
              thisSpecial,
            );
            if (DEBUG) {
              console.log(
                `${eg.name} ${useCase} ${special.name} orange additional ${additional}`,
              );
            }
            accumulator += additional;
          // eslint-disable-next-line no-fallthrough
          case qualityColor.enum.Purple:
            thisSpecial = special.levels.find((sa) => {
              return !sa.level.localeCompare(qualityColor.enum.Purple);
            });
            additional = specialExists(
              eg.name,
              special.name,
              useCase,
              bp,
              am,
              BuffComp,
              thisSpecial,
            );
            if (DEBUG) {
              console.log(
                `${eg.name} ${useCase} ${special.name} purple additional ${additional}`,
              );
            }
            accumulator += additional;
          // eslint-disable-next-line no-fallthrough
          case qualityColor.enum.Blue:
            thisSpecial = special.levels.find((sa) => {
              return !sa.level.localeCompare(qualityColor.enum.Blue);
            });
            additional = specialExists(
              eg.name,
              special.name,
              useCase,
              bp,
              am,
              BuffComp,
              thisSpecial,
            );
            if (DEBUG) {
              console.log(
                `${eg.name} ${useCase} ${special.name} blue additional ${additional}`,
              );
            }
            accumulator += additional;
          // eslint-disable-next-line no-fallthrough
          case qualityColor.enum.Green:
            thisSpecial = special.levels.find((sa) => {
              return !sa.level.localeCompare(qualityColor.enum.Green);
            });
            additional = specialExists(
              eg.name,
              special.name,
              useCase,
              bp,
              am,
              BuffComp,
              thisSpecial,
            );
            if (DEBUG) {
              console.log(
                `${eg.name} ${useCase} ${special.name} green additional ${additional}`,
              );
            }
            accumulator += additional;
          // eslint-disable-next-line no-fallthrough
          case qualityColor.enum.Disabled:
            break;
        }
      });
    }
  });
  return Math.floor(accumulator);
};
