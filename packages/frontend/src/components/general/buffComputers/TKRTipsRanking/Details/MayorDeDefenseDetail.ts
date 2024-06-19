const DEBUG = false;

import { z } from 'zod';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral.ts';
import { BuffParams, type BuffParamsType } from '@schemas/baseSchemas.ts';
import { generalUseCase } from '@schemas/generalsSchema.ts';
import {
  AttributeMultipliers,
  type AttributeMultipliersType,
} from '@schemas/EvAns.zod.ts';

import { DeDefenseBuff } from './DeDefense';

import { AscendingBuffs } from './AES_SingleScope.ts';
import { SpecialityBuffs } from './Speciality_SingleScope.ts';
import { SkillBookBuffs } from './SkillBook_SingleScore';

export const MayorDeDefenseDetail = z
  .function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (
      eg: ExtendedGeneralType,
      bp: BuffParamsType,
      am: AttributeMultipliersType,
    ) => {
      const bas = 0; //DeDefense has no Basic Attribute Score.
      const bss = SkillBookBuffs(
        eg,
        generalUseCase.enum.Mayor,
        bp,
        am,
        DeDefenseBuff,
      );
      const speciality = SpecialityBuffs(
        eg,
        generalUseCase.enum.Mayor,
        bp,
        am,
        DeDefenseBuff,
      );
      const aes = AscendingBuffs(
        eg,
        generalUseCase.enum.Mayor,
        bp,
        am,
        DeDefenseBuff,
      );

      if (DEBUG) {
        console.log(
          `MayorDeDefenseDetail: ${eg.name}: bas: ${bas}, bss: ${bss}, speciality: ${speciality} aes: ${aes}`,
        );
      }

      return bas + bss + speciality + aes;
    },
  );
