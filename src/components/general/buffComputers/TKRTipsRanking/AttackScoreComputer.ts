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


import { AttackingAttackPvPBase } from './Details/AttackingAttackPvPBase';
import { ReinforcementAttackPvPBase } from './Details/ReinforcementAttackPvPBase';
import * as Attributes from '@lib/EvAnsAttributeRanking';

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

const DEBUG = false;

export const AttackingScoreComputer = z
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
      if (!UseCase.localeCompare(generalUseCase.enum.all)) {
        if (DEBUG) {
          console.log(`AttackScoreComputer detects useCase of all`)
        }
        return 0;
      } else if (!UseCase.localeCompare(generalUseCase.enum.Attack)) {
        if (DEBUG) {
          console.log(`called for Attack use case`);
        }
        if (!generalSpecialists.enum.Archers.localeCompare(eg.score_as)) {
          return AttackingAttackPvPBase(eg, display, bp, UseCase, Attributes.RangedPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Ground.localeCompare(eg.score_as)) {
          return AttackingAttackPvPBase(eg, display, bp, UseCase, Attributes.GroundPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Mounted.localeCompare(eg.score_as)) {
          return AttackingAttackPvPBase(eg, display, bp, UseCase, Attributes.MountedPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Siege.localeCompare(eg.score_as)) {
          return AttackingAttackPvPBase(eg, display, bp, UseCase, Attributes.SiegePvPAttackAttributeMultipliers);
        }
      } else if (!UseCase.localeCompare(generalUseCase.enum.Monsters)) {
        if (DEBUG) {
          console.log(`called for Monsters use case`);
        }
        if (!generalSpecialists.enum.Archers.localeCompare(eg.score_as)) {
          return AttackingAttackPvPBase(eg, display, bp, UseCase, Attributes.RangedPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Ground.localeCompare(eg.score_as)) {
          return AttackingAttackPvPBase(eg, display, bp, UseCase, Attributes.GroundPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Mounted.localeCompare(eg.score_as)) {
          return AttackingAttackPvPBase(eg, display, bp, UseCase, Attributes.MountedPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Siege.localeCompare(eg.score_as)) {
          return AttackingAttackPvPBase(eg, display, bp, UseCase, Attributes.SiegePvPAttackAttributeMultipliers);
        }
      } else if (!UseCase.localeCompare(generalUseCase.enum.Reinforcement)){
        if (!generalSpecialists.enum.Archers.localeCompare(eg.score_as)) {
          return ReinforcementAttackPvPBase(eg, display, bp, Attributes.RangedPvPReinforcementAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Ground.localeCompare(eg.score_as)) {
          return ReinforcementAttackPvPBase(eg, display, bp, Attributes.GroundPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Mounted.localeCompare(eg.score_as)) {
          return ReinforcementAttackPvPBase(eg, display, bp, Attributes.MountedPvPAttackAttributeMultipliers);
        }
        if (!generalSpecialists.enum.Siege.localeCompare(eg.score_as)) {
          return ReinforcementAttackPvPBase(eg, display, bp, Attributes.SiegePvPAttackAttributeMultipliers);
        }
      } else {
        console.log(`not called for Attack, Monsters or Reinforcement use cases`);
      }
      console.log(`${eg.name} ${UseCase} ${eg.score_as} did not match any scoring function`);
      return -7;
    }
  );

