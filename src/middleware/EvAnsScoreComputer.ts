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
const DEBUG_BAS = true;
const DEBUG_BSS = true;

const EvAnsBasic = z
  .function()
  .args(ExtendedGeneral)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType) => {
    const gc = eg.general;
    
    const BasicAttack =((gc.attack + (45 * gc.attack_increment)) < 900) ? 
      (gc.attack + (45 * gc.attack_increment)) * .1  :
      90 + (((gc.attack + (45 * gc.attack_increment))-900) * .2)
    const BasicDefense =
      ((gc.defense + (45 * gc.defense_increment)) < 900) ? 
      (gc.defense + (45 * gc.defense_increment)) * .1  :
      90 + (((gc.defense + (45 * gc.defense_increment))-900) * .2)
    const BasicLeaderShip =
      ((gc.leadership + (45 * gc.leadership_increment)) < 900) ? 
      (gc.leadership + (45 * gc.leadership_increment)) * .1  :
      90 + (((gc.leadership + (45 * gc.leadership_increment))-900) * .2)
    const BasicPolitics =
      ((gc.politics + (45 * gc.politics_increment)) < 900) ? 
      (gc.politics + (45 * gc.politics_increment)) * .1  :
      90 + (((gc.politics + (45 * gc.politics_increment))-900) * .2)
    const BAS = BasicAttack + BasicDefense + BasicLeaderShip + BasicPolitics;
    if (DEBUG_BAS) {
      console.log(`BasicAttack: ${BasicAttack} for ${eg.general.name}`)
      console.log(`BasicDefense: ${BasicDefense} for ${eg.general.name}`)
      console.log(`BasicLeaderShip: ${BasicLeaderShip} for ${eg.general.name}`)
      console.log(`BasicPolitics: ${BasicPolitics} for ${eg.general.name}`)
      console.log(`BAS: ${BAS} for: ${eg.general.name}`);
    }
    return Math.floor(BAS);
  });

const GroundPvPBuff = z
  .function()
  .args(z.string(), z.string(), Buff)
  .returns(z.promise(z.number()))
  .implement(async (bookName: string, generalName: string, tb: BuffType) => {
    let score = 0;
    if (tb !== undefined && tb.value !== undefined) {
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
              `buff ${bookName} for ${generalName} with inapplicable attribute `
            );
            console.log(JSON.stringify(tb));
          }
          return 0;
        }
      }
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                        `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                      `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                        `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                      `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
                    `buff: ${bookName} from ${generalName} adds ${additional} to ${score}`
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
        console.log(`not using buff from ${bookName} from ${generalName}`);
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
  .returns(z.promise(z.number()))
  .implement(async (eg: ExtendedGeneralType, bp: BuffParamsType) => {
    const gc = eg.general;
    let score = 0;
    if (
      gc.books !== undefined &&
      Array.isArray(gc.books) &&
      gc.books.length > 0
    ) {
      await Promise.all(
        gc.books.map(async (book) => {
          const bisbC: CollectionEntry<"skillBooks"> | undefined =
            await getEntry("skillBooks", book);
          if (bisbC !== undefined) {
            const v = specialSkillBook.safeParse(bisbC.data);
            if (v.success) {
              const bisb: specialSkillBookType = v.data;
              for (const tb of bisb.buff) {
                const oldscore = score;
                const tbscore = await GroundPvPBuff(bisb.name, gc.name, tb);
                score += tbscore;
                if(DEBUG) {
                  console.log(`oldscore: ${oldscore} tbscore: ${tbscore} score: ${score}`)
                }
              }
            }
          }
        })
      );
      score = Math.floor(score);
    }

    if (
      gc.specialities !== undefined &&
      Array.isArray(gc.specialities) &&
      gc.specialities.length > 0
    ) {
      await Promise.all(
        gc.specialities.map(async (special, index) => {
          const specialC: CollectionEntry<"specialities"> | undefined =
            await getEntry("specialities", special);
          if (specialC !== undefined) {
            const v = Speciality.safeParse(specialC.data);
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
                    const oldscore = score;
                    const tbscore = await GroundPvPBuff(specialB.name, gc.name, tb);
                    score += tbscore;
                    if(DEBUG) {
                      console.log(`oldscore: ${oldscore} tbscore: ${tbscore} score: ${score}`)
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
                    const oldscore = score;
                    const tbscore = await GroundPvPBuff(specialB.name, gc.name, tb);
                    score += tbscore;
                    if(DEBUG) {
                      console.log(`oldscore: ${oldscore} tbscore: ${tbscore} score: ${score}`)
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
                    const oldscore = score;
                    const tbscore = await GroundPvPBuff(specialB.name, gc.name, tb);
                    score += tbscore;
                    if(DEBUG) {
                      console.log(`oldscore: ${oldscore} tbscore: ${tbscore} score: ${score}`)
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
                    const oldscore = score;
                    const tbscore = await GroundPvPBuff(specialB.name, gc.name, tb);
                    score += tbscore;
                    if(DEBUG) {
                      console.log(`oldscore: ${oldscore} tbscore: ${tbscore} score: ${score}`)
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
                    const oldscore = score;
                    const tbscore = await GroundPvPBuff(specialB.name, gc.name, tb);
                    score += tbscore;
                    if(DEBUG) {
                      console.log(`oldscore: ${oldscore} tbscore: ${tbscore} score: ${score}`)
                    }
                  }
                }
              }
            }
          }
        })
      );
    }
    return score;
  });

