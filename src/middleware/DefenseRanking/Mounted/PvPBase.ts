import { z } from "astro:content";

import {
  ActivationSituations,
  type ActivationSituationsType,
  AscendingLevels,
  Attribute,
  Buff,
  type BuffType,
  BuffParams,
  type BuffParamsType,
  ClassEnum,
  type ClassEnumType,
  Condition,
  type ConditionType,
  type levelsType,
  qualityColor,
  type qualityColorType,
  syslogSeverity,
  UnitSchema,
} from "@schemas/baseSchemas";

import {
  ConflictArray, 
  ConflictDatum,   
  type bookConflictsType,
  type ConflictDatumType,
 } from '@schemas/conflictSchemas'

 import {
  Note,
  Display,
  type DisplayType,
  type NoteType,
  GeneralArray,
  type GeneralClassType,
  GeneralElement,
  type GeneralArrayType,
  type GeneralElementType,
  generalSpecialists,
  type generalUseCaseType,
 } from '@schemas/generalsSchema'

 import {
  Speciality,
  type SpecialityType,
 } from '@schemas/specialitySchema'

 import { 
  ExtendedGeneral,
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type GeneralPairType,
  } from "@schemas/ExtendedGeneral";

import { 
  type BookType,
  specialSkillBook,
  standardSkillBook,
  type specialSkillBookType,
  type standardSkillBookType,
 } from "@schemas/bookSchemas";

import { MountedPvPAttackAttributeMultipliers } from "@lib/EvAnsAttributeRanking";
import { PvPBSS } from "./PvPBSS";
import { PvPAES } from "./PvPAES";
import { PvP34SS } from "./PvP34SS";

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
 
    const attackMultiplier = MountedPvPAttackAttributeMultipliers?.Offensive.AllTroopAttack ?? 1;
    const defenseMultiplier = MountedPvPAttackAttributeMultipliers?.Toughness.AllTroopDefense ?? 1;
    const HPMultipler = MountedPvPAttackAttributeMultipliers?.Toughness.AllTroopHP ?? 1;
    const PoliticsMultipler = MountedPvPAttackAttributeMultipliers?.Preservation.Death2Wounded ?? 1;

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

  export const MountedPvPDefense = z
  .function()
  .args(ExtendedGeneral, Display, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, display: DisplayType, bp: BuffParamsType) => {
    if (DEBUG) {
      console.log(`${eg.general.name}: GroundPvPAttack starting`);
    }

    const BAS = Basic(eg);
    const BSS = PvPBSS(eg, bp);
    const AES = PvPAES(eg, bp);
    const specialities = PvP34SS(eg, bp);

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
    return TLGS ?? -11;
  });