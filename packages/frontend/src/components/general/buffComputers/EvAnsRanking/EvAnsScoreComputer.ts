import { z } from 'zod';

import { BuffParams, type BuffParamsType } from '@schemas/baseSchemas';

import {
  Display,
  type DisplayType,
  generalSpecialists,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral';


import { EvAnsPvPAttacking } from './Details/AttackPvPBase';
import { EvAnsPvPReinforcement } from './Details/ReinforcementPvPBase';
import * as EvAnsAttributes from '@lib/EvAnsAttributeRanking';

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

const DEBUG = false;

export const EvAnsScoreComputer = z
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
      if(!UseCase.localeCompare(generalUseCase.enum.all)) {
        if(DEBUG) {
          console.log(`EvansScoreComputer detects useCase of all`)
        }
        return 0;
      } else if(!UseCase.localeCompare(generalUseCase.enum.Monsters)) {
        return 0; //EvAns has not released Attribute Multipliers for PvM and with his attention to detail, I am confident they *will* differ considerably.
      } else if (!UseCase.localeCompare(generalUseCase.enum.Attack)) {
        if (DEBUG) {
          console.log(`called for Attack use case`);
        }
        if (!generalSpecialists.enum.Archers.localeCompare(eg.score_as)) {
          return EvAnsPvPAttacking(eg, display, bp, EvAnsAttributes.RangedPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Ground.localeCompare(eg.score_as)) {
          return EvAnsPvPAttacking(eg, display, bp, EvAnsAttributes.GroundPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Mounted.localeCompare(eg.score_as)) {
          return EvAnsPvPAttacking(eg, display, bp, EvAnsAttributes.MountedPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Siege.localeCompare(eg.score_as)) {
          return EvAnsPvPAttacking(eg, display, bp, EvAnsAttributes.SiegePvPAttackAttributeMultipliers);
        }
      } else if (!UseCase.localeCompare(generalUseCase.enum.Reinforcement)){
        if (!generalSpecialists.enum.Archers.localeCompare(eg.score_as)) {
          return EvAnsPvPReinforcement(eg, display, bp, EvAnsAttributes.RangedPvPReinforcementAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Ground.localeCompare(eg.score_as)) {
          return EvAnsPvPReinforcement(eg, display, bp, EvAnsAttributes.GroundPvPReinforcementAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Mounted.localeCompare(eg.score_as)) {
          return EvAnsPvPReinforcement(eg, display, bp, EvAnsAttributes.MountedPvPReinforcementAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Siege.localeCompare(eg.score_as)) {
          return EvAnsPvPReinforcement(eg, display, bp, EvAnsAttributes.SiegePvPReinforcementAttributeMultipliers);
        }
      } else {
        if(DEBUG) {
          console.log(`not called for Attack, Monsters, or Reinforcement use cases`);
        }
      }
      console.log(`${eg.name} ${UseCase} ${eg.score_as} did not match any scoring function`);
      return -7;
    }
  );

