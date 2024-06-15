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

import { AscendingBuffs } from './AES_SingleScope.ts';
import { SpecialityBuffs } from './Speciality_SingleScope.ts';
import { SkillBookBuffs } from './SkillBook_SingleScore';

export const PvPDeHPDetail = z.function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType, am: AttributeMultipliersType) => {
    if(DEBUG) { console.log(`MayorDeHPDetail ${eg.name}`)}

    const bas = 0; //DeHP has no basic attribute score;
    const bss =  SkillBookBuffs(eg, generalUseCase.enum.Mayor, bp, am, DeHPBuff);
    const speciality = SpecialityBuffs(eg, generalUseCase.enum.Mayor, bp, am, DeHPBuff);
    const aes = AscendingBuffs(eg, generalUseCase.enum.Mayor, bp, am, DeHPBuff);

    return bas + bss + speciality + aes;
  })