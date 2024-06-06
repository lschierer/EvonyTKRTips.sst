const DEBUG = false;
const DEBUG_BAS = false;
const DEBUGC = false;

import { z } from 'zod';

import {
  AscendingLevels, Buff,
  BuffParams,
  type BuffParamsType, type BuffType, Condition,
} from '@schemas/baseSchemas';

import {AttributeMultipliers, type AttributeMultipliersType} from '@schemas/EvAns.zod';

import { Display, type DisplayType, generalUseCase } from '@schemas/generalsSchema';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import { PvPBSS } from './ReinforcementAttackPvPBSS';
import { PvPAES } from './ReinforcementAttackPvPAES';
import { PvP34SS } from './ReinforcementAttackPvP34SS';

import { AttackBuff } from './AttackBuff';
import { MarchSizeBuff } from './MarchSizeBuff.ts';
import { HPBuff } from './HPBuff.ts';
import { DefenseBuff } from './DefenseBuff.ts';
import { DeAttackBuff } from './DeAttackBuff.ts';
import { DeHPBuff } from './DeHPBuff.ts';
import { DeDefenseBuff } from './DeDefense.ts';
import { PreservationBuff } from './PreservationBuff.ts';
import { DebilitationBuff } from './DebilitationBuff.ts';
import { RangeBuff } from './RangeBuff.ts'

import {type BuffFunctionInterface} from '@lib/RankingInterfaces';

const Basic = z
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

export const ReinforcementAttackPvPBase = z
  .function()
  .args(ExtendedGeneral, Display, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement(
    (eg: ExtendedGeneralType, display: DisplayType, bp: BuffParamsType, am: AttributeMultipliersType) => {
      if (DEBUG) {
        console.log(`${eg.name}: ArchersPvPAttack starting`);
      }

      const ValidConditions = null;

      const typedBuffFunctions: BuffFunctionInterface = {
        Attack: AttackBuff,
        DeAttack: DeAttackBuff,
        DeDefense: DeDefenseBuff,
        DeHP: DeHPBuff,
        Debilitation: DebilitationBuff,
        Defense: DefenseBuff,
        HP: HPBuff,
        MarchSize: MarchSizeBuff,
        Preservation: PreservationBuff,
        Range: RangeBuff,
      }

      const BAS = Basic(eg, am);
      const BSS = PvPBSS(eg, bp, typedBuffFunctions, generalUseCase.enum.Reinforcement, am);
      const AES = PvPAES(eg, bp, typedBuffFunctions, generalUseCase.enum.Reinforcement, am);
      const specialities = PvP34SS(eg, bp, typedBuffFunctions, generalUseCase.enum.Reinforcement, am);

      let TLGS = BSS + specialities;
      if (DEBUG) {
        console.log(`ArchersPvPAttack: ${eg.name}: BSS: ${BSS}`);
        console.log(
          `ArchersPvPAttack: ${eg.name}: specialities: ${specialities}`
        );
        console.log(`ArchersPvPAttack: ${eg.name}: BAS: ${BAS}`);
        console.log(`ArchersPvPAttack: ${eg.name}: AES: ${AES}`);
        console.log(
          `ArchersPvPAttack: ${eg.name}: TLGS (BSS & 34SS): ${TLGS}`
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
