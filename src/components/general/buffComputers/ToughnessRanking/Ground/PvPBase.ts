import { z } from 'zod';

import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
} from '@schemas/baseSchemas';

import { Display, type DisplayType } from '@schemas/generalsSchema';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import { GroundPvPAttackAttributeMultipliers } from '@lib/EvAnsAttributeRanking';
import { PvPBSS } from './PvPBSS';
import { PvPAES } from './PvPAES';
import { PvP34SS } from './PvP34SS';

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

export const DEBUG = false;

const DEBUG_BAS = false;

const Basic = z
  .function()
  .args(ExtendedGeneral)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType) => {

    let AES_adjustment = 0;
    switch (eg.stars) {
      case AscendingLevels.enum[0]:
        break;
      case AscendingLevels.enum[6]:
        AES_adjustment = 10;
        break;
      case AscendingLevels.enum[7]:
        AES_adjustment = 20;
        break;
      case AscendingLevels.enum[8]:
        AES_adjustment = 30;
        break;
      case AscendingLevels.enum[9]:
        AES_adjustment = 40;
        break;
      case AscendingLevels.enum[10]:
        AES_adjustment = 50;
        break;
      default:
        console.log(`this should not happen!!!`);
    }
    const BasicAttack =
      500 + AES_adjustment + eg.attack + 45 * eg.attack_increment < 900
        ? (500 + AES_adjustment + eg.attack + 45 * eg.attack_increment) * 0.1
        : 90 +
          (500 + AES_adjustment + eg.attack + 45 * eg.attack_increment - 900) *
            0.2;
    const BasicDefense =
      500 + AES_adjustment + eg.defense + 45 * eg.defense_increment < 900
        ? (500 + AES_adjustment + eg.defense + 45 * eg.defense_increment) * 0.1
        : 90 +
          (500 +
            AES_adjustment +
            eg.defense +
            45 * eg.defense_increment -
            900) *
            0.2;
    const BasicLeaderShip =
      500 + AES_adjustment + eg.leadership + 45 * eg.leadership_increment < 900
        ? (500 +
            AES_adjustment +
            eg.leadership +
            45 * eg.leadership_increment) *
          0.1
        : 90 +
          (500 +
            AES_adjustment +
            eg.leadership +
            45 * eg.leadership_increment -
            900) *
            0.2;
    const BasicPolitics =
      500 + AES_adjustment + eg.politics + 45 * eg.politics_increment < 900
        ? (500 + AES_adjustment + eg.politics + 45 * eg.politics_increment) *
          0.1
        : 90 +
          (500 +
            AES_adjustment +
            eg.politics +
            45 * eg.politics_increment -
            900) *
            0.2;

    const attackMultiplier =
      GroundPvPAttackAttributeMultipliers?.Offensive.AllTroopAttack ?? 1;
    const defenseMultiplier =
      GroundPvPAttackAttributeMultipliers?.Toughness.AllTroopDefense ?? 1;
    const HPMultipler =
      GroundPvPAttackAttributeMultipliers?.Toughness.AllTroopHP ?? 1;
    const PoliticsMultipler =
      GroundPvPAttackAttributeMultipliers?.Preservation.Death2Wounded ?? 1;

    const BAS =
      BasicAttack * attackMultiplier +
      BasicDefense * defenseMultiplier +
      BasicLeaderShip * HPMultipler +
      BasicPolitics * PoliticsMultipler;

    if (DEBUG_BAS) {
      console.log(`BasicAttack: ${BasicAttack} for ${eg.name}`);
      console.log(`BasicDefense: ${BasicDefense} for ${eg.name}`);
      console.log(`BasicLeaderShip: ${BasicLeaderShip} for ${eg.name}`);
      console.log(`BasicPolitics: ${BasicPolitics} for ${eg.name}`);
      console.log(`BAS: ${BAS} for: ${eg.name}`);
    }
    return Math.floor(BAS);
  });

export const GroundPvPDefense = z
  .function()
  .args(ExtendedGeneral, Display, BuffParams)
  .returns(z.number())
  .implement(
    (eg: ExtendedGeneralType, display: DisplayType, bp: BuffParamsType) => {
      if (DEBUG) {
        console.log(`${eg.name}: GroundPvPAttack starting`);
      }

      const BAS = Basic(eg);
      const BSS = PvPBSS(eg, bp);
      const AES = PvPAES(eg, bp);
      const specialities = PvP34SS(eg, bp);

      let TLGS = BSS + specialities;
      if (DEBUG) {
        console.log(`TLGS with BSS and specialities`);
        console.log(`${eg.name}: ${TLGS}`);
      }
      if (display.localeCompare(Display.enum.secondary)) {
        TLGS += BAS;
        if (DEBUG) {
          console.log(`TLGS with BAS`);
          console.log(`${eg.name}: ${TLGS}`);
        }
        TLGS += AES;
        if (DEBUG) {
          console.log(`TLGS with AES`);
          console.log(`${eg.name}: ${TLGS}`);
        }
      }
      if (DEBUG) {
        console.log(
          `for ${eg.name} BAS: ${BAS} BSS: ${BSS} AES: ${AES} specialities: ${specialities} TLGS: ${TLGS}`
        );
      }
      return TLGS ?? -11;
    }
  );
