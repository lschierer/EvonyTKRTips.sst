import { z } from 'zod';

import {
  Buff,
  BuffParams,
  type BuffParamsType,
  type BuffType,
  Condition,
} from '@schemas/baseSchemas';

import {
  Display,
  type DisplayType,
  generalSpecialists,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import { GroundPvPAttack } from './Ground/AttackPvPBase';
import { ArchersPvPAttack } from './Archers/AttackPvPBase';
import { MountedPvPAttack } from './Mounted/AttackPvPBase';
import { SiegePvPAttack } from './Siege/AttackPvPBase';

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

const DEBUG = true;
const DEBUGC = false;

export const AttackScoreComputer = z
  .function()
  .args(generalUseCase, ExtendedGeneral, Display, BuffParams)
  .returns(z.number())
  .implement(
    (
      UseCase: generalUseCaseType,
      eg: ExtendedGeneralType,
      display: DisplayType,
      bp: BuffParamsType
    ) => {
      if (!UseCase.localeCompare(generalUseCase.enum.Attack)) {
        if (DEBUG) {
          console.log(`called for Attack use case`);
        }
        if (!generalSpecialists.enum.Archers.localeCompare(eg.score_as)) {
          return ArchersPvPAttack(eg, display, bp);
        }
        if (!generalSpecialists.enum.Ground.localeCompare(eg.score_as)) {
          return GroundPvPAttack(eg, display, bp);
        }
        if (!generalSpecialists.enum.Mounted.localeCompare(eg.score_as)) {
          return MountedPvPAttack(eg, display, bp);
        }
        if (!generalSpecialists.enum.Siege.localeCompare(eg.score_as)) {
          return SiegePvPAttack(eg, display, bp);
        }
      } else {
        console.log(`not called for Attack use case`);
      }
      console.log(`${eg.name} did not match any scoring function`);
      return -7;
    }
  );

export const checkInvalidConditions = z
  .function()
  .args(Buff, BuffParams)
  .returns(z.boolean())
  .implement((tb: BuffType, iv: BuffParamsType) => {
    if (tb.condition !== undefined && tb.condition !== null) {
      if (DEBUGC) {
        console.log(`null condition detected: ${JSON.stringify(tb)}`);
      }
      if (
        tb.condition.includes(Condition.enum['Against Monsters']) ||
        tb.condition.includes(Condition.enum.Reduces_Monster) ||
        tb.condition.includes(Condition.enum.In_Main_City) ||
        tb.condition.includes(Condition.enum.Reinforcing) ||
        tb.condition.includes(
          Condition.enum.When_Defending_Outside_The_Main_City
        ) ||
        tb.condition.includes(Condition.enum.When_City_Mayor) ||
        tb.condition.includes(
          Condition.enum.When_City_Mayor_for_this_SubCity
        ) ||
        tb.condition.includes(Condition.enum['When not mine']) ||
        tb.condition.includes(Condition.enum.When_an_officer)
      ) {
        //none of These apply to PvP attacking
        if (DEBUGC) {
          console.log(`buff with inapplicable attribute `);
          console.log(JSON.stringify(tb));
        }
        return false;
      }

      //check for dragon and beast buffs
      if (
        (tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon) ||
          tb.condition.includes(Condition.enum.brings_a_dragon) ||
          tb.condition.includes(Condition.enum.dragon_to_the_attack)) &&
        iv.dragon !== true
      ) {
        return false;
      }
      if (
        tb.condition.includes(
          Condition.enum.brings_dragon_or_beast_to_attack
        ) &&
        !(iv.dragon === true || iv.beast === true)
      ) {
        return false;
      }
      return true;
    }
    return false;
  });
