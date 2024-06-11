const DEBUG = true;
const DEBUG_BAS = false;

import { z } from 'zod';

import {
  AscendingLevels,
  Buff,
  BuffParams,
  type BuffParamsType,
  type BuffType,
  Condition,
} from '@schemas/baseSchemas';

import { AttributeMultipliers, type AttributeMultipliersType } from '@schemas/EvAns.zod';

import {
  Display,
  type DisplayType,
  generalSpecialists, type generalSpecialistsType,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

import * as MayorAttributeMultipliers from '@lib/TKRAttributeRanking';

import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral';
import { PvPBSS } from './Details/MayorAttackBSS';
import { PvPAES } from './Details/MayorAttackAES';
import { PvP34SS } from './Details/MayorAttack34SS';

import { AttackBuff } from './Details/AttackBuff.ts';
import { MarchSizeBuff } from './Details/MarchSizeBuff.ts';
import { HPBuff } from './Details/HPBuff.ts';
import { DefenseBuff } from './Details/DefenseBuff.ts';
import { DeAttackBuff } from './Details/DeAttackBuff.ts';
import { DeHPBuff } from './Details/DeHPBuff.ts';
import { DeDefenseBuff } from './Details/DeDefense.ts';
import { PreservationBuff } from './Details/PreservationBuff.ts';
import { DebilitationBuff } from './Details/DebilitationBuff.ts';
import { RangeBuff } from './Details/RangeBuff.ts';

import { type BuffFunctionInterface } from '@lib/RankingInterfaces';

const Basic = z
  .function()
  .args(ExtendedGeneral, AttributeMultipliers)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, am: AttributeMultipliersType) => {
    let AES_adjustment = 0;
    switch (eg.stars) {
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

    let BasicAttack = eg.attack + 45 * eg.attack_increment;
    if(DEBUG_BAS) {
      console.log(`BasicAttack step1: ${BasicAttack}`)
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
    const defenseMultiplier = 0;
    const HPMultiplier = 0;
    const PoliticsMultiplier = 0;

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

export const MayorAttackDetails = z
  .function()
  .args(ExtendedGeneral, BuffParams, generalSpecialists)
  .returns(z.number())
  .implement(
    (eg: ExtendedGeneralType, bp: BuffParamsType, specialize: generalSpecialistsType) => {
      if (DEBUG) {
        console.log(`${eg.name}: MayorAttackDetails starting`);
      }
      let am: AttributeMultipliersType;
      if(!specialize.localeCompare(generalSpecialists.enum.Ground)) {
        if(DEBUG) {
          console.log(`scoring for ground`)
        }
        am = MayorAttributeMultipliers.MayorGroundAttackAttributeMultipliers;
      } else if(!specialize.localeCompare(generalSpecialists.enum.Archers)) {
        if(DEBUG) {
          console.log(`scoring for Archers`)
        }
        am = MayorAttributeMultipliers.MayorArchersAttackAttributeMultipliers;
      } else if(!specialize.localeCompare(generalSpecialists.enum.Mounted)) {
        if(DEBUG) {
          console.log(`scoring for Mounted`)
        }
        am = MayorAttributeMultipliers.MayorMountedAttackAttributeMultipliers;
      } else if(!specialize.localeCompare(generalSpecialists.enum.Siege)) {
        if(DEBUG) {
          console.log(`scoring for Siege`)
        }
        am = MayorAttributeMultipliers.MayorSiegeAttackAttributeMultipliers;
      } else {
        if(DEBUG) {
          console.log(`scoring generically`)
        }
        am = MayorAttributeMultipliers.MayorPvPAttackAttributeMultipliers;
      }
      const useCase = generalUseCase.enum.Mayor;
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
      const BSS = PvPBSS(eg, bp, typedBuffFunctions, useCase, am);
      const AES = PvPAES(eg, bp, typedBuffFunctions, useCase, am);
      const specialities = PvP34SS(eg, bp, typedBuffFunctions, useCase, am);

      let TLGS = BSS + specialities;
      if (DEBUG) {
        console.log(`MayorAttackDetails: ${eg.name}: BSS: ${BSS}`);
        console.log(
          `MayorAttackDetails: ${eg.name}: specialities: ${specialities}`
        );
        console.log(`MayorAttackDetails: ${eg.name}: BAS: ${BAS}`);
        console.log(`MayorAttackDetails: ${eg.name}: AES: ${AES}`);
        console.log(
          `MayorAttackDetails: ${eg.name}: TLGS (BSS & 34SS): ${TLGS}`
        );
      }

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
      if (DEBUG) {
        console.log(
          `for ${eg.name} as Mayor:  BAS: ${BAS} BSS: ${BSS} AES: ${AES} specialities: ${specialities} TLGS: ${TLGS}`
        );
      }
      return TLGS;
    }
  );
const DEBUGC = false;

