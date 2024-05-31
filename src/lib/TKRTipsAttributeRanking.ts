import { generalSpecialists } from '@schemas/generalsSchema';
import { z } from 'astro:content';
import * as b from '../schemas/baseSchemas';

export const AttributeMultipliersSchema = z.record(
  b.ActivationSituations,
  z.object({
    Offensive: z.object({
      AllTroopAttack: z.map(generalSpecialists, z.number()),
      GroundAttack: z.map(generalSpecialists, z.number()),
      RangedAttack: z.map(generalSpecialists, z.number()),
      SiegeAttack: z.map(generalSpecialists, z.number()),
      MountedAttack: z.map(generalSpecialists, z.number()),
      InBattleMovementBonus: z.map(generalSpecialists, z.number()),
      RangedRangeBonus: z.map(generalSpecialists, z.number()),
      SiegeRangeBonusFlat: z.map(generalSpecialists, z.number()),
      SiegeRangeBonusPercent: z.map(generalSpecialists, z.number()),
      MarchSizeIncrease: z.map(generalSpecialists, z.number()),
      RallyCapacity: z.map(generalSpecialists, z.number()),
    }),
    Toughness: z.object({
      AllTroopHP: z.map(generalSpecialists, z.number()),
      RangedHP: z.map(generalSpecialists, z.number()),
      MountedHP: z.map(generalSpecialists, z.number()),
      GroundHP: z.map(generalSpecialists, z.number()),
      SiegeHP: z.map(generalSpecialists, z.number()),
      AllTroopDefense: z.map(generalSpecialists, z.number()),
      RangedDefense: z.map(generalSpecialists, z.number()),
      MountedDefense: z.map(generalSpecialists, z.number()),
      SiegeDefense: z.map(generalSpecialists, z.number()),
      GroundDefense: z.map(generalSpecialists, z.number()),
    }),
    Preservation: z.object({
      Death2Wounded: z.map(generalSpecialists, z.number()),
      Death2WoundedWhenAttacking: z.map(generalSpecialists, z.number()),
      Death2Souls: z.map(generalSpecialists, z.number()),
    }),
    AttackingAttackDebuff: z.object({
      ReduceAllAttack: z.map(generalSpecialists, z.number()),
      ReduceEnemyMountedAttack: z.map(generalSpecialists, z.number()),
      ReduceEnemyRangedAttack: z.map(generalSpecialists, z.number()),
      ReduceEnemySiegeAttack: z.map(generalSpecialists, z.number()),
      ReduceEnemyGroundAttack: z.map(generalSpecialists, z.number()),
    }),
    AttackingToughnessDebuff: z.object({
      ReduceEnemyAllHP: z.map(generalSpecialists, z.number()),
      ReduceEnemyRangedHP: z.map(generalSpecialists, z.number()),
      ReduceEnemySiegeHP: z.map(generalSpecialists, z.number()),
      ReduceEnemyMountedHP: z.map(generalSpecialists, z.number()),
      ReduceEnemyGroundHP: z.map(generalSpecialists, z.number()),
      ReduceEnemyAllDefense: z.map(generalSpecialists, z.number()),
      ReduceEnemyRangedDefense: z.map(generalSpecialists, z.number()),
      ReduceEnemySiegeDefense: z.map(generalSpecialists, z.number()),
      ReduceEnemyMountedDefense: z.map(generalSpecialists, z.number()),
      ReduceEnemyGroundDefense: z.map(generalSpecialists, z.number()),
    }),
    ReinforcingAttackDebuff: z.object({
      ReduceAllAttack: z.map(generalSpecialists, z.number()),
      ReduceEnemyMountedAttack: z.map(generalSpecialists, z.number()),
      ReduceEnemyRangedAttack: z.map(generalSpecialists, z.number()),
      ReduceEnemySiegeAttack: z.map(generalSpecialists, z.number()),
      ReduceEnemyGroundAttack: z.map(generalSpecialists, z.number()),
    }),
    ReinforcingToughnessDebuff: z.object({
      ReduceEnemyAllHP: z.map(generalSpecialists, z.number()),
      ReduceEnemyRangedHP: z.map(generalSpecialists, z.number()),
      ReduceEnemySiegeHP: z.map(generalSpecialists, z.number()),
      ReduceEnemyMountedHP: z.map(generalSpecialists, z.number()),
      ReduceEnemyGroundHP: z.map(generalSpecialists, z.number()),
      ReduceEnemyAllDefense: z.map(generalSpecialists, z.number()),
      ReduceEnemyRangedDefense: z.map(generalSpecialists, z.number()),
      ReduceEnemySiegeDefense: z.map(generalSpecialists, z.number()),
      ReduceEnemyMountedDefense: z.map(generalSpecialists, z.number()),
      ReduceEnemyGroundDefense: z.map(generalSpecialists, z.number()),
    }),
    Debilitation: z.object({
      Wounded2Death: z.map(generalSpecialists, z.number()),
      InCityWounded2Death: z.map(generalSpecialists, z.number()),
      Wounded2DeathWhenAttacking: z.map(generalSpecialists, z.number()),
    }),
  })
);
export type AttributeMultipliersSchemaType = z.infer<
  typeof AttributeMultipliersSchema
