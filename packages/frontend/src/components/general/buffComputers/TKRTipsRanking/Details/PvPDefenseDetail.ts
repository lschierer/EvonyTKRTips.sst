const DEBUG = false;

import { z } from 'zod';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral.ts';
import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
} from '@schemas/baseSchemas.ts';
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

import { DefenseBuff } from './DefenseBuff';

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

      let BasicDefense = eg.defense + 45 * eg.defense_increment;
      if (DEBUG) {
        console.log(`BasicDefense step1: ${BasicDefense}`);
      }

      BasicDefense += 500;
      if (DEBUG) {
        console.log(`BasicDefense with cultivation: ${BasicDefense}`);
      }
      BasicDefense += AES_adjustment;
      if (DEBUG) {
        console.log(`BasicDefense with AES`);
      }
      if (BasicDefense < 900) {
        BasicDefense = BasicDefense * 0.1;
        if (DEBUG) {
          console.log(`BasicDefense less than 900, now ${BasicDefense}`);
        }
      } else {
        BasicDefense = 90 + (BasicDefense - 900) * 0.2;
        if (DEBUG) {
          console.log(`BasicDefense > 900, now ${BasicDefense}`);
        }
      }
      const multiplier = am.Toughness.AllTroopDefense;

      const BAS = Math.floor(BasicDefense * multiplier);
      if (DEBUG) {
        console.log(`returning BAS: ${BAS} for ${eg.name}`);
      }

      return BAS;
    },
  );

import { AscendingBuffs } from './AES_SingleScope.ts';
import { SpecialityBuffs } from './Speciality_SingleScope.ts';
import { SkillBookBuffs } from './SkillBook_SingleScore';
import { CovenantBuffs } from './Covenant_SingleScope';

export const PvPDefenseDetail = z
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

      const bas = Basic(eg, bp, am);
      const bss = SkillBookBuffs(eg, useCase, bp, am, DefenseBuff);
      const speciality = SpecialityBuffs(eg, useCase, bp, am, DefenseBuff);
      const covenant = CovenantBuffs(eg, useCase, bp, am, DefenseBuff);
      let aes = 0;
      if (Display.enum.secondary.localeCompare(display)) {
        aes = AscendingBuffs(eg, useCase, bp, am, DefenseBuff);
      }

      if (DEBUG) {
        console.log(
          `PvPDeHPDetail returning bas: ${bas} bss: ${bss} speciality: ${speciality} aes: ${aes} covenant: ${covenant} for ${eg.name} ${display}`,
        );
      }

      return bas + bss + speciality + aes + covenant;
    },
  );
