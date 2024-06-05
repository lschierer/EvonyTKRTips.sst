const DEBUG = false;
const DEBUG_BAS = false;

import { z } from 'zod';

import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
} from '@schemas/baseSchemas';

import {AttributeMultipliers, type AttributeMultipliersType} from '@schemas/EvAns.zod';

import { Display, type DisplayType } from '@schemas/generalsSchema';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import { RangedPvPAttackAttributeMultipliers } from '@lib/EvAnsAttributeRanking';
import { PvPBSS } from '../PvPBSS.ts';
import { PvPAES } from '../PvPAES.ts';
import { PvP34SS } from '../PvP34SS.ts';

import { AttackBuff } from './AttackBuff.ts';
import { PvPMarchSizeBuff } from './PvPMarchSizeBuff';
import { PvPHPBuff } from './PvPHPBuff.ts';
import { PvPDefenseBuff } from './PvPDefenseBuff';
import { PvPDeAttackBuff } from './PvPDeAttackBuff';
import { PvPDeHPBuff } from './PvPDeHPBuff';
import { PvPDeDefenseBuff } from './PvPDeDefense';
import { PvPPreservationBuff } from './PvPPreservationBuff';
import { PvPDebilitationBuff } from './PvPDebilitationBuff';
import { PvPRangeBuff } from './PvPRangeBuff'

import {type BuffFunctionInterface} from '@lib/RankingInterfaces';

const EvAnsBasic = z
  .function()
  .args(ExtendedGeneral, AttributeMultipliers)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, am: AttributeMultipliersType) => {
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

    let BasicAttack = eg.attack + 45 * eg.attack_increment;
    if(DEBUG_BAS) {
      console.log(`BasicAttack step1: ${BasicAttack}`)
    }
    BasicAttack -= 190;
    if(DEBUG_BAS) {
      console.log(`190 off the top: ${BasicAttack}`)
    }
    BasicAttack += 500;
    if(DEBUG_BAS) {
      console.log(`BasicAttack with cultivation: ${BasicAttack}`)
    }
    BasicAttack += AES_adjustment;
    if(DEBUG_BAS) {
      console.log(`BasicAttack with AES`)
    }
    if(BasicAttack < 900){
      BasicAttack = BasicAttack * 0.1
      if(DEBUG_BAS ) {
        console.log(`BasicAttack less than 900, now ${BasicAttack}`)
      }
    } else {
      BasicAttack = 90 + (BasicAttack -900)*.2;
      if(DEBUG_BAS) {
        console.log(`BasicAttack > 900, now ${BasicAttack}`)
      }
    }

    let BasicDefense = eg.defense + 45 * eg.defense_increment;
    if(DEBUG_BAS) {
      console.log(`BasicDefense step1: ${BasicDefense}`)
    }
    BasicDefense -= 190;
    if(DEBUG_BAS) {
      console.log(`190 off the top: ${BasicDefense}`)
    }
    BasicDefense += AES_adjustment
    if(DEBUG_BAS) {
      console.log(`BasicDefense with AES: ${BasicDefense}`)
    }
    BasicDefense += 500;
    if(DEBUG_BAS) {
      console.log(`BasicDefense with cultivation: ${BasicDefense}`)
    }
    if(BasicDefense < 900){
      BasicDefense = BasicDefense * 0.1
      if(DEBUG_BAS ) {
        console.log(`BasicDefense less than 900, now ${BasicDefense}`)
      }
    } else {
      BasicDefense = 90 + (BasicDefense -900)*.2;
      if(DEBUG_BAS) {
        console.log(`BasicDefense > 900, now ${BasicDefense}`)
      }
    }

    let BasicLeaderShip = eg.leadership + 45 * eg.leadership_increment;
    if(DEBUG_BAS) {
      console.log(`BasicLeaderShip step1: ${BasicLeaderShip}`)
    }
    BasicLeaderShip -= 190;
    if(DEBUG_BAS) {
      console.log(`190 off the top: ${BasicLeaderShip}`)
    }
    BasicLeaderShip += AES_adjustment
    if(DEBUG_BAS) {
      console.log(`BasicLeadership with AES`)
    }
    BasicLeaderShip += 500;
      if(DEBUG_BAS) {
      console.log(`BasicLeaderShip with cultivation: ${BasicLeaderShip}`)
    }
    if(BasicLeaderShip < 900){
      BasicLeaderShip = BasicLeaderShip * 0.1
      if(DEBUG_BAS ) {
        console.log(`BasicLeaderShip less than 900, now ${BasicLeaderShip}`)
      }
    } else {
      BasicLeaderShip = 90 + (BasicLeaderShip -900)*.2;
      if(DEBUG_BAS) {
        console.log(`BasicLeaderShip > 900, now ${BasicLeaderShip}`)
      }
    }

    let BasicPolitics = eg.politics + 45 * eg.politics_increment;
    if(DEBUG_BAS) {
      console.log(`BasicPolitics step1: ${BasicPolitics}`)
    }
    BasicPolitics -= 190;
    if(DEBUG_BAS) {
      console.log(`190 off the top: ${BasicPolitics}`)
    }
    BasicPolitics += AES_adjustment
    if(DEBUG_BAS) {
      console.log(`BasicPolitics with AES ${BasicPolitics}`)
    }
    BasicPolitics += 500;
    if(DEBUG_BAS) {
      console.log(`BasicPolitics with cultivation: ${BasicPolitics}`)
    }
    if(BasicPolitics < 900){
      BasicPolitics = BasicPolitics * 0.1
      if(DEBUG_BAS ) {
        console.log(`BasicPolitics less than 900, now ${BasicPolitics}`)
      }
    } else {
      BasicPolitics = 90 + (BasicPolitics -900)*.2;
      if(DEBUG_BAS) {
        console.log(`BasicPolitics > 900, now ${BasicPolitics}`)
      }
    }

    const attackMultiplier =
      am.Offensive.AllTroopAttack ?? 1;
    const defenseMultiplier =
      am.Toughness.AllTroopDefense ?? 1;
    const HPMultiplier =
      am.Toughness.AllTroopHP ?? 1;
    const PoliticsMultiplier =
      am.Preservation.Death2Wounded ?? 1;

    const BAS =
      Math.floor(BasicAttack * attackMultiplier ) +
      Math.floor(BasicDefense * defenseMultiplier ) +
      Math.floor(BasicLeaderShip * HPMultiplier  )+
      Math.floor(BasicPolitics * PoliticsMultiplier);

    if (DEBUG_BAS) {
      console.log(
        `BasicAttack: ${BasicAttack} = ${BasicAttack * attackMultiplier} for ${eg.name}`
      );
      console.log(
        `BasicDefense: ${BasicDefense} = ${BasicDefense * defenseMultiplier} for ${eg.name}`
      );
      console.log(
        `BasicLeaderShip: ${BasicLeaderShip} = ${BasicLeaderShip * HPMultiplier} for ${eg.name}`
      );
      console.log(`BasicPolitics: ${BasicPolitics} = ${BasicPolitics * PoliticsMultiplier} for ${eg.name}`);
      console.log(`BAS: ${BAS} for: ${eg.name}`);
    }
    return BAS;
  });

