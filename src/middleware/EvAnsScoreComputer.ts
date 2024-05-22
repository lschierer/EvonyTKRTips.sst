import { type CollectionEntry, getEntry, z } from "astro:content";
import {
  Attribute,
  Buff,
  Condition,
  Display,
  generalUseCase,
  generalSpecialists,
  PvPAttributeMultipliers,
  ScoreWeightings,
  type ExtendedGeneralType,
  type generalUseCaseType,
  type generalSpecialistsType,
  type specialSkillBookType,
  ExtendedGeneral,
  ExtendedGeneralStatus,
  specialSkillBook,
  Speciality,
  ClassEnum,
  UnitSchema,
  type BuffType,
  SpecialityLevel,
  type SpecialityType,
  type SpecialityLevelType,
  BuffParams,
  type BuffParamsType,
  qualityColor,
  AscendingLevels,
  type qualityColorType,
} from "@schemas/index";

import { GroundPvPAttributeMultipliers } from "@lib/EvAnsAttributeRanking";
import { number } from "astro/zod";
import { specialty } from "src/assets/evonySchemas";

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

const DEBUG = true;
const DEBUG_BAS = false;
const DEBUG_BSS = true;

const EvAnsBasic = z
  .function()
  .args(ExtendedGeneral)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType) => {
    const gc = eg.general;

    const BasicAttack =
      gc.attack + 45 * gc.attack_increment < 900
        ? (gc.attack + 45 * gc.attack_increment) * 0.1
        : 90 + (gc.attack + 45 * gc.attack_increment - 900) * 0.2;
    const BasicDefense =
      gc.defense + 45 * gc.defense_increment < 900
        ? (gc.defense + 45 * gc.defense_increment) * 0.1
        : 90 + (gc.defense + 45 * gc.defense_increment - 900) * 0.2;
    const BasicLeaderShip =
      gc.leadership + 45 * gc.leadership_increment < 900
        ? (gc.leadership + 45 * gc.leadership_increment) * 0.1
        : 90 + (gc.leadership + 45 * gc.leadership_increment - 900) * 0.2;
    const BasicPolitics =
      gc.politics + 45 * gc.politics_increment < 900
        ? (gc.politics + 45 * gc.politics_increment) * 0.1
        : 90 + (gc.politics + 45 * gc.politics_increment - 900) * 0.2;
    const BAS = BasicAttack + BasicDefense + BasicLeaderShip + BasicPolitics;
    if (DEBUG_BAS) {
      console.log(`BasicAttack: ${BasicAttack} for ${eg.general.name}`);
      console.log(`BasicDefense: ${BasicDefense} for ${eg.general.name}`);
      console.log(`BasicLeaderShip: ${BasicLeaderShip} for ${eg.general.name}`);
      console.log(`BasicPolitics: ${BasicPolitics} for ${eg.general.name}`);
      console.log(`BAS: ${BAS} for: ${eg.general.name}`);
    }
    return Math.floor(BAS);
  });

