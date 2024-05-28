//based on https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation


import {
  type PvPAttributeMultipliers as PvPAttributeMultipliersType,
} from '../schemas/EvAns.zod'

export const GroundPvPAttackAttributeMultipliers: PvPAttributeMultipliersType = {
    Offensive: {
      AllTroopAttack: 2.14833,
      GroundAttack: 1.815,
      RangedAttack: 0.11111,
      SiegeAttack: 0.11111,
      MountedAttack: 0.11111,
      InBattleMovementBonus: 0.6,
      MarchSizeIncrease: 2.66667,
      RallyCapacity: 0.5,
      RangedRangeBonus: 0,
      SiegeRangeBonusFlat: 0,
      SiegeRangeBonusPercent: 0,
    },
    Toughness: {
      AllTroopHP: 1.67101,
      RangedHP: 1.17100,
      MountedHP: 0.16667,
      GroundHP: 0.16667,
      SiegeHP: 0.16667,
      AllTroopDefense: 1.55391,
      RangedDefense: 1.05390,
      MountedDefense: 0.16667,
      SiegeDefense: 0.16667,
      GroundDefense: 0.16667,
    },
    Preservation: {
      Death2Wounded: 0.25555,
      Death2WoundedWhenAttacking: 0.12555,
      Death2Souls: 0.12555,
      Death2SoulsinMainCity: 0,
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 3.54240,
      ReduceEnemyMountedAttack: 1.20000,
      ReduceEnemyRangedAttack: 1.05600,
      ReduceEnemySiegeAttack: 0.912,
      ReduceEnemyGroundAttack: 0.768,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 2.80800,
      ReduceEnemyRangedHP: 0.96000,
      ReduceEnemySiegeHP: 0.84000,
      ReduceEnemyMountedHP: 0.72000,
      ReduceEnemyGroundHP: 0.6,
      ReduceEnemyAllDefense: 2.80800,
      ReduceEnemyRangedDefense: 0.96000,
      ReduceEnemySiegeDefense: 0.84000,
      ReduceEnemyMountedDefense: 0.72000,
      ReduceEnemyGroundDefense: 0.6,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 3.54240,
      ReduceEnemyMountedAttack: 1.20000,
      ReduceEnemyRangedAttack: 1.05600,
      ReduceEnemySiegeAttack: 0.912,
      ReduceEnemyGroundAttack: 0.768,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 2.80800,
      ReduceEnemyRangedHP: 0.96000,
      ReduceEnemySiegeHP: 0.84000,
      ReduceEnemyMountedHP: 0.72000,
      ReduceEnemyGroundHP: 0.6,
      ReduceEnemyAllDefense: 2.80800,
      ReduceEnemyRangedDefense: 0.96000,
      ReduceEnemySiegeDefense: 0.84000,
      ReduceEnemyMountedDefense: 0.72000,
      ReduceEnemyGroundDefense: 0.6,
    },
    Debilitation: {
      Wounded2Death: 0.25555,
      InCityWounded2Death: 0.12555,
      Wounded2DeathWhenAttacking: 0.12555,
    }
  };
  export const GroundPvPReinforcementAttributeMultipliers: PvPAttributeMultipliersType = {
    Offensive: {
      AllTroopAttack: 2.14833,
      GroundAttack: 1.815,
      RangedAttack: 0.11111,
      SiegeAttack: 0.11111,
      MountedAttack: 0.11111,
      InBattleMovementBonus: 0.6,
      MarchSizeIncrease: 2.66667,
      RallyCapacity: 0.5,
      RangedRangeBonus: 0,
      SiegeRangeBonusFlat: 0,
      SiegeRangeBonusPercent: 0,
    },
    Toughness: {
      AllTroopHP: 1.67101,
      RangedHP: 1.17100,
      MountedHP: 0.16667,
      GroundHP: 0.16667,
      SiegeHP: 0.16667,
      AllTroopDefense: 1.55391,
      RangedDefense: 1.05390,
      MountedDefense: 0.16667,
      SiegeDefense: 0.16667,
      GroundDefense: 0.16667,
    },
    Preservation: {
      Death2Wounded: 0.25555,
      Death2WoundedWhenAttacking: 0.12555,
      Death2Souls: 0.12555,
      Death2SoulsinMainCity: 0,
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 3.54240,
      ReduceEnemyMountedAttack: 1.20000,
      ReduceEnemyRangedAttack: 1.05600,
      ReduceEnemySiegeAttack: 0.912,
      ReduceEnemyGroundAttack: 0.768,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 2.80800,
      ReduceEnemyRangedHP: 0.96000,
      ReduceEnemySiegeHP: 0.84000,
      ReduceEnemyMountedHP: 0.72000,
      ReduceEnemyGroundHP: 0.6,
      ReduceEnemyAllDefense: 2.80800,
      ReduceEnemyRangedDefense: 0.96000,
      ReduceEnemySiegeDefense: 0.84000,
      ReduceEnemyMountedDefense: 0.72000,
      ReduceEnemyGroundDefense: 0.6,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 3.54240,
      ReduceEnemyMountedAttack: 1.20000,
      ReduceEnemyRangedAttack: 1.05600,
      ReduceEnemySiegeAttack: 0.912,
      ReduceEnemyGroundAttack: 0.768,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 2.80800,
      ReduceEnemyRangedHP: 0.96000,
      ReduceEnemySiegeHP: 0.84000,
      ReduceEnemyMountedHP: 0.72000,
      ReduceEnemyGroundHP: 0.6,
      ReduceEnemyAllDefense: 2.80800,
      ReduceEnemyRangedDefense: 0.96000,
      ReduceEnemySiegeDefense: 0.84000,
      ReduceEnemyMountedDefense: 0.72000,
      ReduceEnemyGroundDefense: 0.6,
    },
    Debilitation: {
      Wounded2Death: 0.25555,
      InCityWounded2Death: 0.12555,
      Wounded2DeathWhenAttacking: 0.12555,
    }
  };

