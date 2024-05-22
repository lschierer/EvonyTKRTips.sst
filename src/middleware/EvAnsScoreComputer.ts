import { z } from "astro:content";
import {
  Attribute,
  Buff,
  Condition,
  generalUseCase,
  generalSpecialists,
  type ExtendedGeneralType,
  type generalUseCaseType,
  type generalSpecialistsType,
  type specialSkillBookType,
  ExtendedGeneral,
  specialSkillBook,
  Speciality,
  ClassEnum,
  UnitSchema,
  type BuffType,
  type SpecialityType,
  BuffParams,
  type BuffParamsType,
  qualityColor,
  AscendingLevels,
  ActivationSituations,
} from "@schemas/index";

import { GroundPvPAttributeMultipliers } from "@lib/EvAnsAttributeRanking";

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

const DEBUG = false;
const DEBUG_GBUFF = false;
const DEBUG_BAS = false;
const DEBUG_BSS = false;
const DEBUG_AES = false;
const DEBUG_34SS = false;



const EvAnsBasicGround = z
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
 
    const attackMultiplier = GroundPvPAttributeMultipliers[ActivationSituations.enum["Rally Owner PvP"]]?.Offensive.AllTroopAttack ?? 1;
    const defenseMultiplier = GroundPvPAttributeMultipliers[ActivationSituations.enum["Rally Owner PvP"]]?.Toughness.AllTroopDefense ?? 1;
    const HPMultipler = GroundPvPAttributeMultipliers[ActivationSituations.enum["Rally Owner PvP"]]?.Toughness.AllTroopHP ?? 1;
    const PoliticsMultipler = GroundPvPAttributeMultipliers[ActivationSituations.enum["Rally Owner PvP"]]?.Preservation.Death2Wounded ?? 1;

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

