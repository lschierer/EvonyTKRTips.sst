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
import { DEBUG_GBUFF, DEBUG } from "../EvAnsScoreComputer";

export const GroundPvPBuff = z
  .function()
  .args(z.string(), z.string(), Buff, BuffParams)
  .returns(z.number())
  .implement((buffName: string, generalName: string, tb: BuffType, bp: BuffParamsType) => {
    let score = 0;
    if (tb !== undefined && tb.value !== undefined) {
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
          tb.condition.includes(
            Condition.enum.When_City_Mayor_for_this_SubCity
          ) ||
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

      //check if it is a all troop buff (all class buff)
      if (tb.class === undefined || tb.class === null) {
        if (DEBUG_GBUFF) {
          console.log(`buff ${buffName} for ${generalName} check for no class`);
        }
        //this is an all class buff
        if (tb.attribute !== undefined) {
          if (DEBUG_GBUFF) {
            console.log(`buff ${buffName} for ${generalName} check for no attribute`);
          }
          if (!tb.attribute.localeCompare(Attribute.enum.March_Size_Capacity)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                  .MarchSizeIncrease ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Attack)) {
            if (tb.condition !== undefined && tb.condition !== null) {
              if (tb.condition.includes(Condition.enum.Enemy) ||
                tb.condition.includes(Condition.enum.Enemy_In_City) ||
                tb.condition.includes(Condition.enum.Reduces_Enemy) ||
                tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
                tb.condition.includes(
                  Condition.enum.Reduces_Enemy_with_a_Dragon
                )) {
                if (tb.value !== undefined && tb.value !== null) {
                  if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                    const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]
                      ?.AttackingAttackDebuff.ReduceAllAttack ?? 0;
                    const additional = tb.value.number * multiplier;
                    if (DEBUG_GBUFF) {
                      console.log(
                        `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                      );
                    }
                    score = score + additional;
                  }
                }
              }
            } else {
              if (tb.value !== undefined && tb.value !== null) {
                if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                  const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                    .AllTroopAttack ?? 0;
                  const additional = tb.value.number * multiplier;
                  if (DEBUG_GBUFF) {
                    console.log(
                      `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                    );
                  }
                  score = score + additional;
                }
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Rally_Capacity)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                  .RallyCapacity ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Defense)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .AllTroopDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.HP)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .AllTroopHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Death_to_Wounded)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                if (tb.condition !== undefined && tb.condition !== null) {
                  if (tb.condition.includes(Condition.enum.Attacking) ||
                    tb.condition.includes(Condition.enum.Marching) ||
                    tb.condition.includes(
                      Condition.enum.leading_the_army_to_attack
                    ) ||
                    tb.condition.includes(
                      Condition.enum.brings_dragon_or_beast_to_attack
                    ) ||
                    tb.condition.includes(Condition.enum.dragon_to_the_attack)) {
                    const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]
                      ?.Preservation.Death2WoundedWhenAttacking ?? 0;
                    const additional = tb.value.number * multiplier;
                    if (DEBUG_GBUFF) {
                      console.log(
                        `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                      );
                    }
                    score = score + additional;
                  }
                } else {
                  const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]
                    ?.Preservation.Death2Wounded ?? 0;
                  const additional = tb.value.number * multiplier;
                  if (DEBUG_GBUFF) {
                    console.log(
                      `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                    );
                  }
                  score = score + additional;
                }
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Death_to_Soul)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Preservation
                  .Death2Souls ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if ( //while this sometimes has conditions, they all apply to attackng PvP. 
            !tb.attribute.localeCompare(Attribute.enum.Wounded_to_Death)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Debilitation
                  .Wounded2Death ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          }
        } else {
          console.log(
            `how to score a buff with no attribute also? gc is ${generalName}`
          );
        }
      } else if (!tb.class.localeCompare(ClassEnum.enum.Ground)) {
        if (tb.attribute !== undefined) {
          if (!tb.attribute.localeCompare(Attribute.enum.Attack)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                  .GroundAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }

                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Defense)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .GroundDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.HP)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .GroundHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          }
        } else {
          //deal with no attribute case
        }
      } else if (!tb.class.localeCompare(ClassEnum.enum.Archers)) {
        if (tb.attribute !== undefined) {
          if (!tb.attribute.localeCompare(Attribute.enum.Attack)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                  .RangedAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }

                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Defense)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .RangedDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.HP)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .RangedHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          }
        } else {
          //deal with no attribute case
        }
      } else if (!tb.class.localeCompare(ClassEnum.enum.Siege)) {
        if (tb.attribute !== undefined) {
          if (!tb.attribute.localeCompare(Attribute.enum.Attack)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                  .SiegeAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }

                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Defense)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .SiegeDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.HP)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .SiegeHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          }
        } else {
          //deal with no attribute case
        }
      } else if (!tb.class.localeCompare(ClassEnum.enum.Mounted)) {
        if (tb.attribute !== undefined) {
          if (!tb.attribute.localeCompare(Attribute.enum.Attack)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                  .MountedAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }

                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Defense)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .MountedDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.HP)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier = GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                  .MountedHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          }
        } else {
          //deal with no attribute case
        }
      } else {
        //occasionally a general has entirely unrelated buffs.
        console.log(`not using buff from ${buffName} from ${generalName}`);
        console.log(`unused buff is ${JSON.stringify(tb)}`);
      }
    } else {
      console.log(`how to score a buff with no value? gc is ${generalName}`);
    }
    return score;
  });