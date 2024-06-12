const DEBUG = true;

import { z } from 'zod';
import type { SpecialityType } from '@schemas/specialitySchema.ts';

import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
  qualityColor,
  type qualityColorType,
} from '@schemas/baseSchemas.ts';
import {
  generalSpecialists,
  type generalSpecialistsType,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema.ts';
import {AttributeMultipliers, type AttributeMultipliersType} from '@schemas/EvAns.zod.ts';
import * as MayorAttributeMultipliers from '@lib/TKRAttributeRanking.ts';

import { DeDefenseBuff } from './DeDefense';

import { SpecialityBuffs } from './Speciality_SingleScope.ts';
import { SkillBookBuffs } from './SkillBook_SingleScore';

export const MayorDeDefenseDetail = z.function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType, am: AttributeMultipliersType) => {

    const bas = 0; //DeDefense has no Basic Attribute Score.
    const bss =  SkillBookBuffs(eg, generalUseCase.enum.Mayor, bp, am, DeDefenseBuff);
    const speciality = SpecialityBuffs(eg, generalUseCase.enum.Mayor, bp, am, DeDefenseBuff);

    if(DEBUG) {
      console.log(`${eg.name}: bas: ${bas}, bss: ${bss}, speciality: ${speciality}`);
    }

    return bas + bss + speciality;
  })