export const RangedPvPAttackAttributeMultipliers: PvPAttributeMultipliersType = {
    Offensive: {
      AllTroopAttack: 2.84933,
      RangedAttack: 2.51600,
      MountedAttack: 0.11111,
      SiegeAttack: 0.11111,
      GroundAttack: 0.11111,
      InBattleMovementBonus: 0,
      RangedRangeBonus: 0.12000,
      SiegeRangeBonusFlat: 0.02500,
      SiegeRangeBonusPercent: 0.50000,
      MarchSizeIncrease: 2.66667,
      RallyCapacity: 0.5,
    },
    Toughness: {
      AllTroopHP: 1.33501,
      RangedHP: 0.83500,
      MountedHP: 0.16667,
      SiegeHP: 0.16667,
      GroundHP: 0.16667,
      AllTroopDefense: 1.25151,
      RangedDefense: 0.75150,
      MountedDefense: 0.16667,
      SiegeDefense: 0.16667,
      GroundDefense: 0.16667,
    },
    Preservation: {
      Death2Wounded: 0.25555,
      Death2WoundedWhenAttacking: 0.12555,
      Death2Souls: 0.12555,
      Death2SoulsinMainCity: 0,
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 1.63836,
      ReduceEnemyGroundAttack: 0.55500,
      ReduceEnemySiegeAttack: 0.48840,
      ReduceEnemyMountedAttack: 0.42180,
      ReduceEnemyRangedAttack: 0.35520,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 1.31069,
      ReduceEnemyGroundHP: 0.44400,
      ReduceEnemySiegeHP: 0.39072,
      ReduceEnemyMountedHP: 0.72000,
      ReduceEnemyRangedHP: 0.28416,
      ReduceEnemyAllDefense: 1.31069,
      ReduceEnemyGroundDefense: 0.444,
      ReduceEnemySiegeDefense: 0.39072,
      ReduceEnemyMountedDefense: 0.33744,
      ReduceEnemyRangedDefense: 0.28416,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 1.63836,
      ReduceEnemyGroundAttack: 0.55500,
      ReduceEnemySiegeAttack: 0.48840,
      ReduceEnemyRangedAttack: 0.42180,
      ReduceEnemyMountedAttack: 0.35520,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 1.31069,
      ReduceEnemyMountedHP: 0.44400,
      ReduceEnemyRangedHP: 0.39072,
      ReduceEnemyGroundHP: 0.33744,
      ReduceEnemySiegeHP: 0.28416,
      ReduceEnemyAllDefense: 1.31069,
      ReduceEnemyMountedDefense: 0.44400,
      ReduceEnemyRangedDefense: 0.39072,
      ReduceEnemyGroundDefense: 0.33744,
      ReduceEnemySiegeDefense: 0.28416,
    },
    Debilitation: {
      Wounded2Death: 0.25555,
      InCityWounded2Death: 0.12555,
      Wounded2DeathWhenAttacking: 0.12555,
    }
  }
  export const RangedPvPReinforcementAttributeMultipliers: PvPAttributeMultipliersType = {
    Offensive: {
      AllTroopAttack: 2.84933,
      RangedAttack: 2.51600,
      MountedAttack: 0.11111,
      SiegeAttack: 0.11111,
      GroundAttack: 0.11111,
      InBattleMovementBonus: 0,
      RangedRangeBonus: 0.12000,
      SiegeRangeBonusFlat: 0.02500,
      SiegeRangeBonusPercent: 0.50000,
      MarchSizeIncrease: 2.66667,
      RallyCapacity: 0.5,
    },
    Toughness: {
      AllTroopHP: 1.33501,
      RangedHP: 0.83500,
      MountedHP: 0.16667,
      SiegeHP: 0.16667,
      GroundHP: 0.16667,
      AllTroopDefense: 1.25151,
      RangedDefense: 0.75150,
      MountedDefense: 0.16667,
      SiegeDefense: 0.16667,
      GroundDefense: 0.16667,
    },
    Preservation: {
      Death2Wounded: 0.25555,
      Death2WoundedWhenAttacking: 0,
      Death2Souls: 0.12555,
      Death2SoulsinMainCity: 0
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 1.63836,
      ReduceEnemyGroundAttack: 0.55500,
      ReduceEnemySiegeAttack: 0.48840,
      ReduceEnemyMountedAttack: 0.42180,
      ReduceEnemyRangedAttack: 0.35520,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 1.31069,
      ReduceEnemyGroundHP: 0.44400,
      ReduceEnemySiegeHP: 0.39072,
      ReduceEnemyMountedHP: 0.72000,
      ReduceEnemyRangedHP: 0.28416,
      ReduceEnemyAllDefense: 1.31069,
      ReduceEnemyGroundDefense: 0.444,
      ReduceEnemySiegeDefense: 0.39072,
      ReduceEnemyMountedDefense: 0.33744,
      ReduceEnemyRangedDefense: 0.28416,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 1.63836,
      ReduceEnemyGroundAttack: 0.55500,
      ReduceEnemySiegeAttack: 0.48840,
      ReduceEnemyRangedAttack: 0.42180,
      ReduceEnemyMountedAttack: 0.35520,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 1.31069,
      ReduceEnemyMountedHP: 0.44400,
      ReduceEnemyRangedHP: 0.39072,
      ReduceEnemyGroundHP: 0.33744,
      ReduceEnemySiegeHP: 0.28416,
      ReduceEnemyAllDefense: 1.31069,
      ReduceEnemyMountedDefense: 0.44400,
      ReduceEnemyRangedDefense: 0.39072,
      ReduceEnemyGroundDefense: 0.33744,
      ReduceEnemySiegeDefense: 0.28416,
    },
    Debilitation: {
      Wounded2Death: 0.25555,
      InCityWounded2Death: 0,
      Wounded2DeathWhenAttacking: 0,
    }
  }



