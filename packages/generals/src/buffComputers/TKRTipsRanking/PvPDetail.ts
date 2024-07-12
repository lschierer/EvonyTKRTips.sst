import { type AttributeMultipliersType } from '../../schemas/EvAns.zod';

const DEBUG = false;

import { z } from 'zod';
import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '../../schemas/ExtendedGeneral';
import { BuffParams, type BuffParamsType } from '../../schemas/baseSchemas';
import {
  Display,
  type DisplayType,
  generalSpecialists,
  type generalSpecialistsType,
  generalUseCase,
  type generalUseCaseType,
} from '../../schemas/generalsSchema';
import * as Attributes from '../../EvAnsAttributeRanking';

import { PvPAttackDetail } from './Details/PvPAttackDetail';
import { PvPRangeDetail } from './Details/PvPRangeDetail';
import { PvPMarchSizeDetail } from './Details/PvPMarchSizeDetail';
import { PvPDeHPDetail } from './Details/PvPDeHPDetail';
import { PvPHPDetail } from './Details/PvPHPDetail';
import { PvPDefenseDetail } from './Details/PvPDefenseDetail';
import { PvPDeDefenseDetail } from './Details/PvPDeDefenseDetail';
import { PvPDeAttackDetail } from './Details/PvPDeAttackDetail';
import { PvPPreservationDetail } from './Details/PvPPreservationDetail';
import { PvPDebilitationDetail } from './Details/PvPDebilitationDetail';
import { PvPRallyDetail } from './Details/PvPRallyDetail';

export const PvPBuffDetails = z.object({
  attackRank: z.object({
    attackScore: z.number(),
    marchSizeScore: z.number(),
    rangeScore: z.number(),
    rallyScore: z.number(),
    DeHPScore: z.number(),
    DeDefenseScore: z.number(),
  }),
  toughnessRank: z.object({
    HPScore: z.number(),
    defenseScore: z.number(),
    DeAttackScore: z.number(),
  }),
  preservationRank: z.object({
    PreservationScore: z.number(),
    DebilitationScore: z.number(),
  }),
});
export type PvPBuffDetails = z.infer<typeof PvPBuffDetails>;

