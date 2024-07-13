const DEBUG = false;

import { z } from 'zod';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '../../../schemas/ExtendedGeneral';
import {
  BuffParams,
  type BuffParamsType,
} from '../../../schemas/baseSchemas';
import {
  Display,
  type DisplayType,
  generalUseCase,
  type generalUseCaseType,
} from '../../../schemas/generalsSchema';
import {
  AttributeMultipliers,
  type AttributeMultipliersType,
} from '../../../schemas/EvAns.zod';

import { DebilitationBuff } from './DebilitationBuff';

import { AscendingBuffs } from './AES_SingleScope';
import { SpecialityBuffs } from './Speciality_SingleScope';
import { SkillBookBuffs } from './SkillBook_SingleScore';
import { CovenantBuffs } from './Covenant_SingleScope';

export const PvPDebilitationDetail = z
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
      const bss = SkillBookBuffs(eg, useCase, bp, am, DebilitationBuff);
      const speciality = SpecialityBuffs(eg, useCase, bp, am, DebilitationBuff);
      const covenant = CovenantBuffs(eg, useCase, bp, am, DebilitationBuff);
      let aes = 0;
      if (Display.enum.secondary.localeCompare(display)) {
        aes = AscendingBuffs(eg, useCase, bp, am, DebilitationBuff);
      }

      if (DEBUG) {
        console.log(
          `PvPDebilitationDetail returning bas: ${bas} bss: ${bss} speciality: ${speciality} aes: ${aes} covenant: ${covenant} for ${eg.name} ${display}`,
        );
      }

      return bas + bss + speciality + aes + covenant;
    },
  );