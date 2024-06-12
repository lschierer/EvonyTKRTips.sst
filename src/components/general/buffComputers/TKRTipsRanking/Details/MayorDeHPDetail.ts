import { AttackBuff } from '@components/general/buffComputers/TKRTipsRanking/Details/AttackBuff.ts';

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