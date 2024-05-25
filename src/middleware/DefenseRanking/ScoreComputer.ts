import { z } from "astro:content";
import {
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
  ActivationSituations,
} from "@schemas/index";

import { GroundPvPBSS } from "./Ground/PvPBSS";
import { GroundPvPAES } from "./Ground/PvPAES";
import { GroundPvP34SS } from "./Ground/PvP34SS";

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

export const DEBUG = false;
export const DEBUG_GBUFF = false;
const DEBUG_BAS = false;
export const DEBUG_BSS = false;
export const DEBUG_AES = false;
export const DEBUG_34SS = false;



const BasicGround = z
  .function()
  .args(ExtendedGeneral)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType) => {
    const gc = eg.general;

    const BasicAttack =
      (500 + gc.attack + 45 * gc.attack_increment) < 900
        ? (500+ gc.attack + 45 * gc.attack_increment) * 0.1
        : 90 + (500 + gc.attack + 45 * gc.attack_increment - 900) * 0.2;
    const BasicDefense =
      (500 + gc.defense + 45 * gc.defense_increment) < 900
        ? (500 + gc.defense + 45 * gc.defense_increment) * 0.1
        : 90 + (500 + gc.defense + 45 * gc.defense_increment - 900) * 0.2;
    const BasicLeaderShip =
      (500 + gc.leadership + 45 * gc.leadership_increment) < 900
        ? (500 + gc.leadership + 45 * gc.leadership_increment) * 0.1
        : 90 + (500 + gc.leadership + 45 * gc.leadership_increment - 900) * 0.2;
    const BasicPolitics =
      (500 + gc.politics + 45 * gc.politics_increment) < 900
        ? (500 + gc.politics + 45 * gc.politics_increment) * 0.1
        : 90 + (500 + gc.politics + 45 * gc.politics_increment - 900) * 0.2;
 
    const attackMultiplier = 1
    const defenseMultiplier = 1
    const HPMultipler = 1
    const PoliticsMultipler = 1

    const BAS = BasicAttack * attackMultiplier +
      BasicDefense * defenseMultiplier +
      BasicLeaderShip * HPMultipler +
      BasicPolitics * PoliticsMultipler;

    if (DEBUG_BAS) {
      console.log(`BasicAttack: ${BasicAttack} for ${eg.general.name}`);
      console.log(`BasicDefense: ${BasicDefense} for ${eg.general.name}`);
      console.log(`BasicLeaderShip: ${BasicLeaderShip} for ${eg.general.name}`);
      console.log(`BasicPolitics: ${BasicPolitics} for ${eg.general.name}`);
      console.log(`BAS: ${BAS} for: ${eg.general.name}`);
    }
    return Math.floor(BAS);
  });

const GroundPvP = z
  .function()
  .args(ExtendedGeneral, Display, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, display: DisplayType, bp: BuffParamsType) => {
    if (DEBUG) {
      console.log(`${eg.general.name}: EvAnsGroundPvPAttack starting`);
    }

    const BAS = BasicGround(eg);
    const BSS = GroundPvPBSS(eg, bp);
    const AES = GroundPvPAES(eg, bp);
    const specialities = GroundPvP34SS(eg, bp);

    let TLGS = BSS + specialities ;
    if(DEBUG) {
      console.log(`TLGS with BSS and specialities`)
      console.log(`${eg.general.name}: ${TLGS}`)
    }
    if(display.localeCompare(Display.enum.assistant)) {
      TLGS += BAS 
      if(DEBUG) {
        console.log(`TLGS with BAS`)
        console.log(`${eg.general.name}: ${TLGS}`)
      }
      TLGS += AES;
      if(DEBUG) {
        console.log(`TLGS with AES`)
        console.log(`${eg.general.name}: ${TLGS}`)
      }
    }
    if (DEBUG) {
      console.log(
        `for ${eg.general.name} BAS: ${BAS} BSS: ${BSS} AES: ${AES} specialities: ${specialities} TLGS: ${TLGS}`
      );
    }
    return TLGS ?? -11;
  });

const useCaseSelector: Record<
  generalUseCaseType,
  Record<
    generalSpecialistsType,
    (eg: ExtendedGeneralType, display: DisplayType, bp: BuffParamsType) => number
  >
> = {
  [generalUseCase.enum.Attack]: {
    [generalSpecialists.enum.Archers]: () => {
      return -7;
    },
    [generalSpecialists.enum.Ground]: () => {
      return -7
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
  [generalUseCase.enum.Defense]: {
    [generalSpecialists.enum.Archers]: () => {
      return -7;
    },
    [generalSpecialists.enum.Ground]: GroundPvP,
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