export const MountedPvPAttackAttributeMultipliers: PvPAttributeMultipliersType = {

    Offensive: {
      AllTroopAttack: 2.20333,
      MountedAttack: 1.87000,
      GroundAttack: 0.11111,
      SiegeAttack: 0.11111,
      RangedAttack: 0.11111,
      InBattleMovementBonus: 0.6,
      RangedRangeBonus: 0,
      SiegeRangeBonusFlat: 0,
      SiegeRangeBonusPercent: 0,
      MarchSizeIncrease: 2.66667,
      RallyCapacity: 0.5,
    },
    Toughness: {
      AllTroopHP: 1.65001,
      MountedHP: 0.15,
      GroundHP: 0.16667,
      SiegeHP: 0.16667,
      RangedHP: 0.16667,
      AllTroopDefense: 1.53501,
      MountedDefense: 1.03500,
      GroundDefense: 0.16667,
      SiegeDefense: 0.16667,
      RangedDefense: 0.16667,
    },
    Preservation: {
      Death2Wounded: 0.25555,
      Death2WoundedWhenAttacking: 0.12555,
      Death2Souls: 0.12555,
      Death2SoulsinMainCity: 0
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 1.63836,
      ReduceEnemyGroundAttack: 0.55500,
      ReduceEnemySiegeAttack: 0.48840,
      ReduceEnemyMountedAttack: 0.42180,
      ReduceEnemyRangedAttack: 0.35520,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 1.75760,
      ReduceEnemyRangedHP: 0.67600,
      ReduceEnemyGroundHP: 0.59150,
      ReduceEnemySiegeHP: 0.50700,
      ReduceEnemyMountedHP: 0.42250, 
      ReduceEnemyAllDefense: 1.75760,
      ReduceEnemyRangedDefense: 0.67600,
      ReduceEnemyGroundDefense: 0.59150,
      ReduceEnemySiegeDefense: 0.50700,
      ReduceEnemyMountedDefense: 0.42250,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 2.21728,
      ReduceEnemyRangedAttack: 0.84000,
      ReduceEnemySiegeAttack: 0.74360,
      ReduceEnemyGroundAttack: 0.64220,
      ReduceEnemyMountedAttack: 0.54080,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 1.34400,
      ReduceEnemyRangedHP: 0.67200,
      ReduceEnemyGroundHP: 0.59150,
      ReduceEnemySiegeHP: 0.50700,
      ReduceEnemyMountedHP: 0.42250,
      ReduceEnemyAllDefense: 1.34400,
      ReduceEnemyRangedDefense: 0.67200,
      ReduceEnemyGroundDefense: 0.59150,
      ReduceEnemySiegeDefense: 0.50700,
      ReduceEnemyMountedDefense: 0.42250  ,
    },
    Debilitation: {
      Wounded2Death: 0.25555,
      InCityWounded2Death: 0.12555,
      Wounded2DeathWhenAttacking: 0.12555,
    }
  }
  export const MountedPvPReinforcementAttributeMultipliers: PvPAttributeMultipliersType = {
    Offensive: {
      AllTroopAttack: 2.20333,
      MountedAttack: 1.87000,
      GroundAttack: 0.11111,
      SiegeAttack: 0.11111,
      RangedAttack: 0.11111,
      InBattleMovementBonus: 0.6,
      RangedRangeBonus: 0,
      SiegeRangeBonusFlat: 0,
      SiegeRangeBonusPercent: 0,
      MarchSizeIncrease: 2.66667,
      RallyCapacity: 0.0,
    },
    Toughness: {
      AllTroopHP: 1.65001,
      MountedHP: 0.15,
      GroundHP: 0.16667,
      SiegeHP: 0.16667,
      RangedHP: 0.16667,
      AllTroopDefense: 1.53501,
      MountedDefense: 1.03500,
      GroundDefense: 0.16667,
      SiegeDefense: 0.16667,
      RangedDefense: 0.16667,
    },
    Preservation: {
      Death2Wounded: 0.25555,
      Death2WoundedWhenAttacking: 0,
      Death2Souls: 0.12555,
      Death2SoulsinMainCity: 0
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 1.63836,
      ReduceEnemyGroundAttack: 0.55500,
      ReduceEnemySiegeAttack: 0.48840,
      ReduceEnemyMountedAttack: 0.42180,
      ReduceEnemyRangedAttack: 0.35520,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 1.75760,
      ReduceEnemyRangedHP: 0.67600,
      ReduceEnemyGroundHP: 0.59150,
      ReduceEnemySiegeHP: 0.50700,
      ReduceEnemyMountedHP: 0.42250, 
      ReduceEnemyAllDefense: 1.75760,
      ReduceEnemyRangedDefense: 0.67600,
      ReduceEnemyGroundDefense: 0.59150,
      ReduceEnemySiegeDefense: 0.50700,
      ReduceEnemyMountedDefense: 0.42250,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 2.21728,
      ReduceEnemyRangedAttack: 0.84000,
      ReduceEnemySiegeAttack: 0.74360,
      ReduceEnemyGroundAttack: 0.64220,
      ReduceEnemyMountedAttack: 0.54080,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 1.34400,
      ReduceEnemyRangedHP: 0.67200,
      ReduceEnemyGroundHP: 0.59150,
      ReduceEnemySiegeHP: 0.50700,
      ReduceEnemyMountedHP: 0.42250,
      ReduceEnemyAllDefense: 1.34400,
      ReduceEnemyRangedDefense: 0.67200,
      ReduceEnemyGroundDefense: 0.59150,
      ReduceEnemySiegeDefense: 0.50700,
      ReduceEnemyMountedDefense: 0.42250  ,
    },
    Debilitation: {
      Wounded2Death: 0.25555,
      InCityWounded2Death: 0,
      Wounded2DeathWhenAttacking: 0,
    }
  }