const EvAnsGroundPvPAttack = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.promise(z.number()))
  .implement(async (eg: ExtendedGeneralType, bp: BuffParamsType) => {
    const BAS = EvAnsBasic(eg);
    const BSS = await GroundAttackPvPBSS(eg, bp);

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
    (eg: ExtendedGeneralType, bp: BuffParamsType) => Promise<number>
  >
> = {
  [generalUseCase.enum.Attack]: {
    [generalSpecialists.enum.Archers]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Ground]: EvAnsGroundPvPAttack,
    [generalSpecialists.enum.Mounted]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Siege]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Wall]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.Mayor]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.all]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
  },
  [generalUseCase.enum.Defense]: {
    [generalSpecialists.enum.Archers]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Ground]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Mounted]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Siege]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Wall]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.Mayor]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.all]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
  },
  [generalUseCase.enum.Monsters]: {
    [generalSpecialists.enum.Archers]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Ground]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Mounted]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Siege]: () => {
      return new Promise((resolve) => {
        resolve(-7);
      });
    },
    [generalSpecialists.enum.Wall]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.Mayor]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.all]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
  },
  [generalUseCase.enum.Overall]: {
    [generalSpecialists.enum.Archers]: () => {
      return new Promise((resolve) => {
        resolve(-5);
      });
    },
    [generalSpecialists.enum.Ground]: () => {
      return new Promise((resolve) => {
        resolve(-5);
      });
    },
    [generalSpecialists.enum.Mounted]: () => {
      return new Promise((resolve) => {
        resolve(-5);
      });
    },
    [generalSpecialists.enum.Siege]: () => {
      return new Promise((resolve) => {
        resolve(-5);
      });
    },
    [generalSpecialists.enum.Wall]: () => {
      return new Promise((resolve) => {
        resolve(-5);
      });
    },
    [generalSpecialists.enum.Mayor]: () => {
      return new Promise((resolve) => {
        resolve(-5);
      });
    },
    [generalSpecialists.enum.all]: () => {
      return new Promise((resolve) => {
        resolve(-5);
      });
    },
  },
  [generalUseCase.enum.Wall]: {
    [generalSpecialists.enum.Archers]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.Ground]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.Mounted]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.Siege]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.Wall]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.Mayor]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
    [generalSpecialists.enum.all]: () => {
      return new Promise((resolve) => {
        resolve(-1);
      });
    },
  },
  [generalUseCase.enum.Mayor]: {
    [generalSpecialists.enum.Archers]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.Ground]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.Mounted]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.Siege]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.Wall]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.Mayor]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
    [generalSpecialists.enum.all]: () => {
      return new Promise((resolve) => {
        resolve(-2);
      });
    },
  },
  [generalUseCase.enum.all]: {
    [generalSpecialists.enum.Archers]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
    [generalSpecialists.enum.Ground]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
    [generalSpecialists.enum.Mounted]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
    [generalSpecialists.enum.Siege]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
    [generalSpecialists.enum.Wall]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
    [generalSpecialists.enum.Mayor]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
    [generalSpecialists.enum.all]: () => {
      return new Promise((resolve) => {
        resolve(-3);
      });
    },
  },
};

export const EvAnsScoreComputer = z
  .function()
  .args(generalUseCase, ExtendedGeneral, BuffParams)
  .returns(z.promise(z.number()))
  .implement(
    async (
      UseCase: generalUseCaseType,
      eg: ExtendedGeneralType,
      bp: BuffParamsType
    ) => {
      return await useCaseSelector[UseCase][eg.general.score_as](eg, bp);
    }
  );
