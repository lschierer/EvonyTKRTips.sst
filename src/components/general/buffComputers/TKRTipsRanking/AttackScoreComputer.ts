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

import { TKRTipsAttackGroundPvPAttack } from './Ground/AttackPvPBase';
import { TKRTipsAttackArchersPvPAttack } from './Archers/AttackPvPBase';
import { TKRTipsAttackMountedPvPAttack } from './Mounted/AttackPvPBase';
import { TKRTipsAttackSiegePvPAttack } from './Siege/AttackPvPBase';

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

const DEBUG = false;

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
          return TKRTipsAttackArchersPvPAttack(eg, display, bp);
        }
        if (!generalSpecialists.enum.Ground.localeCompare(eg.score_as)) {
          return TKRTipsAttackGroundPvPAttack(eg, display, bp);
        }
        if (!generalSpecialists.enum.Mounted.localeCompare(eg.score_as)) {
          return TKRTipsAttackMountedPvPAttack(eg, display, bp);
        }
        if (!generalSpecialists.enum.Siege.localeCompare(eg.score_as)) {
          return TKRTipsAttackSiegePvPAttack(eg, display, bp);
        }
      } else {
        console.log(`not called for Attack use case`);
      }
      console.log(`${eg.name} did not match any scoring function`);
      return -7;
    }
  );

