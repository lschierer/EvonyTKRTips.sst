import { z } from "astro:content";
import {
  Attribute,
  Buff,
  Condition, ClassEnum,
  UnitSchema,
  type BuffType, BuffParams,
  type BuffParamsType
} from "@schemas/index";
import { GroundPvPAttributeMultipliers } from "@lib/EvAnsAttributeRanking";

const DEBUG_GBUFF = true
const DEBUG = true

export const GroundPvPBuff = z
  .function()
  .args(z.string(), z.string(), Buff, BuffParams)
  .returns(z.number())
  .implement((buffName: string, generalName: string, tb: BuffType, bp: BuffParamsType) => {
    let score = 0;
    if (tb?.value === undefined || tb.value === null) {
      console.log(`how to score a buff with no value? gc is ${generalName}`)
      return score;
    } else {
      if (DEBUG_GBUFF) {
        console.log(`buff ${buffName} for ${generalName} check for value`);
      }
      //check if buff has some conditions that never work for PvP
      if (tb.condition !== undefined && tb.condition !== null) {
        if (DEBUG_GBUFF) {
          console.log(`buff ${buffName} for ${generalName} check for no condition`);
        }
        if (tb.condition.includes(Condition.enum["Against Monsters"]) ||
          tb.condition.includes(Condition.enum.Reduces_Monster) ||
          tb.condition.includes(Condition.enum.In_Main_City) ||
          tb.condition.includes(Condition.enum.Reinforcing) ||
          tb.condition.includes(Condition.enum.When_Defending_Outside_The_Main_City) ||
          tb.condition.includes(Condition.enum.When_City_Mayor) ||
          tb.condition.includes(Condition.enum.When_City_Mayor_for_this_SubCity) ||
          tb.condition.includes(Condition.enum.When_Not_Mine) ||
          tb.condition.includes(Condition.enum.When_an_officer)) {
          //none of These apply to PvP attacking
          if (DEBUG) {
            console.log(
              `buff ${buffName} for ${generalName} with inapplicable attribute `
            );
            console.log(JSON.stringify(tb));
          }
          return 0;
        }

        //check for dragon and beast buffs
        if ((tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon) ||
          tb.condition.includes(Condition.enum.brings_a_dragon) ||
          tb.condition.includes(Condition.enum.dragon_to_the_attack)) &&
          bp.dragon !== true) {
          return 0;
        }
        if ((tb.condition.includes(Condition.enum.brings_dragon_or_beast_to_attack)) &&
          (!(bp.dragon === true ||
            bp.beast === true))) {
          return 0;
        }
      }
      if (tb.class === undefined || tb.class === null || !ClassEnum.enum.all.localeCompare(tb.class)) {
        //dragon and beast conditions are checked, no need to worry about them.
        //if we get here, it is an All Troop buff type.
        if (DEBUG_GBUFF) {
          console.log(`buff ${buffName} for ${generalName} is All Troop class`)
        }
        if (tb.attribute === undefined || tb.attribute === null) {
          console.log(
            `how to score a buff with no attribute also? gc is ${generalName}`
          );
          return score;
        } else {
          if (!Attribute.enum.March_Size_Capacity.localeCompare(tb.attribute)) {
            if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
              const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive.MarchSizeIncrease ?? 0;
              const additional = tb.value.number * multiplier;
              if (DEBUG_GBUFF) {
                console.log(
                  `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                );
              }
              score += additional
            }
          } else if (!Attribute.enum.Death_to_Soul.localeCompare(tb.attribute)) {
            if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
              const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Preservation.Death2Souls ?? 0;
              const additional = tb.value.number * multiplier;
              if (DEBUG_GBUFF) {
                console.log(
                  `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                );
              }
              score += additional
            }
          } else if (!Attribute.enum.Death_to_Wounded.localeCompare(tb.attribute)) {
            //I do not need to worry about the "when attacking" condition you sometimes see - both apply the same for this file
            if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
              const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Preservation.Death2Wounded ?? 0;
              const additional = tb.value.number * multiplier;
              if (DEBUG_GBUFF) {
                console.log(
                  `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                );
              }
              score += additional
            }
          } else if (!Attribute.enum.Attack.localeCompare(tb.attribute)) {
            if(DEBUG_GBUFF) {
              console.log(`GroundPvPBuff: ${buffName} from ${generalName} matched attack`)
            }
            if (tb.condition !== undefined && tb.condition !== null && (
              tb.condition.includes(Condition.enum.Enemy) ||
              tb.condition.includes(Condition.enum.Enemy_In_City) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon)
            )) {
              if(DEBUG_GBUFF){
                console.log(`GroundPvPBuff: ${buffName} from ${generalName} matched debuff`)
              }
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                if(DEBUG_GBUFF){
                  console.log(`GroundPvPBuff: ${buffName} from ${generalName} matched percentage`)
                }
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingAttackDebuff.ReduceAllAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            } else {
              //I think all other conditions that matter have been checked
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive.AllTroopAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            }
          } else if (!Attribute.enum.Defense.localeCompare(tb.attribute)) {
            if (tb.condition !== undefined && tb.condition !== null && (
              tb.condition.includes(Condition.enum.Enemy) ||
              tb.condition.includes(Condition.enum.Enemy_In_City) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon)
            )) {
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemyAllDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            } else {
              //I think all other conditions that matter have been checked
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.AllTroopDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            }
          } else if (!Attribute.enum.HP.localeCompare(tb.attribute)) {
            if (tb.condition !== undefined && tb.condition !== null && (
              tb.condition.includes(Condition.enum.Enemy) ||
              tb.condition.includes(Condition.enum.Enemy_In_City) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon)
            )) {
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemyAllHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            } else {
              //I think all other conditions that matter have been checked
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.AllTroopHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            }
          }
        }
      } else {
        //there is a class attribute that matters
        if (tb.attribute === undefined || tb.attribute === null) {
          console.log(
            `how to score a buff with no attribute also? gc is ${generalName}`
          );
          return score;
        } else {
          if (!Attribute.enum.Attack.localeCompare(tb.attribute)) {
            if (tb.condition !== undefined && tb.condition !== null && (
              tb.condition.includes(Condition.enum.Enemy) ||
              tb.condition.includes(Condition.enum.Enemy_In_City) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon)
            )) {
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                let multiplier = 0;
                if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingAttackDebuff.ReduceEnemyGroundAttack ?? 0;
                } else if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingAttackDebuff.ReduceEnemyRangedAttack ?? 0;
                } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingAttackDebuff.ReduceEnemyMountedAttack ?? 0;
                } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingAttackDebuff.ReduceEnemySiegeAttack ?? 0;
                }
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            } else {
              //I think all other conditions that matter have been checked
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                let multiplier = 0;
                if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive.GroundAttack ?? 0;
                } else if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive.RangedAttack ?? 0;
                } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive.MountedAttack ?? 0;
                } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive.SiegeAttack ?? 0;
                }
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            }
          } else if (!Attribute.enum.Defense.localeCompare(tb.attribute)) {

            if (tb.condition !== undefined && tb.condition !== null && (
              tb.condition.includes(Condition.enum.Enemy) ||
              tb.condition.includes(Condition.enum.Enemy_In_City) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon)
            )) {
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                let multiplier = 0;
                if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemyGroundDefense ?? 0;
                } else if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemyRangedDefense ?? 0;
                } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemyMountedDefense ?? 0;
                } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemySiegeDefense ?? 0;
                }
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            } else {
              //I think all other conditions that matter have been checked
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                let multiplier = 0;
                if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.GroundDefense ?? 0;
                } else if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.RangedDefense ?? 0;
                } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.RangedDefense ?? 0;
                } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.SiegeDefense ?? 0;
                }
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            }
          } else if (!Attribute.enum.HP.localeCompare(tb.attribute)) {
            if (tb.condition !== undefined && tb.condition !== null && (
              tb.condition.includes(Condition.enum.Enemy) ||
              tb.condition.includes(Condition.enum.Enemy_In_City) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
              tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon)
            )) {
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                let multiplier = 0;
                if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemyGroundHP ?? 0;
                } else if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemyRangedHP ?? 0;
                } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemyMountedHP ?? 0;
                } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.AttackingToughnessDebuff.ReduceEnemySiegeHP ?? 0;
                }
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            } else {
              //I think all other conditions that matter have been checked
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                let multiplier = 0;
                if (!ClassEnum.enum.Ground.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.GroundHP ?? 0;
                } else if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.RangedHP ?? 0;
                } else if (!ClassEnum.enum.Mounted.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.RangedHP ?? 0;
                } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
                  multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness.SiegeHP ?? 0;
                }
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score += additional
              }
            }
          } else if (!Attribute.enum.Range.localeCompare(tb.attribute)) {

            let multiplier = 0;
            if (!ClassEnum.enum.Archers.localeCompare(tb.class)) {
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive.RangedRangeBonus ?? 0;

              }
            } else if (!ClassEnum.enum.Siege.localeCompare(tb.class)) {
              if (!UnitSchema.enum.percentage.localeCompare(tb.value.unit)) {
                multiplier = GroundPvPAttributeMultipliers['Rally Owner PvP']?.Offensive.SiegeRangeBonusPercent ?? 0;
              } else {
                multiplier = GroundPvPAttributeMultipliers['Rally Owner PvP']?.Offensive.SiegeRangeBonusFlat ?? 0;
              }
            }
            const additional = tb.value.number * multiplier
            if (DEBUG_GBUFF) {
              console.log(
                `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
              );
            }
            score += additional
          }
        }
      }
      return score;
    }
  });
