const DEBUG = false;

import { z } from 'zod';

import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import {
  BuffParams,
  type BuffParamsType,
} from '@schemas/baseSchemas.ts';
import {
  Display, type DisplayType,
  generalUseCase, type generalUseCaseType,
} from '@schemas/generalsSchema.ts';
import {AttributeMultipliers, type AttributeMultipliersType} from '@schemas/EvAns.zod.ts';

import { RangeBuff } from './RangeBuff'



import { AscendingBuffs } from './AES_SingleScope.ts';
import { SpecialityBuffs } from './Speciality_SingleScope.ts';
import { SkillBookBuffs } from './SkillBook_SingleScore';

export const PvPRangeDetail = z.function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers, generalUseCase, Display)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType, am: AttributeMultipliersType, useCase: generalUseCaseType, display: DisplayType) => {

    const bas = 0; // Range has no Basic Attribute Score.
    const bss =  SkillBookBuffs(eg, useCase, bp, am, RangeBuff);
    const speciality = SpecialityBuffs(eg, useCase, bp, am, RangeBuff);
    let  aes = 0;
    if(display.localeCompare(Display.enum.secondary)) {
      aes = AscendingBuffs(eg, useCase, bp, am, RangeBuff);
    }

    if(DEBUG){
      console.log(`returning bas: ${bas} bss: ${bss} speciality: ${speciality} aes: ${aes} for ${eg.name} ${display}`)
    }
    return bas + bss + speciality + aes;
  })