const getAttributes = (
  useCase: generalUseCaseType,
  speciality: generalSpecialistsType,
): AttributeMultipliersType => {
  switch (useCase) {
    case generalUseCase.enum.Attack:
      switch (speciality) {
        case generalSpecialists.enum.Archers:
          return Attributes.RangedPvPAttackAttributeMultipliers;
        case generalSpecialists.enum.Ground:
          return Attributes.GroundPvPAttackAttributeMultipliers;
        case generalSpecialists.enum.Mounted:
          return Attributes.MountedPvPAttackAttributeMultipliers;
        case generalSpecialists.enum.Siege:
          return Attributes.SiegePvPAttackAttributeMultipliers;
      }
      break;
    case generalUseCase.enum.Reinforcement:
      switch (speciality) {
        case generalSpecialists.enum.Archers:
          return Attributes.RangedPvPReinforcementAttributeMultipliers;
        case generalSpecialists.enum.Ground:
          return Attributes.GroundPvPReinforcementAttributeMultipliers;
        case generalSpecialists.enum.Mounted:
          return Attributes.MountedPvPReinforcementAttributeMultipliers;
        case generalSpecialists.enum.Siege:
          return Attributes.SiegePvPReinforcementAttributeMultipliers;
      }
      break;
  }
  return {
    Offensive: {
      AllTroopAttack: 0,
      GroundAttack: 0,
      RangedAttack: 0,
      SiegeAttack: 0,
      MountedAttack: 0,
      InBattleMovementBonus: 0,
      RangedRangeBonus: 0,
      SiegeRangeBonusFlat: 0,
      SiegeRangeBonusPercent: 0,
      MarchSizeIncrease: 0,
      RallyCapacity: 0,
    },
    Toughness: {
      AllTroopHP: 0,
      RangedHP: 0,
      MountedHP: 0,
      GroundHP: 0,
      SiegeHP: 0,
      AllTroopDefense: 0,
      RangedDefense: 0,
      MountedDefense: 0,
      SiegeDefense: 0,
      GroundDefense: 0,
    },
    Preservation: {
      Death2Wounded: 0,
      Death2WoundedWhenAttacking: 0,
      Death2Souls: 0,
      Death2SoulsinMainCity: 0,
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 0,
      ReduceEnemyMountedAttack: 0,
      ReduceEnemyRangedAttack: 0,
      ReduceEnemySiegeAttack: 0,
      ReduceEnemyGroundAttack: 0,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 0,
      ReduceEnemyRangedHP: 0,
      ReduceEnemySiegeHP: 0,
      ReduceEnemyMountedHP: 0,
      ReduceEnemyGroundHP: 0,
      ReduceEnemyAllDefense: 0,
      ReduceEnemyRangedDefense: 0,
      ReduceEnemySiegeDefense: 0,
      ReduceEnemyMountedDefense: 0,
      ReduceEnemyGroundDefense: 0,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 0,
      ReduceEnemyMountedAttack: 0,
      ReduceEnemyRangedAttack: 0,
      ReduceEnemySiegeAttack: 0,
      ReduceEnemyGroundAttack: 0,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 0,
      ReduceEnemyRangedHP: 0,
      ReduceEnemySiegeHP: 0,
      ReduceEnemyMountedHP: 0,
      ReduceEnemyGroundHP: 0,
      ReduceEnemyAllDefense: 0,
      ReduceEnemyRangedDefense: 0,
      ReduceEnemySiegeDefense: 0,
      ReduceEnemyMountedDefense: 0,
      ReduceEnemyGroundDefense: 0,
    },
    Debilitation: {
      Wounded2Death: 0,
      InCityWounded2Death: 0,
      Wounded2DeathWhenAttacking: 0,
    },
  };
};

export const PvPDetail = z
  .function()
  .args(ExtendedGeneral, BuffParams, generalUseCase, Display)
  .returns(PvPBuffDetails)
  .implement(
    (
      eg: ExtendedGeneralType,
      bp: BuffParamsType,
      useCase: generalUseCaseType,
      display: DisplayType,
    ) => {
      if (DEBUG) {
        console.log(`\nPvPDetail start for ${eg.name} ${useCase} ${display}`);
      }
      const am = getAttributes(useCase, eg.score_as);

      const returnable: PvPBuffDetails = {
        attackRank: {
          attackScore: 0,
          marchSizeScore: 0,
          rangeScore: 0,
          rallyScore: 0,
          DeHPScore: 0,
          DeDefenseScore: 0,
        },
        toughnessRank: {
          HPScore: 0,
          defenseScore: 0,
          DeAttackScore: 0,
        },
        preservationRank: {
          PreservationScore: 0,
          DebilitationScore: 0,
        },
      };

      returnable.attackRank.attackScore = PvPAttackDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.attackRank.rangeScore = PvPRangeDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.attackRank.marchSizeScore = PvPMarchSizeDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.attackRank.rallyScore = PvPRallyDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.toughnessRank.DeAttackScore = PvPDeAttackDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.attackRank.DeHPScore = PvPDeHPDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.attackRank.DeDefenseScore = PvPDeDefenseDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.toughnessRank.HPScore = PvPHPDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.toughnessRank.defenseScore = PvPDefenseDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.preservationRank.PreservationScore = PvPPreservationDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      returnable.preservationRank.DebilitationScore = PvPDebilitationDetail(
        eg,
        bp,
        am,
        useCase,
        display,
      );
      if (DEBUG) {
        console.log(`PvPDetail${eg.name} end: ${JSON.stringify(returnable)}\n`);
      }
      return returnable;
    },
  );