const GroundPvPBuff = z
  .function()
  .args(z.string(), z.string(), Buff, BuffParams)
  .returns(z.number())
  .implement((buffName: string, generalName: string, tb: BuffType, bp: BuffParamsType) => {
    let score = 0;
    if (tb !== undefined && tb.value !== undefined) {
      if (DEBUG_GBUFF) {
        console.log(`buff ${buffName} for ${generalName} check for value`)
      }
      //check if buff has some conditions that never work for PvP
      if (tb.condition !== undefined && tb.condition !== null) {
        if (DEBUG_GBUFF) {
          console.log(`buff ${buffName} for ${generalName} check for no condition`)
        }
        if (
          tb.condition.includes(Condition.enum["Against Monsters"]) ||
          tb.condition.includes(Condition.enum.Reduces_Monster) ||
          tb.condition.includes(Condition.enum.In_Main_City) ||
          tb.condition.includes(Condition.enum.Reinforcing) ||
          tb.condition.includes(Condition.enum.When_Defending_Outside_The_Main_City) ||
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

        //check for dragon and beast buffs
        if((tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon) ||
          tb.condition.includes(Condition.enum.brings_a_dragon) ||
          tb.condition.includes(Condition.enum.dragon_to_the_attack)) &&
          bp.dragon !== true) {
            return 0
          }
        if((tb.condition.includes(Condition.enum.brings_dragon_or_beast_to_attack)) &&
        (!(bp.dragon === true ||
          bp.beast === true))){
            return 0
          }
      }

      //check if it is a all troop buff (all class buff)
      if (tb.class === undefined || tb.class === null) {
        if (DEBUG_GBUFF) {
          console.log(`buff ${buffName} for ${generalName} check for no class`)
        }
        //this is an all class buff
        if (tb.attribute !== undefined) {
          if (DEBUG_GBUFF) {
            console.log(`buff ${buffName} for ${generalName} check for no attribute`)
          }
          if (!tb.attribute.localeCompare(Attribute.enum.March_Size_Capacity)) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
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
                  const multiplier =
                    GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
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
          } else if (
            !tb.attribute.localeCompare(Attribute.enum.Rally_Capacity)
          ) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                    if (DEBUG_GBUFF) {
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
                  if (DEBUG_GBUFF) {
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
                if (DEBUG_GBUFF) {
                  console.log(
                    `GroundPvPBuff: ${buffName} from ${generalName} adds ${additional} to ${score}`
                  );
                }
                score = score + additional;
              }
            }
          } else if ( //while this sometimes has conditions, they all apply to attackng PvP. 
            !tb.attribute.localeCompare(Attribute.enum.Wounded_to_Death)
          ) {
            if (tb.value !== undefined && tb.value !== null) {
              if (!tb.value.unit.localeCompare(UnitSchema.enum.percentage)) {
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Debilitation
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Offensive
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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
                const multiplier =
                  GroundPvPAttributeMultipliers["Rally Owner PvP"]?.Toughness
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

const GroundAttackPvPBSS = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    const gc = eg.general;
    let BSS_Score = 0;

    if (
      eg.books !== undefined &&
      Array.isArray(eg.books) &&
      eg.books.length > 0
    ) {
      const book_score = eg.books.reduce((accumulator, book) => {
        if (book === undefined) {
          return accumulator
        } else {
          const v = specialSkillBook.safeParse(book);
          if (v.error) {
            console.log(`${eg.general.name} invalid book: ${book.name}`)
            return accumulator
          } else {
            const bisb: specialSkillBookType = v.data;
            const array_total = bisb.buff.reduce((a2, tb) => {
              if (DEBUG_BSS) {
                console.log(`--- start tb ---`)
                console.log(JSON.stringify(tb))
                console.log(`--- end tb ---`)
              }
              const tbscore = GroundPvPBuff(bisb.name, gc.name, tb, bp);
              if (DEBUG_BSS) {
                console.log(JSON.stringify(tb))
                console.log(`${eg.general.name}: ${book.name}: accumulating ${tbscore}`)
              }
              return tbscore + a2
            }, 0)
            return accumulator + array_total;
          }
        }
        return accumulator
      }, 0)
      if (DEBUG_BSS) {
        console.log(`${eg.general.name} total book buff: ${book_score}`)
        console.log('')
      }
      BSS_Score += Math.floor(book_score);
    }
    return Math.floor(BSS_Score);
  });

const GroundAttackPvPAES = z
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
        if (DEBUG_AES) {
          console.log('')
          console.log(`${gc.name}: Ascending ${index}`)
          console.log(`accumulator currently ${accumulator}`)
        }
        if (!eg.general.stars?.localeCompare(AscendingLevels.enum[0])
        ) {
          return accumulator
        } else {
          if (DEBUG_AES) {
            console.log(`${index} starting detection`)
          }
          if (ab.buff !== undefined &&
            ab.buff !== null) {
            if (DEBUG_AES) {
              console.log(`${gc.name} Star ${index} pass null check`)
            }
            const v = z.array(Buff).safeParse(ab.buff);
            if (v.success) {
              const barray = v.data;
              if (DEBUG_AES) {
                console.log('--Array--')
                console.log(JSON.stringify(barray))
                console.log('--Array--')
              }
              const array_total = barray.reduce((accumulator, actual: BuffType) => {
                if (DEBUG_AES) {
                  console.log(JSON.stringify(actual))
                }
                if (eg.general.stars === undefined || eg.general.stars === null) {
                  return accumulator
                }
                if (
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) &&
                  !ab.level.localeCompare(AscendingLevels.enum[10])) {
                  const tbscore = GroundPvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore + accumulator;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[9])) {
                  const tbscore = GroundPvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore + accumulator;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[8])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[8])) {
                  const tbscore = GroundPvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore + accumulator;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[8]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[7])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[7])) {
                  const tbscore = GroundPvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore;
                } else if ((
                  !eg.general.stars.localeCompare(AscendingLevels.enum[10]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[9]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[8]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[7]) ||
                  !eg.general.stars.localeCompare(AscendingLevels.enum[6])) &&
                  !ab.level.localeCompare(AscendingLevels.enum[6])) {
                  const tbscore = GroundPvPBuff(
                    `Star ${index} ${ab.level}`,
                    eg.general.name,
                    actual, bp
                  );
                  if (DEBUG_AES) {
                    console.log(`accumulating ${tbscore}`);
                  }
                  return tbscore + accumulator;
                } else {
                  console.log(`${gc.name} Star ${index} ${ab.level} did not match anywhere deciding`)
                  console.log(JSON.stringify(ab.buff))
                  return accumulator
                }
              }, 0)
              return accumulator + array_total;
            } else {
              console.log(`${gc.name} error parsing ${index}`)
            }
          } else {
            console.log(`${gc.name} has a null or undefined buff ${JSON.stringify(ab)}`)
            return accumulator;
          }
          console.log(`${gc.name} reached final Ascending return 0`)
          return accumulator;
        }
      }, 0)
      if (DEBUG) {
        console.log(`${gc.name}: total ascending score: ${ascending_score} `)
        console.log('')
      }
      BSS_Score += Math.floor(ascending_score);
    }

    return Math.floor(BSS_Score);
  });

