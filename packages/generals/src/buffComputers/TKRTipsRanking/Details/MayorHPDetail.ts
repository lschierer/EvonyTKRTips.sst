const DEBUG = false;

import { z } from 'zod';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '../../../schemas/ExtendedGeneral';
import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
} from '../../../schemas/baseSchemas';
import { generalUseCase } from '../../../schemas/generalsSchema';
import {
  AttributeMultipliers,
  type AttributeMultipliersType,
} from '../../../schemas/EvAns.zod';

import { HPBuff } from './HPBuff';

const Basic = z
  .function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (
      eg: ExtendedGeneralType,
      bp: BuffParamsType,
      am: AttributeMultipliersType,
    ) => {
      let AES_adjustment = 0;
      switch (bp.stars) {
        case AscendingLevels.enum['0stars']:
          break;
        case AscendingLevels.enum['1red']:
          AES_adjustment = 10;
          break;
        case AscendingLevels.enum['2red']:
          AES_adjustment = 20;
          break;
        case AscendingLevels.enum['3red']:
          AES_adjustment = 30;
          break;
        case AscendingLevels.enum['4red']:
          AES_adjustment = 40;
          break;
        case AscendingLevels.enum['5red']:
          AES_adjustment = 50;
          break;
        default:
          console.log(`this should not happen!!!`);
      }

      let BasicHP = eg.leadership + 45 * eg.leadership_increment;
      if (DEBUG) {
        console.log(`BasicHP step1: ${BasicHP}`);
      }

      BasicHP += 500;
      if (DEBUG) {
        console.log(`BasicHP with cultivation: ${BasicHP}`);
      }
      BasicHP += AES_adjustment;
      if (DEBUG) {
        console.log(`BasicHP with AES`);
      }
      if (BasicHP < 900) {
        BasicHP = BasicHP * 0.1;
        if (DEBUG) {
          console.log(`BasicHP less than 900, now ${BasicHP}`);
        }
      } else {
        BasicHP = 90 + (BasicHP - 900) * 0.2;
        if (DEBUG) {
          console.log(`BasicHP > 900, now ${BasicHP}`);
        }
      }
      const multiplier = am.Toughness.AllTroopHP;

      const BAS = Math.floor(BasicHP * multiplier);
      if (DEBUG) {
        console.log(`returning BAS: ${BAS} for ${eg.name}`);
      }

      return BAS;
    },
  );

import { AscendingBuffs } from './AES_SingleScope';
import { SpecialityBuffs } from './Speciality_SingleScope';
import { SkillBookBuffs } from './SkillBook_SingleScore';

export const MayorHPDetail = z
  .function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (
      eg: ExtendedGeneralType,
      bp: BuffParamsType,
      am: AttributeMultipliersType,
    ) => {
      const bas = Basic(eg, bp, am);
      const bss = SkillBookBuffs(eg, generalUseCase.enum.Mayor, bp, am, HPBuff);
      const speciality = SpecialityBuffs(
        eg,
        generalUseCase.enum.Mayor,
        bp,
        am,
        HPBuff,
      );
      const aes = AscendingBuffs(eg, generalUseCase.enum.Mayor, bp, am, HPBuff);

      return bas + bss + speciality + aes;
    },
  );