export const SiegePvPAttackAttributeMultipliers: PvPAttributeMultipliersType = {
  
    Offensive: {
      AllTroopAttack: 3.20733,
      SiegeAttack: 2.87400,
      MountedAttack: 0.11111,
      RangedAttack: 0.11111,
      GroundAttack: 0.11111,
      InBattleMovementBonus: 0,
      RangedRangeBonus: 0,
      SiegeRangeBonusFlat: 0.06000,
      SiegeRangeBonusPercent: 0.50000,
      MarchSizeIncrease: 2.66667,
      RallyCapacity: 0.5,
    },
    Toughness: {
      AllTroopHP: 1.17501,
      SiegeHP: 0.67500,
      MountedHP: 0.16667,
      RangedHP: 0.16667,
      GroundHP: 0.16667,
      AllTroopDefense: 1.10751,
      SiegeDefense: 0.60750,
      MountedDefense: 0.16667,
      RangedDefense: 0.16667,
      GroundDefense: 0.16667,
    },
    Preservation: {
      Death2Wounded: 0.25555,
      Death2WoundedWhenAttacking: 0.12555,
      Death2Souls: 0.12555,
      Death2SoulsinMainCity: 0,
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 2.06640,
      ReduceEnemyMountedAttack: 0.7000,
      ReduceEnemyGroundAttack: 0.61600,
      ReduceEnemySiegeAttack: 0.53200,
      ReduceEnemyRangedAttack: 0.44800,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 1.63800,
      ReduceEnemySiegeHP: 0.56000,
      ReduceEnemyRangedHP: 0.49000,
      ReduceEnemyMountedHP: 0.42000,
      ReduceEnemyGroundHP: 0.35000,
      ReduceEnemyAllDefense: 1.63800,
      ReduceEnemySiegeDefense: 0.56000,
      ReduceEnemyRangedDefense: 0.49000,
      ReduceEnemyMountedDefense: 0.42000,
      ReduceEnemyGroundDefense: 0.35000,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 2.06640,
      ReduceEnemySiegeAttack: 0.7,
      ReduceEnemyMountedAttack: 0.616,
      ReduceEnemyGroundAttack: 0.532,
      ReduceEnemyRangedAttack: 0.448,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 1.63800,
      ReduceEnemySiegeHP: 0.56,
      ReduceEnemyRangedHP: 0.49,
      ReduceEnemyMountedHP: 0.42,
      ReduceEnemyGroundHP: 0.35,
      ReduceEnemyAllDefense: 1.638,
      ReduceEnemySiegeDefense: 0.56,
      ReduceEnemyRangedDefense: 0.49,
      ReduceEnemyMountedDefense: 0.42,
      ReduceEnemyGroundDefense: 0.35,
    },
    Debilitation: {
      Wounded2Death: 0.25555,
      InCityWounded2Death: 0.12555,
      Wounded2DeathWhenAttacking: 0.12555,
    }
  }
  export const SiegePvPReinforcementAttributeMultipliers: PvPAttributeMultipliersType = {

    Offensive: {
      AllTroopAttack: 3.20733,
      SiegeAttack: 2.87400,
      MountedAttack: 0.11111,
      RangedAttack: 0.11111,
      GroundAttack: 0.11111,
      InBattleMovementBonus: 0,
      RangedRangeBonus: 0,
      SiegeRangeBonusFlat: 0.06000,
      SiegeRangeBonusPercent: 0.50000,
      MarchSizeIncrease: 2.66667,
      RallyCapacity: 0.0,
    },
    Toughness: {
      AllTroopHP: 1.17501,
      SiegeHP: 0.67500,
      MountedHP: 0.16667,
      RangedHP: 0.16667,
      GroundHP: 0.16667,
      AllTroopDefense: 1.10751,
      SiegeDefense: 0.60750,
      MountedDefense: 0.16667,
      RangedDefense: 0.16667,
      GroundDefense: 0.16667,
    },
    Preservation: {
      Death2Wounded: 0.25555,
      Death2WoundedWhenAttacking: 0,
      Death2Souls: 0.12555,
      Death2SoulsinMainCity: 0
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: 2.06640,
      ReduceEnemyMountedAttack: 0.7000,
      ReduceEnemyGroundAttack: 0.61600,
      ReduceEnemySiegeAttack: 0.53200,
      ReduceEnemyRangedAttack: 0.44800,
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: 1.63800,
      ReduceEnemySiegeHP: 0.56000,
      ReduceEnemyRangedHP: 0.49000,
      ReduceEnemyMountedHP: 0.42000,
      ReduceEnemyGroundHP: 0.35000,
      ReduceEnemyAllDefense: 1.63800,
      ReduceEnemySiegeDefense: 0.56000,
      ReduceEnemyRangedDefense: 0.49000,
      ReduceEnemyMountedDefense: 0.42000,
      ReduceEnemyGroundDefense: 0.35000,
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: 2.06640,
      ReduceEnemySiegeAttack: 0.7,
      ReduceEnemyMountedAttack: 0.616,
      ReduceEnemyGroundAttack: 0.532,
      ReduceEnemyRangedAttack: 0.448,
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: 1.63800,
      ReduceEnemySiegeHP: 0.56,
      ReduceEnemyRangedHP: 0.49,
      ReduceEnemyMountedHP: 0.42,
      ReduceEnemyGroundHP: 0.35,
      ReduceEnemyAllDefense: 1.638,
      ReduceEnemySiegeDefense: 0.56,
      ReduceEnemyRangedDefense: 0.49,
      ReduceEnemyMountedDefense: 0.42,
      ReduceEnemyGroundDefense: 0.35,
    },
    Debilitation: {
      Wounded2Death: 0.25555,
      InCityWounded2Death: 0,
      Wounded2DeathWhenAttacking: 0,
    }
  }