const GroundAttackPvP34SS = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    const gc = eg.general;
    let BSS_Score = 0;

    if (
      eg.specialities !== undefined &&
      Array.isArray(eg.specialities) &&
      eg.specialities.length > 0
    ) {
      const specialities_total = eg.specialities.reduce((a1, special, index1) => {
        if (DEBUG_34SS) {
          console.log("")
          console.log(`--- ${special.name} ---`)
          console.log(JSON.stringify(special.attribute))
          console.log(`accumulator: ${a1}`)
          console.log(`---`)
        }
        if (special === undefined || special === null) {
          return a1
        } else {
          const v = Speciality.safeParse(special);
          if (v.error) {
            console.log(`${eg.general.name}: invalid speciality: ${special.name}`)
            return a1
          } else {
            const specialB: SpecialityType = v.data;
            const AA_total = specialB.attribute.reduce((a2, sa, index2) => {
              if (sa === undefined || sa === null) {
                return a2
              } else {
                if (DEBUG_34SS) {
                  console.log(`---start sa ${index1} ${index2}---`)
                  console.log(JSON.stringify(sa))
                  console.log('--- end sa ---')
                }
                if (
                  (!sa.level.localeCompare(qualityColor.enum.Green) &&
                    bp.special1.localeCompare(qualityColor.enum.Disabled) &&
                    index1 === 0) ||
                  (!sa.level.localeCompare(qualityColor.enum.Green) &&
                    bp.special2.localeCompare(qualityColor.enum.Disabled) &&
                    index1 === 1) ||
                  (!sa.level.localeCompare(qualityColor.enum.Green) &&
                    bp.special3.localeCompare(qualityColor.enum.Disabled) &&
                    index1 === 2) ||
                  (!sa.level.localeCompare(qualityColor.enum.Green) &&
                    bp.special4.localeCompare(qualityColor.enum.Disabled) &&
                    index1 === 3) ||
                  (!sa.level.localeCompare(qualityColor.enum.Green) &&
                    bp.special5.localeCompare(qualityColor.enum.Disabled) &&
                    index1 === 4)
                ) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled green`)
                  }
                  const gt = sa.buff.reduce((aGreen, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aGreen
                    } else {
                      const sb_total = GroundPvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} to ${aGreen}`)
                      }
                      aGreen += sb_total;
                    }
                    if (DEBUG_34SS) {
                      console.log(`aGeen: ${aGreen} at end of green reduce ${index3}`)
                    }
                    return aGreen
                  }, 0)
                  a2 += gt;
                }
                
                if (
                  (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                    (bp.special1.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special1.localeCompare(qualityColor.enum.Green)) &&
                    index1 === 0) ||
                  (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                    (bp.special2.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special2.localeCompare(qualityColor.enum.Green)) &&
                    index1 === 1) ||
                  (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                    (bp.special3.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special3.localeCompare(qualityColor.enum.Green)) &&
                    index1 === 2) ||
                  (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                    (bp.special4.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special4.localeCompare(qualityColor.enum.Green)) &&
                    index1 === 3) ||
                  (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                    (bp.special5.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special5.localeCompare(qualityColor.enum.Green)) &&
                    index1 === 4)
                ) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled Blue`)
                  }
                  const bt = sa.buff.reduce((aBlue, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aBlue
                    } else {
                      const sb_total = GroundPvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} ${index3}`)
                      }
                      aBlue += sb_total;
                    }
                    return aBlue
                  }, 0)
                  a2 += bt;
                }
                if (
                  (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                    (bp.special1.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special1.localeCompare(qualityColor.enum.Green) ||
                      bp.special1.localeCompare(qualityColor.enum.Blue)) &&
                    index1 === 0) ||
                  (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                    (bp.special2.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special2.localeCompare(qualityColor.enum.Green) ||
                      bp.special2.localeCompare(qualityColor.enum.Blue)) &&
                    index1 === 1) ||
                  (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                    (bp.special3.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special3.localeCompare(qualityColor.enum.Green) ||
                      bp.special3.localeCompare(qualityColor.enum.Blue)) &&
                    index1 === 2) ||
                  (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                    (bp.special4.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special4.localeCompare(qualityColor.enum.Green) ||
                      bp.special4.localeCompare(qualityColor.enum.Blue)) &&
                    index1 === 3) ||
                  (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                    (bp.special5.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special5.localeCompare(qualityColor.enum.Green) ||
                      bp.special5.localeCompare(qualityColor.enum.Blue)) &&
                    index1 === 4)
                ) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled Purple`)
                  }
                  const pt = sa.buff.reduce((aPurple, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aPurple
                    } else {
                      const sb_total = GroundPvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} ${index3}`)
                      }
                      aPurple += sb_total;
                    }
                    return aPurple
                  }, 0)
                  a2 += pt;
                }
                if (
                  (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                    (bp.special1.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special1.localeCompare(qualityColor.enum.Green) ||
                      bp.special1.localeCompare(qualityColor.enum.Blue) ||
                      bp.special1.localeCompare(qualityColor.enum.Purple)) &&
                    index1 === 0) ||
                  (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                    (bp.special2.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special2.localeCompare(qualityColor.enum.Green) ||
                      bp.special2.localeCompare(qualityColor.enum.Blue) ||
                      bp.special2.localeCompare(qualityColor.enum.Purple)) &&
                    index1 === 1) ||
                  (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                    (bp.special3.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special3.localeCompare(qualityColor.enum.Green) ||
                      bp.special3.localeCompare(qualityColor.enum.Blue) ||
                      bp.special3.localeCompare(qualityColor.enum.Purple)) &&
                    index1 === 2) ||
                  (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                    (bp.special4.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special4.localeCompare(qualityColor.enum.Green) ||
                      bp.special4.localeCompare(qualityColor.enum.Blue) ||
                      bp.special4.localeCompare(qualityColor.enum.Purple)) &&
                    index1 === 3) ||
                  (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                    (bp.special5.localeCompare(qualityColor.enum.Disabled) ||
                      bp.special5.localeCompare(qualityColor.enum.Green) ||
                      bp.special5.localeCompare(qualityColor.enum.Blue) ||
                      bp.special5.localeCompare(qualityColor.enum.Purple)) &&
                    index1 === 4)
                ) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled Orange`)
                  }
                  const ot = sa.buff.reduce((aOrange, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aOrange
                    } else {
                      const sb_total = GroundPvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} ${index3}`)
                      }
                      aOrange += sb_total;
                    }
                    return aOrange
                  }, 0)
                  a2 += ot;
                }
                if (
                  (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                    !bp.special1.localeCompare(qualityColor.enum.Gold) &&
                    index1 === 0) ||
                  (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                    !bp.special2.localeCompare(qualityColor.enum.Gold) &&
                    index1 === 1) ||
                  (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                    !bp.special3.localeCompare(qualityColor.enum.Gold) &&
                    index1 === 2) ||
                  (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                    !bp.special4.localeCompare(qualityColor.enum.Gold) &&
                    index1 === 3) ||
                  (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                    !bp.special5.localeCompare(qualityColor.enum.Gold) &&
                    index1 === 4)
                ) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled Gold`)
                  }
                  const goldT = sa.buff.reduce((aGold, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aGold
                    } else {
                      const sb_total = GroundPvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} ${index3}`)
                      }
                      aGold += sb_total;
                    }
                    return aGold
                  }, 0)
                  a2 += goldT;
                }
              }
              if (DEBUG_34SS) {
                console.log(`a2: ${a2}`)
                console.log("")
              }
              return a2
            }, 0)
            return a1 + AA_total;
          }
        }
        return a1

      }, 0)

      if (DEBUG_34SS) {
        console.log(`${eg.general.name}: specialities total: ${specialities_total}`)
        console.log('')
      }
      BSS_Score += Math.floor(specialities_total);
    }
    return Math.floor(BSS_Score);
  });

const EvAnsGroundPvPAttack = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    if (DEBUG) {
      console.log(`${eg.general.name}: EvAnsGroundPvPAttack starting`);
    }

    const BAS = EvAnsBasicGround(eg);
    const BSS = GroundAttackPvPBSS(eg, bp);
    const AES = GroundAttackPvPAES(eg, bp);
    const specialities = GroundAttackPvP34SS(eg, bp);

    const TLGS = BAS + BSS + AES + specialities;
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