>;

export const AttributeMultipliers: AttributeMultipliersSchemaType = {
  [b.ActivationSituations.enum['Solo PvP']]: {
    Offensive: {
      AllTroopAttack: new Map([[generalSpecialists.enum.Ground, 1.1]]),
      GroundAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      RangedAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      MountedAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      InBattleMovementBonus: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      MarchSizeIncrease: new Map([[generalSpecialists.enum.Ground, 2]]),
      RallyCapacity: new Map([[generalSpecialists.enum.Ground, 0]]),
      RangedRangeBonus: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeRangeBonusFlat: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeRangeBonusPercent: new Map([[generalSpecialists.enum.Ground, 1]]),
    },
    Toughness: {
      AllTroopHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      RangedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      MountedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      GroundHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      SiegeHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      AllTroopDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      RangedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      MountedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      SiegeDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      GroundDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    Preservation: {
      Death2Wounded: new Map([[generalSpecialists.enum.Ground, 1]]),
      Death2WoundedWhenAttacking: new Map([
        [generalSpecialists.enum.Ground, 1],
      ]),
      Death2Souls: new Map([[generalSpecialists.enum.Ground, 1]]),
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemySiegeHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyGroundHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyAllDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemySiegeDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemyGroundDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyAllDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    Debilitation: {
      Wounded2Death: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      InCityWounded2Death: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      Wounded2DeathWhenAttacking: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
    },
  },
  [b.ActivationSituations.enum['Rally Owner PvP']]: {
    Offensive: {
      AllTroopAttack: new Map([[generalSpecialists.enum.Ground, 1.9]]),
      GroundAttack: new Map([[generalSpecialists.enum.Ground, 1.6]]),
      RangedAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      SiegeAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      MountedAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      InBattleMovementBonus: new Map([[generalSpecialists.enum.Ground, 0.9]]),
      MarchSizeIncrease: new Map([[generalSpecialists.enum.Ground, 2]]),
      RallyCapacity: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      RangedRangeBonus: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      SiegeRangeBonusFlat: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      SiegeRangeBonusPercent: new Map([[generalSpecialists.enum.Ground, 0.5]]),
    },
    Toughness: {
      AllTroopHP: new Map([[generalSpecialists.enum.Ground, 1]]),
      RangedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      MountedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      GroundHP: new Map([[generalSpecialists.enum.Ground, 1.1]]),
      SiegeHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      AllTroopDefense: new Map([[generalSpecialists.enum.Ground, 1]]),
      RangedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      MountedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      SiegeDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      GroundDefense: new Map([[generalSpecialists.enum.Ground, 1.1]]),
    },
    Preservation: {
      Death2Wounded: new Map([[generalSpecialists.enum.Ground, 1]]),
      Death2WoundedWhenAttacking: new Map([
        [generalSpecialists.enum.Ground, 1],
      ]),
      Death2Souls: new Map([[generalSpecialists.enum.Ground, 1]]),
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: new Map([[generalSpecialists.enum.Ground, 0.6]]),
      ReduceEnemyMountedAttack: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemyRangedAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemySiegeAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyGroundAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: new Map([[generalSpecialists.enum.Ground, 0.6]]),
      ReduceEnemyRangedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemySiegeHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyGroundHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyAllDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemySiegeDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemyGroundDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyAllDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    Debilitation: {
      Wounded2Death: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      InCityWounded2Death: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      Wounded2DeathWhenAttacking: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
    },
  },
  [b.ActivationSituations.enum['Rally Participant PvP']]: {
    Offensive: {
      AllTroopAttack: new Map([[generalSpecialists.enum.Ground, 1.1]]),
      GroundAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      RangedAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      MountedAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      InBattleMovementBonus: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      MarchSizeIncrease: new Map([[generalSpecialists.enum.Ground, 2]]),
      RallyCapacity: new Map([[generalSpecialists.enum.Ground, 0]]),
      RangedRangeBonus: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeRangeBonusFlat: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeRangeBonusPercent: new Map([[generalSpecialists.enum.Ground, 1]]),
    },
    Toughness: {
      AllTroopHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      RangedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      MountedHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      GroundHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      SiegeHP: new Map([[generalSpecialists.enum.Ground, 0]]),
      AllTroopDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      RangedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      MountedDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      SiegeDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
      GroundDefense: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    Preservation: {
      Death2Wounded: new Map([[generalSpecialists.enum.Ground, 0]]),
      Death2WoundedWhenAttacking: new Map([
        [generalSpecialists.enum.Ground, 0],
      ]),
      Death2Souls: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    AttackingToughnessDebuff: {
      //conventional wisdomis that only the rally owner's debuffs work. I doubt that, but I'll discount the participant's just in case.
      ReduceEnemyAllHP: new Map([[generalSpecialists.enum.Ground, 0.3]]),
      ReduceEnemyRangedHP: new Map([[generalSpecialists.enum.Ground, 0.3]]),
      ReduceEnemySiegeHP: new Map([[generalSpecialists.enum.Ground, 0.3]]),
      ReduceEnemyMountedHP: new Map([[generalSpecialists.enum.Ground, 0.3]]),
      ReduceEnemyGroundHP: new Map([[generalSpecialists.enum.Ground, 0.3]]),
      ReduceEnemyAllDefense: new Map([[generalSpecialists.enum.Ground, 0.3]]),
      ReduceEnemyRangedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.3],
      ]),
      ReduceEnemySiegeDefense: new Map([[generalSpecialists.enum.Ground, 0.3]]),
      ReduceEnemyMountedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.3],
      ]),
      ReduceEnemyGroundDefense: new Map([
        [generalSpecialists.enum.Ground, 0.3],
      ]),
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyMountedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyRangedAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemySiegeAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
      ReduceEnemyGroundAttack: new Map([[generalSpecialists.enum.Ground, 0]]),
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemySiegeHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyGroundHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyAllDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemySiegeDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemyGroundDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
    },
    Debilitation: {
      Wounded2Death: new Map([[generalSpecialists.enum.Ground, 0]]),
      InCityWounded2Death: new Map([[generalSpecialists.enum.Ground, 0]]),
      Wounded2DeathWhenAttacking: new Map([
        [generalSpecialists.enum.Ground, 0],
      ]),
    },
  },

  [b.ActivationSituations.enum['Reinforcement of Others']]: {
    Offensive: {
      AllTroopAttack: new Map([[generalSpecialists.enum.Ground, 1.1]]),
      GroundAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      RangedAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      MountedAttack: new Map([[generalSpecialists.enum.Ground, 1]]),
      InBattleMovementBonus: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      MarchSizeIncrease: new Map([[generalSpecialists.enum.Ground, 2]]),
      RallyCapacity: new Map([[generalSpecialists.enum.Ground, 0]]),
      RangedRangeBonus: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeRangeBonusFlat: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeRangeBonusPercent: new Map([[generalSpecialists.enum.Ground, 1]]),
    },
    Toughness: {
      AllTroopHP: new Map([[generalSpecialists.enum.Ground, 2]]),
      RangedHP: new Map([[generalSpecialists.enum.Ground, 1]]),
      MountedHP: new Map([[generalSpecialists.enum.Ground, 1]]),
      GroundHP: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeHP: new Map([[generalSpecialists.enum.Ground, 1]]),
      AllTroopDefense: new Map([[generalSpecialists.enum.Ground, 1]]),
      RangedDefense: new Map([[generalSpecialists.enum.Ground, 1]]),
      MountedDefense: new Map([[generalSpecialists.enum.Ground, 1]]),
      SiegeDefense: new Map([[generalSpecialists.enum.Ground, 1]]),
      GroundDefense: new Map([[generalSpecialists.enum.Ground, 1]]),
    },
    Preservation: {
      Death2Wounded: new Map([[generalSpecialists.enum.Ground, 0.4]]),
      Death2WoundedWhenAttacking: new Map([
        [generalSpecialists.enum.Ground, 0.4],
      ]),
      Death2Souls: new Map([[generalSpecialists.enum.Ground, 0.4]]),
    },
    AttackingAttackDebuff: {
      ReduceAllAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedAttack: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemyRangedAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemySiegeAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyGroundAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
    },
    AttackingToughnessDebuff: {
      ReduceEnemyAllHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemySiegeHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyGroundHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyAllDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemySiegeDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemyGroundDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
    },
    ReinforcingAttackDebuff: {
      ReduceAllAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedAttack: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemyRangedAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemySiegeAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyGroundAttack: new Map([[generalSpecialists.enum.Ground, 0.5]]),
    },
    ReinforcingToughnessDebuff: {
      ReduceEnemyAllHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemySiegeHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyGroundHP: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyAllDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyRangedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemySiegeDefense: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      ReduceEnemyMountedDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
      ReduceEnemyGroundDefense: new Map([
        [generalSpecialists.enum.Ground, 0.5],
      ]),
    },
    Debilitation: {
      Wounded2Death: new Map([[generalSpecialists.enum.Ground, 0.5]]),
      InCityWounded2Death: new Map([[generalSpecialists.enum.Ground, 0]]),
      Wounded2DeathWhenAttacking: new Map([
        [generalSpecialists.enum.Ground, 0],
      ]),
    },
  },
};
