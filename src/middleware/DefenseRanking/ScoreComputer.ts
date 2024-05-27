import { z } from "astro:content";
import {
  AscendingLevels,
  Display,
  generalUseCase,
  generalSpecialists,
  type DisplayType,
  type ExtendedGeneralType,
  type generalUseCaseType,
  type generalSpecialistsType,
  ExtendedGeneral,
  BuffParams,
  type BuffParamsType,
} from "@schemas/index";

import {GroundPvPDefense} from './Ground/PvPBase'
import { ArchersPvPDefense } from "./Archers/PvPBase";
import { MountedPvPDefense} from './Mounted/PvPBase';
import { SiegePvPDefense } from "./Siege/PvPBase";

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

export const DEBUG = false;

const useCaseSelector: Record<
  generalUseCaseType,
  Record<
    generalSpecialistsType,
    (eg: ExtendedGeneralType, display: DisplayType, bp: BuffParamsType) => number
  >
> = {
  [generalUseCase.enum.Attack]: {
    [generalSpecialists.enum.Archers]: ArchersPvPDefense,
    [generalSpecialists.enum.Ground]: GroundPvPDefense,
    [generalSpecialists.enum.Mounted]: MountedPvPDefense,
    [generalSpecialists.enum.Siege]: SiegePvPDefense,
    [generalSpecialists.enum.Wall]: () => {
      return -1;
    },
    [generalSpecialists.enum.Mayor]: () => {
      return -2;
    },
    [generalSpecialists.enum.all]: () => {
      return -3;
    },
  },
  [generalUseCase.enum.Defense]: {
    [generalSpecialists.enum.Archers]: () => {
      return -7;
    },
    [generalSpecialists.enum.Ground]: () => {
      return -7;
    },
    [generalSpecialists.enum.Mounted]: () => {
      return -7;
    },
    [generalSpecialists.enum.Siege]: () => {
      return -7;
    },
    [generalSpecialists.enum.Wall]: () => {
      return -1;
    },
    [generalSpecialists.enum.Mayor]: () => {
      return -2;
    },
    [generalSpecialists.enum.all]: () => {
      return -3;
    },
  },
  [generalUseCase.enum.Monsters]: {
    [generalSpecialists.enum.Archers]: () => {
      return -7;
    },
    [generalSpecialists.enum.Ground]: () => {
      return -7;
    },
    [generalSpecialists.enum.Mounted]: () => {
      return -7;
    },
    [generalSpecialists.enum.Siege]: () => {
      return -7;
    },
    [generalSpecialists.enum.Wall]: () => {
      return -1;
    },
    [generalSpecialists.enum.Mayor]: () => {
      return -2;
    },
    [generalSpecialists.enum.all]: () => {
      return -3;
    },
  },
  [generalUseCase.enum.Overall]: {
    [generalSpecialists.enum.Archers]: () => {
      return -5;
    },
    [generalSpecialists.enum.Ground]: () => {
      return -5;
    },
    [generalSpecialists.enum.Mounted]: () => {
      return -5;
    },
    [generalSpecialists.enum.Siege]: () => {
      return -5;
    },
    [generalSpecialists.enum.Wall]: () => {
      return -5;
    },
    [generalSpecialists.enum.Mayor]: () => {
      return -5;
    },
    [generalSpecialists.enum.all]: () => {
      return -5;
    },
  },
  [generalUseCase.enum.Wall]: {
    [generalSpecialists.enum.Archers]: () => {
      return -1;
    },
    [generalSpecialists.enum.Ground]: () => {
      return -1;
    },
    [generalSpecialists.enum.Mounted]: () => {
      return -1;
    },
    [generalSpecialists.enum.Siege]: () => {
      return -1;
    },
    [generalSpecialists.enum.Wall]: () => {
      return -1;
    },
    [generalSpecialists.enum.Mayor]: () => {
      return -1;
    },
    [generalSpecialists.enum.all]: () => {
      return -1;
    },
  },
  [generalUseCase.enum.Mayor]: {
    [generalSpecialists.enum.Archers]: () => {
      return -2;
    },
    [generalSpecialists.enum.Ground]: () => {
      return -2;
    },
    [generalSpecialists.enum.Mounted]: () => {
      return -2;
    },
    [generalSpecialists.enum.Siege]: () => {
      return -2;
    },
    [generalSpecialists.enum.Wall]: () => {
      return -2;
    },
    [generalSpecialists.enum.Mayor]: () => {
      return -2;
    },
    [generalSpecialists.enum.all]: () => {
      return -2;
    },
  },
  [generalUseCase.enum.all]: {
    [generalSpecialists.enum.Archers]: () => {
      return -3;
    },
    [generalSpecialists.enum.Ground]: () => {
      return -3;
    },
    [generalSpecialists.enum.Mounted]: () => {
      return -3;
    },
    [generalSpecialists.enum.Siege]: () => {
      return -3;
    },
    [generalSpecialists.enum.Wall]: () => {
      return -3;
    },
    [generalSpecialists.enum.Mayor]: () => {
      return -3;
    },
    [generalSpecialists.enum.all]: () => {
      return -3;
    },
  },
};

export const ScoreComputer = z
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
      return useCaseSelector[UseCase][eg.general.score_as](eg, display, bp);
    }
  );
