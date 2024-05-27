const DEBUG = false;
const DEBUG_BAS = false;

import { z } from "astro:content";


import {
  AscendingLevels,
  BuffParams,
  Display,
  ExtendedGeneral,
  type BuffParamsType,
  type DisplayType,
  type ExtendedGeneralType,
} from '@schemas/index'

import { SiegePvPAttackAttributeMultipliers } from "@lib/EvAnsAttributeRanking";
import { AttackPvPBSS } from "./AttackPvPBSS";
import { AttackPvPAES } from "./AttackPvPAES";
import { AttackPvP34SS } from "./AttackPvP34SS";

const EvAnsBasic = z
  .function()
  .args(ExtendedGeneral)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType) => {
    const gc = eg.general;
    let AES_adjustment = 0;
    switch(eg.general.stars) {
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
        console.log(`this should not happen!!!`)
    }
    const BasicAttack =
      (500 +AES_adjustment + gc.attack + 45 * gc.attack_increment) < 900
        ? (500 +AES_adjustment + gc.attack + 45 * gc.attack_increment) * 0.1
        : 90 + (500 +AES_adjustment + gc.attack + 45 * gc.attack_increment - 900) * 0.2;
    const BasicDefense =
      (500 +AES_adjustment + gc.defense + 45 * gc.defense_increment) < 900
        ? (500 +AES_adjustment + gc.defense + 45 * gc.defense_increment) * 0.1
        : 90 + (500 +AES_adjustment + gc.defense + 45 * gc.defense_increment - 900) * 0.2;
    const BasicLeaderShip =
      (500 +AES_adjustment + gc.leadership + 45 * gc.leadership_increment) < 900
        ? (500 +AES_adjustment + gc.leadership + 45 * gc.leadership_increment) * 0.1
        : 90 + (500 +AES_adjustment + gc.leadership + 45 * gc.leadership_increment - 900) * 0.2;
    const BasicPolitics =
      (500 +AES_adjustment + gc.politics + 45 * gc.politics_increment) < 900
        ? (500 +AES_adjustment + gc.politics + 45 * gc.politics_increment) * 0.1
        : 90 + (500 +AES_adjustment + gc.politics + 45 * gc.politics_increment - 900) * 0.2;
 
    const attackMultiplier = SiegePvPAttackAttributeMultipliers?.Offensive.AllTroopAttack ?? 1;
    const defenseMultiplier = SiegePvPAttackAttributeMultipliers?.Toughness.AllTroopDefense ?? 1;
    const HPMultipler = SiegePvPAttackAttributeMultipliers?.Toughness.AllTroopHP ?? 1;
    const PoliticsMultipler = SiegePvPAttackAttributeMultipliers?.Preservation.Death2Wounded ?? 1;

    const BAS = BasicAttack * attackMultiplier +
      BasicDefense * defenseMultiplier +
      BasicLeaderShip * HPMultipler +
      BasicPolitics * PoliticsMultipler;

    if (DEBUG_BAS) {
      console.log(`BasicAttack: ${BasicAttack} for ${eg.general.name}`);
      console.log(`BasicDefense: ${BasicDefense} for ${eg.general.name}`);
      console.log(`BasicLeaderShip: ${BasicLeaderShip} for ${eg.general.name}`);
      console.log(`BasicPolitics: ${BasicPolitics} for ${eg.general.name}`);
      console.log(`BAS: ${BAS} for: ${eg.general.name}`);
    }
    return Math.floor(BAS);
  });

export const EvAnsSiegePvPAttack = z
  .function()
  .args(ExtendedGeneral, Display, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, display: DisplayType, bp: BuffParamsType) => {
    if (DEBUG) {
      console.log(`${eg.general.name}: EvAnsGroundPvPAttack starting`);
    }

    const BAS = EvAnsBasic(eg);
    const BSS = AttackPvPBSS(eg, bp);
    const AES = AttackPvPAES(eg, bp);
    const specialities = AttackPvP34SS(eg, bp);

    let TLGS = BSS + specialities ;
    if(DEBUG) {
      console.log(`TLGS with BSS and specialities`)
      console.log(`${eg.general.name}: ${TLGS}`)
    }
    if(display.localeCompare(Display.enum.assistant)) {
      TLGS += BAS 
      if(DEBUG) {
        console.log(`TLGS with BAS`)
        console.log(`${eg.general.name}: ${TLGS}`)
      }
      TLGS += AES;
      if(DEBUG) {
        console.log(`TLGS with AES`)
        console.log(`${eg.general.name}: ${TLGS}`)
      }
    }
    if (DEBUG) {
      console.log(
        `for ${eg.general.name} BAS: ${BAS} BSS: ${BSS} AES: ${AES} specialities: ${specialities} TLGS: ${TLGS}`
      );
    }
    return TLGS ;
  });