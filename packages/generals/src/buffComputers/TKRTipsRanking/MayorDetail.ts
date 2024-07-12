const DEBUG = false;

import { z } from 'zod';
import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '../../schemas/ExtendedGeneral';
import { BuffParams, type BuffParamsType } from '../../schemas/baseSchemas';
import {
  generalSpecialists,
  type generalSpecialistsType,
  generalUseCase,
} from '../../schemas/generalsSchema';
import * as MayorAttributeMultipliers from '../../TKRAttributeRanking';

import { MayorAttackDetail } from './Details/MayorAttackDetail';
import { MayorDeHPDetail } from './Details/MayorDeHPDetail';
import { MayorHPDetail } from './Details/MayorHPDetail';
import { MayorDefenseDetail } from './Details/MayorDefenseDetail';
import { MayorDeDefenseDetail } from './Details/MayorDeDefenseDetail';
import { MayorDeAttackDetail } from './Details/MayorDeAttackDetail';

export const MayorBuffDetails = z.object({
  Attack: z.number(),
  DeAttack: z.number(),
  DeDefense: z.number(),
  DeHP: z.number(),
  Debilitation: z.number(),
  Defense: z.number(),
  HP: z.number(),
  MarchSize: z.number(),
  Preservation: z.number(),
  Range: z.number(),
});
export type MayorBuffDetails = z.infer<typeof MayorBuffDetails>;

export const MayorDetail = z
  .function()
  .args(ExtendedGeneral, BuffParams, generalSpecialists)
  .returns(MayorBuffDetails)

  .implement(
    (
      eg: ExtendedGeneralType,
      bp: BuffParamsType,
      specialize: generalSpecialistsType,
    ) => {
      //I intend to use specialize in the future
      if (DEBUG) {
        console.log(`MayorDetail start for ${eg.name} ${specialize}`);
      }
      const am = MayorAttributeMultipliers.MayorPvPAttackAttributeMultipliers;

      const useCase = generalUseCase.enum.Mayor; //I intend to use this in the future
      if(DEBUG) {
        console.log(`useCase is ${useCase}`)
      }
      const returnable = {
        Attack: 0,
        DeAttack: 0,
        DeDefense: 0,
        DeHP: 0,
        Debilitation: 0,
        Defense: 0,
        HP: 0,
        MarchSize: 0,
        Preservation: 0,
        Range: 0,
      };
      returnable.Attack = MayorAttackDetail(eg, bp, am);
      returnable.DeAttack = MayorDeAttackDetail(eg, bp, am);
      returnable.DeHP = MayorDeHPDetail(eg, bp, am);
      returnable.DeDefense = MayorDeDefenseDetail(eg, bp, am);
      returnable.HP = MayorHPDetail(eg, bp, am);
      returnable.Defense = MayorDefenseDetail(eg, bp, am);
      if (DEBUG) {
        console.log(
          `MayorDetail end for ${eg.name} ${JSON.stringify(returnable)}`,
        );
      }

      return returnable;
    },
  );
