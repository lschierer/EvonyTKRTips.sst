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

import { PreservationBuff } from './PreservationBuff';

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

      let BasicPreservation = eg.politics + 45 * eg.politics_increment;
      if (DEBUG) {
        console.log(`BasicPreservation step1: ${BasicPreservation}`);
      }

      BasicPreservation += 500;
      if (DEBUG) {
        console.log(`BasicPreservation with cultivation: ${BasicPreservation}`);
      }
      BasicPreservation += AES_adjustment;
      if (DEBUG) {
        console.log(`BasicPreservation with AES`);
      }
      if (BasicPreservation < 900) {
        BasicPreservation = BasicPreservation * 0.1;
        if (DEBUG) {
          console.log(
            `BasicPreservation less than 900, now ${BasicPreservation}`,
          );
        }
      } else {
        BasicPreservation = 90 + (BasicPreservation - 900) * 0.2;
        if (DEBUG) {
          console.log(`BasicPreservation > 900, now ${BasicPreservation}`);
        }
      }
      const multiplier = am.Preservation.Death2Wounded;

      const BAS = Math.floor(BasicPreservation * multiplier);
      if (DEBUG) {
        console.log(`returning BAS: ${BAS} for ${eg.name}`);
      }

      return BAS;
    },
  );

import { AscendingBuffs } from './AES_SingleScope';
import { SpecialityBuffs } from './Speciality_SingleScope';
import { SkillBookBuffs } from './SkillBook_SingleScore';
import { CovenantBuffs } from './Covenant_SingleScope';

export const PvPPreservationDetail = z
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
      const bas = Basic(eg, bp, am);
      const bss = SkillBookBuffs(eg, useCase, bp, am, PreservationBuff);
      const speciality = SpecialityBuffs(eg, useCase, bp, am, PreservationBuff);
      const covenant = CovenantBuffs(eg, useCase, bp, am, PreservationBuff);
      let aes = 0;
      if (display.localeCompare(Display.enum.secondary)) {
        aes = AscendingBuffs(eg, useCase, bp, am, PreservationBuff);
      }

      if (DEBUG) {
        console.log(
          `returning bas: ${bas} bss: ${bss} speciality: ${speciality} aes: ${aes} covenant: ${covenant} for ${eg.name} ${display}`,
        );
      }

      return bas + bss + speciality + aes + covenant;
    },
  );
