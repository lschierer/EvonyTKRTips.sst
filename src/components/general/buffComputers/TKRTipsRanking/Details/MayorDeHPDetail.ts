const DEBUG = false;

import { z } from 'zod';


import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import {
  BuffParams,
  type BuffParamsType,
} from '@schemas/baseSchemas.ts';
import {
  generalUseCase,
} from '@schemas/generalsSchema.ts';
import {AttributeMultipliers, type AttributeMultipliersType} from '@schemas/EvAns.zod.ts';

import { DeHPBuff } from './DeHPBuff';

import { SpecialityBuffs } from './Speciality_SingleScope.ts';
import { SkillBookBuffs } from './SkillBook_SingleScore';

export const MayorDeHPDetail = z.function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType, am: AttributeMultipliersType) => {

    const bas = 0; //DeHP has no basic attribute score;
    const bss =  SkillBookBuffs(eg, generalUseCase.enum.Mayor, bp, am, DeHPBuff);
    const speciality = SpecialityBuffs(eg, generalUseCase.enum.Mayor, bp, am, DeHPBuff);

    return bas + bss + speciality;
  })