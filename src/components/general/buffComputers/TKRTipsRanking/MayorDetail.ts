const DEBUG = true;

import {z} from 'zod';
import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import { BuffParams, type BuffParamsType } from '@schemas/baseSchemas.ts';
import { generalSpecialists, type generalSpecialistsType, generalUseCase } from '@schemas/generalsSchema.ts';
import * as MayorAttributeMultipliers from '@lib/TKRAttributeRanking.ts';

import { MayorAttackDetail } from './Details/MayorAttackDetail';
import { MayorDeHPDetail } from './Details/MayorDeHPDetail';
import { MayorDeDefenseDetail } from './Details/MayorDeDefenseDetail';

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
})
export type MayorBuffDetails = z.infer<typeof MayorBuffDetails>;

export const MayorDetail = z.function()
  .args(ExtendedGeneral, BuffParams, generalSpecialists)
  .returns(MayorBuffDetails)
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType, specialize: generalSpecialistsType) =>{
    const am = MayorAttributeMultipliers.MayorPvPAttackAttributeMultipliers;
    const useCase = generalUseCase.enum.Mayor;
    let returnable =  {
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
    }
    returnable.Attack = MayorAttackDetail(eg, bp, am);
    returnable.DeHP = MayorDeHPDetail(eg, bp, am);
    returnable.DeDefense = MayorDeDefenseDetail(eg, bp, am);
    return returnable;
  })
