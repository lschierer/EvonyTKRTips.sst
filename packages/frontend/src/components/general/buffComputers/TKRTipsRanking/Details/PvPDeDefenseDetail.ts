const DEBUG = false;

import { z } from 'zod';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral.ts';
import { BuffParams, type BuffParamsType } from '@schemas/baseSchemas.ts';
import {
  Display,
  type DisplayType,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema.ts';
import {
  AttributeMultipliers,
  type AttributeMultipliersType,
} from '@schemas/EvAns.zod.ts';

import { DeDefenseBuff } from './DeDefense';

import { AscendingBuffs } from './AES_SingleScope.ts';
import { SpecialityBuffs } from './Speciality_SingleScope.ts';
import { SkillBookBuffs } from './SkillBook_SingleScore';
import { CovenantBuffs } from './Covenant_SingleScope';

export const PvPDeDefenseDetail = z
  .function()
  .args(
    ExtendedGeneral,
    BuffParams,
    AttributeMultipliers,
    generalUseCase,
    Display,
  )
  .returns(z.number())
  .implement(
    (
      eg: ExtendedGeneralType,
      bp: BuffParamsType,
      am: AttributeMultipliersType,
      useCase: generalUseCaseType,
      display: DisplayType,
    ) => {
      if (DEBUG) {
        console.log(`MayorDeHPDetail ${eg.name}`);
      }

      const bas = 0; //DeHP has no basic attribute score;
      const bss = SkillBookBuffs(eg, useCase, bp, am, DeDefenseBuff);
      const speciality = SpecialityBuffs(eg, useCase, bp, am, DeDefenseBuff);
      const covenant = CovenantBuffs(eg, useCase, bp, am, DeDefenseBuff);
      let aes = 0;
      if (Display.enum.secondary.localeCompare(display)) {
        aes = AscendingBuffs(eg, useCase, bp, am, DeDefenseBuff);
      }

      if (DEBUG) {
        console.log(
          `PvPDeDefenseDetail returning bas: ${bas} bss: ${bss} speciality: ${speciality} aes: ${aes} covenant: ${covenant} for ${eg.name} ${display}`,
        );
      }

      return bas + bss + speciality + aes + covenant;
    },
  );