export const EvAnsArchersPvPAttack = z
  .function()
  .args(ExtendedGeneral, Display, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (eg: ExtendedGeneralType, display: DisplayType, bp: BuffParamsType, am: AttributeMultipliersType) => {
      if (DEBUG) {
        console.log(`${eg.name}: EvAnsArchersPvPAttack starting`);
      }

      const typedBuffFunctions: BuffFunctionInterface = {
        Attack: AttackBuff,
        MarchSize: PvPMarchSizeBuff,
        HP: PvPHPBuff,
        Defense: PvPDefenseBuff,
        DeAttack: PvPDeAttackBuff,
        DeHP: PvPDeHPBuff,
        DeDefense: PvPDeDefenseBuff,
        Preservation: PvPPreservationBuff,
        Debilitation: PvPDebilitationBuff,
        Range: PvPRangeBuff
      }

      const BAS = EvAnsBasic(eg, am);
      const BSS = PvPBSS(eg, bp, typedBuffFunctions, am);
      const AES = PvPAES(eg, bp, typedBuffFunctions, am);
      const specialities = PvP34SS(eg, bp, typedBuffFunctions, am);

      let TLGS = BSS + specialities;
      if (DEBUG) {
        console.log(`EvAnsArchersPvPAttack: ${eg.name}: BSS: ${BSS}`);
        console.log(
          `EvAnsArchersPvPAttack: ${eg.name}: specialities: ${specialities}`
        );
        console.log(`EvAnsArchersPvPAttack: ${eg.name}: BAS: ${BAS}`);
        console.log(`EvAnsArchersPvPAttack: ${eg.name}: AES: ${AES}`);
        console.log(
          `EvAnsArchersPvPAttack: ${eg.name}: TLGS (BSS & 34SS): ${TLGS}`
        );
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
          `for ${eg.name} as ${display}:  BAS: ${BAS} BSS: ${BSS} AES: ${AES} specialities: ${specialities} TLGS: ${TLGS}`
        );
      }
      return TLGS;
    }
  );