const GroundPvPBuff = z
  .function()
  .args(z.string(), z.string(), Buff)
  .returns(z.number())
  .implement((buffName: string, generalName: string, tb: BuffType) => {
    let score = 0;
    if (tb !== undefined && tb.value !== undefined) {
      //check if buff has some conditions that never work for PvP
      if (tb.condition !== undefined && tb.condition !== null) {
        if (
          tb.condition.includes(Condition.enum["Against Monsters"]) ||
          tb.condition.includes(Condition.enum.Reduces_Monster) ||
          tb.condition.includes(Condition.enum.In_Main_City) ||
          tb.condition.includes(Condition.enum.In_City) ||
          tb.condition.includes(Condition.enum.Reinforcing) ||
          tb.condition.includes(Condition.enum.When_City_Mayor) ||
          tb.condition.includes(
            Condition.enum.When_City_Mayor_for_this_SubCity
          ) ||
          tb.condition.includes(Condition.enum.When_Not_Mine) ||
          tb.condition.includes(Condition.enum.When_an_officer)
        ) {
          //none of These apply to PvP attacking
          if (DEBUG) {
            console.log(
              `buff ${buffName} for ${generalName} with inapplicable attribute `
            );
            console.log(JSON.stringify(tb));
          }
          return 0;
        }
      }

      //check if it is a all troop buff (all class buff)
      if (tb.class === undefined || tb.class === null) {
        //this is an all class buff
        if (tb.attribute !== undefined) {
          if (!tb.attribute.localeCompare(Attribute.enum.March_Size_Capacity)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                    .MarchSizeIncrease ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (!tb.attribute.localeCompare(Attribute.enum.Attack)) {
            if (tb.condition !== undefined && tb.condition !== null) {
              if (
                tb.condition.includes(Condition.enum.Enemy) ||
                tb.condition.includes(Condition.enum.Enemy_In_City) ||
                tb.condition.includes(Condition.enum.Reduces_Enemy) ||
                tb.condition.includes(Condition.enum.Reduces_Enemy_in_Attack) ||
                tb.condition.includes(
                  Condition.enum.Reduces_Enemy_with_a_Dragon
                )
              ) {
                if (tb.value !== undefined && tb.value !== null) {
                  if (
                    !tb.value.unit.localeCompare(UnitSchema.enum.percentage)
                  ) {
                    const multiplier =
                      GroundPvPAttributeMultipliers["Rally Owner PvP"]
                        ?.AttackingAttackDebuff.ReduceAllAttack ?? 0;
                    const additional = tb.value.number * multiplier;
                    if (DEBUG_BSS) {
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
                  const multiplier =
                    GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                      .AllTroopAttack ?? 0;
                  const additional = tb.value.number * multiplier;
                  if (DEBUG_BSS) {
                    console.log(
                      `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                    );
                  }
                  score = score + additional;
                }
              }
            }
          } else if (
            !tb.attribute.localeCompare(Attribute.enum.Rally_Capacity)
          ) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                    .RallyCapacity ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .AllTroopDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .AllTroopHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if (
            !tb.attribute.localeCompare(Attribute.enum.Death_to_Wounded)
          ) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                if (tb.condition !== undefined && tb.condition !== null) {
                  if (
                    tb.condition.includes(Condition.enum.Attacking) ||
                    tb.condition.includes(Condition.enum.Marching) ||
                    tb.condition.includes(
                      Condition.enum.leading_the_army_to_attack
                    ) ||
                    tb.condition.includes(
                      Condition.enum.brings_dragon_or_beast_to_attack
                    ) ||
                    tb.condition.includes(Condition.enum.dragon_to_the_attack)
                  ) {
                    const multiplier =
                      GroundPvPAttributeMultipliers["Rally Owner PvP"]
                        ?.Preservation.Death2WoundedWhenAttacking ?? 0;
                    const additional = tb.value.number * multiplier;
                    if (DEBUG_BSS) {
                      console.log(
                        `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                      );
                    }
                    score = score + additional;
                  }
                } else {
                  const multiplier =
                    GroundPvPAttributeMultipliers["Rally Owner PvP"]
                      ?.Preservation.Death2Wounded ?? 0;
                  const additional = tb.value.number * multiplier;
                  if (DEBUG_BSS) {
                    console.log(
                      `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                    );
                  }
                  score = score + additional;
                }
              }
            }
          } else if (
            !tb.attribute.localeCompare(Attribute.enum.Death_to_Soul)
          ) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Preservation
                    .Death2Souls ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                    .GroundAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .GroundDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .GroundHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                    .RangedAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .RangedDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .RangedHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                    .SiegeAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .SiegeDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .SiegeHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
                    .MountedAttack ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .MountedDefense ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
                    .MountedHP ?? 0;
                const additional = tb.value.number * multiplier;
                if (DEBUG_BSS) {
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

const GroundAttackPvPBSS = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    const gc = eg.general;
    let BSS_Score = 0;

    //I will assume you set the bp to disabled if it is an assistant.
    if (bp.stars.localeCompare(AscendingLevels.enum[0])) {
      if (!Array.isArray(eg.general.ascending)) {
        console.log(`${eg.general.name} is not ascended`);
        return -11;
      }
      const ascending_score = eg.general.ascending.reduce((accumulator, ab, index) => {
        if(DEBUG_BSS){
          console.log(`${gc.name}: Ascending ${index}`)
        }
        if(eg.general.stars === undefined ||
          eg.general.stars === null ||
          !eg.general.stars.localeCompare(AscendingLevels.enum[0])
        ) {
          return 0
        } else {
          if(DEBUG_BSS) {
            console.log(`${index} starting detection`)
          }
          if(ab.buff !== undefined &&
            ab.buff !== null) {
              const v = Buff.safeParse(ab.buff);
              if (v.success) { 
                const actual = v.data;
                if (
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) &&
                  !ab.level.localeCompare(AscendingLevels.enum[10])) {  
                  const tbscore = GroundPvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual
                  );
                  if (DEBUG_BSS) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[9])) {  
                  const tbscore = GroundPvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual
                  );
                  if (DEBUG_BSS) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[8])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[8])) {  
                  const tbscore = GroundPvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual
                  );
                  if (DEBUG_BSS) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore;
                }
              }
            }
          
          }
        }
      }, 0)
      eg.general.ascending.map((ab, index) => {
        if (DEBUG_BSS) {
          console.log(`${gc.name}: Ascending ${index}`);
        }
        if (
          eg.general.stars === undefined ||
          eg.general.stars === null ||
          !eg.general.stars.localeCompare(AscendingLevels.enum[0])
        ) {
          //general is not assencded.
          if (DEBUG_BSS) {
            console.log(`${gc.name} is not ascended in map`);
          }
        } else {
          if (DEBUG_BSS) {
            console.log(`${gc.name}: Asending ${index} starting detection`);
          }
           else if (
            (!eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[9])) &&
            !ab.level.localeCompare(AscendingLevels.enum[9])
          ) {
            const v = z.array(Buff).safeParse(ab.buff);
            if (v.success) {
              const barray = v.data;
              for (const actual of barray) {
                const gname = eg.general.name;
                const oldscore = BSS_Score;
                const tbscore = GroundPvPBuff(
                  `Star ${index} ${ab.level}`,
                  gname,
                  actual
                );
                BSS_Score += tbscore;
                if (DEBUG_BSS) {
                  console.log(
                    `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                  );
                }
              }
            } else {
              console.log(`not a buff array`);
            }
          } else if (
            (!eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[8])) &&
            !ab.level.localeCompare(AscendingLevels.enum[8])
          ) {
            const v = z.array(Buff).safeParse(ab.buff);
            if (v.success) {
              const barray = v.data;
              for (const actual of barray) {
                const gname = eg.general.name;
                const oldscore = BSS_Score;
                const tbscore = GroundPvPBuff(
                  `Star ${index} ${ab.level}`,
                  gname,
                  actual
                );
                BSS_Score += tbscore;
                if (DEBUG_BSS) {
                  console.log(
                    `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                  );
                }
              }
            } else {
              console.log(`not a buff array`);
            }
          } else if (
            (!eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[8]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[7])) &&
            !ab.level.localeCompare(AscendingLevels.enum[7])
          ) {
            const v = z.array(Buff).safeParse(ab.buff);
            if (v.success) {
              const barray = v.data;
              for (const actual of barray) {
                const gname = eg.general.name;
                const oldscore = BSS_Score;
                const tbscore = GroundPvPBuff(
                  `Star ${index} ${ab.level}`,
                  gname,
                  actual
                );
                BSS_Score += tbscore;
                if (DEBUG_BSS) {
                  console.log(
                    `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                  );
                }
              }
            } else {
              console.log(`not a buff array`);
            }
          } else if (
            (!eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[8]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[7]) ||
              !eg.general.stars.localeCompare(AscendingLevels.enum[6])) &&
            !ab.level.localeCompare(AscendingLevels.enum[6])
          ) {
            const v = z.array(Buff).safeParse(ab.buff);
            if (v.success) {
              const barray = v.data;
              for (const actual of barray) {
                const gname = eg.general.name;
                const oldscore = BSS_Score;
                const tbscore = GroundPvPBuff(
                  `Star ${index} ${ab.level}`,
                  gname,
                  actual
                );
                BSS_Score += tbscore;
                if (DEBUG_BSS) {
                  console.log(
                    `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                  );
                }
              }
            } else {
              console.log(`not a buff array`);
            }
          } else {
            console.log(`matched nothing`);
            console.log(`stars: ${eg.general.stars}`);
            console.log(`buff Level: ${ab.level}`);
          }
        }
      });
    }

    if (
      eg.books !== undefined &&
      Array.isArray(eg.books) &&
      eg.books.length > 0
    ) {
      eg.books.map((book) => {
        if (book !== undefined) {
          const v = specialSkillBook.safeParse(book);
          if (v.success) {
            const bisb: specialSkillBookType = v.data;
            for (const tb of bisb.buff) {
              const oldscore = BSS_Score;
              const tbscore = GroundPvPBuff(bisb.name, gc.name, tb);
              BSS_Score += tbscore;
              if (DEBUG_BSS) {
                console.log(
                  `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                );
              }
            }
          }
        }
      });
      BSS_Score = Math.floor(BSS_Score);
    }

    if (
      eg.specialities !== undefined &&
      Array.isArray(eg.specialities) &&
      eg.specialities.length > 0
    ) {
      eg.specialities.map((special, index) => {
        if (special !== undefined) {
          const v = Speciality.safeParse(special);
          if (v.success) {
            const specialB: SpecialityType = v.data;
            for (const sl of specialB.attribute) {
              if (
                (sl.level.localeCompare(qualityColor.enum.Green) &&
                  bp.special1.localeCompare(qualityColor.enum.Disabled) &&
                  index === 0) ||
                (sl.level.localeCompare(qualityColor.enum.Green) &&
                  bp.special2.localeCompare(qualityColor.enum.Disabled) &&
                  index === 1) ||
                (sl.level.localeCompare(qualityColor.enum.Green) &&
                  bp.special3.localeCompare(qualityColor.enum.Disabled) &&
                  index === 2) ||
                (sl.level.localeCompare(qualityColor.enum.Green) &&
                  bp.special4.localeCompare(qualityColor.enum.Disabled) &&
                  index === 3) ||
                (sl.level.localeCompare(qualityColor.enum.Green) &&
                  bp.special5.localeCompare(qualityColor.enum.Disabled) &&
                  index === 4)
              ) {
                for (const tb of sl.buff) {
                  const oldscore = BSS_Score;
                  const tbscore = GroundPvPBuff(specialB.name, gc.name, tb);
                  BSS_Score += tbscore;
                  if (DEBUG_BSS) {
                    console.log(
                      `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                    );
                  }
                }
              } else if (
                (sl.level.localeCompare(qualityColor.enum.Blue) &&
                  bp.special1.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special1.localeCompare(qualityColor.enum.Green) &&
                  index === 0) ||
                (sl.level.localeCompare(qualityColor.enum.Blue) &&
                  bp.special2.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special2.localeCompare(qualityColor.enum.Green) &&
                  index === 1) ||
                (sl.level.localeCompare(qualityColor.enum.Blue) &&
                  bp.special3.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special3.localeCompare(qualityColor.enum.Green) &&
                  index === 2) ||
                (sl.level.localeCompare(qualityColor.enum.Blue) &&
                  bp.special4.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special4.localeCompare(qualityColor.enum.Green) &&
                  index === 3) ||
                (sl.level.localeCompare(qualityColor.enum.Blue) &&
                  bp.special5.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special5.localeCompare(qualityColor.enum.Green) &&
                  index === 4)
              ) {
                for (const tb of sl.buff) {
                  const oldscore = BSS_Score;
                  const tbscore = GroundPvPBuff(specialB.name, gc.name, tb);
                  BSS_Score += tbscore;
                  if (DEBUG_BSS) {
                    console.log(
                      `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                    );
                  }
                }
              } else if (
                (sl.level.localeCompare(qualityColor.enum.Purple) &&
                  bp.special1.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special1.localeCompare(qualityColor.enum.Green) &&
                  bp.special1.localeCompare(qualityColor.enum.Blue) &&
                  index === 0) ||
                (sl.level.localeCompare(qualityColor.enum.Purple) &&
                  bp.special2.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special2.localeCompare(qualityColor.enum.Green) &&
                  bp.special2.localeCompare(qualityColor.enum.Blue) &&
                  index === 1) ||
                (sl.level.localeCompare(qualityColor.enum.Purple) &&
                  bp.special3.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special3.localeCompare(qualityColor.enum.Green) &&
                  bp.special3.localeCompare(qualityColor.enum.Blue) &&
                  index === 2) ||
                (sl.level.localeCompare(qualityColor.enum.Purple) &&
                  bp.special4.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special4.localeCompare(qualityColor.enum.Green) &&
                  bp.special4.localeCompare(qualityColor.enum.Blue) &&
                  index === 3) ||
                (sl.level.localeCompare(qualityColor.enum.Purple) &&
                  bp.special5.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special5.localeCompare(qualityColor.enum.Green) &&
                  bp.special5.localeCompare(qualityColor.enum.Blue) &&
                  index === 4)
              ) {
                for (const tb of sl.buff) {
                  const oldscore = BSS_Score;
                  const tbscore = GroundPvPBuff(specialB.name, gc.name, tb);
                  BSS_Score += tbscore;
                  if (DEBUG_BSS) {
                    console.log(
                      `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                    );
                  }
                }
              } else if (
                (sl.level.localeCompare(qualityColor.enum.Orange) &&
                  bp.special1.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special1.localeCompare(qualityColor.enum.Green) &&
                  bp.special1.localeCompare(qualityColor.enum.Blue) &&
                  bp.special1.localeCompare(qualityColor.Enum.Purple) &&
                  index === 0) ||
                (sl.level.localeCompare(qualityColor.enum.Orange) &&
                  bp.special2.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special2.localeCompare(qualityColor.enum.Green) &&
                  bp.special2.localeCompare(qualityColor.enum.Blue) &&
                  bp.special2.localeCompare(qualityColor.Enum.Purple) &&
                  index === 1) ||
                (sl.level.localeCompare(qualityColor.enum.Orange) &&
                  bp.special3.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special3.localeCompare(qualityColor.enum.Green) &&
                  bp.special3.localeCompare(qualityColor.enum.Blue) &&
                  bp.special3.localeCompare(qualityColor.Enum.Purple) &&
                  index === 2) ||
                (sl.level.localeCompare(qualityColor.enum.Orange) &&
                  bp.special4.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special4.localeCompare(qualityColor.enum.Green) &&
                  bp.special4.localeCompare(qualityColor.enum.Blue) &&
                  bp.special4.localeCompare(qualityColor.Enum.Purple) &&
                  index === 3) ||
                (sl.level.localeCompare(qualityColor.enum.Orange) &&
                  bp.special5.localeCompare(qualityColor.enum.Disabled) &&
                  bp.special5.localeCompare(qualityColor.enum.Green) &&
                  bp.special5.localeCompare(qualityColor.enum.Blue) &&
                  bp.special5.localeCompare(qualityColor.Enum.Purple) &&
                  index === 4)
              ) {
                for (const tb of sl.buff) {
                  const oldscore = BSS_Score;
                  const tbscore = GroundPvPBuff(specialB.name, gc.name, tb);
                  BSS_Score += tbscore;
                  if (DEBUG_BSS) {
                    console.log(
                      `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                    );
                  }
                }
              } else if (
                (sl.level.localeCompare(qualityColor.enum.Gold) &&
                  !bp.special1.localeCompare(qualityColor.enum.Gold) &&
                  index === 0) ||
                (sl.level.localeCompare(qualityColor.enum.Gold) &&
                  !bp.special2.localeCompare(qualityColor.enum.Gold) &&
                  index === 1) ||
                (sl.level.localeCompare(qualityColor.enum.Gold) &&
                  !bp.special3.localeCompare(qualityColor.enum.Gold) &&
                  index === 2) ||
                (sl.level.localeCompare(qualityColor.enum.Gold) &&
                  !bp.special4.localeCompare(qualityColor.enum.Gold) &&
                  index === 3) ||
                (sl.level.localeCompare(qualityColor.enum.Gold) &&
                  !bp.special5.localeCompare(qualityColor.enum.Gold) &&
                  index === 4)
              ) {
                for (const tb of sl.buff) {
                  const oldscore = BSS_Score;
                  const tbscore = GroundPvPBuff(specialB.name, gc.name, tb);
                  BSS_Score += tbscore;
                  if (DEBUG_BSS) {
                    console.log(
                      `oldscore: ${oldscore} tbscore: ${tbscore} score: ${BSS_Score}`
                    );
                  }
                }
              }
            }
          }
        }
      });

      BSS_Score = Math.floor(BSS_Score);
    }
    return BSS_Score;
  });

const EvAnsGroundPvPAttack = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    if (DEBUG) {
      console.log(`${eg.general.name}: EvAnsGroundPvPAttack starting`);
    }

    const BAS = EvAnsBasic(eg);
    const BSS = GroundAttackPvPBSS(eg, bp);

    const TLGS = BAS + BSS;
    if (DEBUG) {
      console.log(
        `for ${eg.general.name} BAS: ${BAS} BSS: ${BSS} TLGS: ${TLGS}`
      );
    }
    return TLGS ?? -11;
  });

const useCaseSelector: Record<
  generalUseCaseType,
  Record<
    generalSpecialistsType,
    (eg: ExtendedGeneralType, bp: BuffParamsType) => number
  >
> = {
  [generalUseCase.enum.Attack]: {
    [generalSpecialists.enum.Archers]: () => {
      return -7;
    },
    [generalSpecialists.enum.Ground]: EvAnsGroundPvPAttack,
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

export const EvAnsScoreComputer = z
  .function()
  .args(generalUseCase, ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement(
    (
      UseCase: generalUseCaseType,
      eg: ExtendedGeneralType,
      bp: BuffParamsType
    ) => {
      return useCaseSelector[UseCase][eg.general.score_as](eg, bp);
    }
  );
