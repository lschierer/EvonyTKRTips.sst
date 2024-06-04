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

import { GroundPvPToughness } from './Ground/ToughnessPvPBase';
import { TKRTipsArchersPvPToughness } from './Archers/ToughnessPvPBase';
import { MountedPvPToughness } from './Mounted/ToughnessPvPBase';
import { SiegePvPToughness } from './Siege/ToughnessPvPBase';

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

const DEBUG = true;

export const ToughnessScoreComputer = z
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
          return TKRTipsArchersPvPToughness(eg, display, bp);
        }
        if (!generalSpecialists.enum.Ground.localeCompare(eg.score_as)) {
          return GroundPvPToughness(eg, display, bp);
        }
        if (!generalSpecialists.enum.Mounted.localeCompare(eg.score_as)) {
          return MountedPvPToughness(eg, display, bp);
        }
        if (!generalSpecialists.enum.Siege.localeCompare(eg.score_as)) {
          return SiegePvPToughness(eg, display, bp);
        }
      } else {
        console.log(`not called for Attack use case`);
      }
      console.log(`${eg.name} did not match any scoring function`);
      return -7;
    }
  );

