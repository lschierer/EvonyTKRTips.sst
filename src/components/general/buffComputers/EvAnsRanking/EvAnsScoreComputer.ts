import { z } from 'zod';

import { BuffParams, type BuffParamsType } from '@schemas/baseSchemas';

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

import { EvAnsGroundPvPAttack } from './Ground/AttackPvPBase';
import { EvAnsArchersPvPAttack } from './Archers/AttackPvPBase';
import { EvAnsMountedPvPAttack } from './Mounted/AttackPvPBase';
import { EvAnsSiegePvPAttack } from './Siege/AttackPvPBase';

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
      if (!UseCase.localeCompare(generalUseCase.enum.Attack)) {
        if (DEBUG) {
          console.log(`called for Attack use case`);
        }
        if (
          generalSpecialists.enum.Archers.localeCompare(eg.general.score_as)
        ) {
          return EvAnsArchersPvPAttack(eg, display, bp);
        }
        if (generalSpecialists.enum.Ground.localeCompare(eg.general.score_as)) {
          return EvAnsGroundPvPAttack(eg, display, bp);
        }
        if (
          generalSpecialists.enum.Mounted.localeCompare(eg.general.score_as)
        ) {
          return EvAnsMountedPvPAttack(eg, display, bp);
        }
        if (generalSpecialists.enum.Siege.localeCompare(eg.general.score_as)) {
          return EvAnsSiegePvPAttack(eg, display, bp);
        }
      } else {
        console.log(`not called for Attack use case`);
      }
      console.log(`${eg.general.name} did not match any scoring function`);
      return -7;
    }
  );
