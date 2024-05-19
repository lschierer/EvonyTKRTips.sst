import { defineMiddleware } from "astro:middleware";
import type { APIContext } from "astro";
import {
  getEntry,
  getCollection,
  z,
  type CollectionEntry,
} from "astro:content";

import { BaseN } from "js-combinatorics";

import * as d3 from 'd3'

import {
  AscendingLevels,
  Book,
  BuffParams,
  type BuffParamsType,

  Display,
  ExtendedGeneral,
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  GeneralClass,
  generalSpecialists,
  generalUseCase,
  InvestmentOptionsSchema,
  type InvestmentOptionsType,
  qualityColor,
  Speciality,
  specialSkillBook,
  type specialSkillBookType,
  type GeneralClassType,
  type SpecialityType,
  type BookType,
  type standardSkillBookType,
} from "@schemas/index";

import { setTimeout } from 'timers/promises'

const DEBUG = true;
const DEBUG2 = false;
const DEBUG3 = false;
const DEBUGFilter = false;
const DEBUGBaseN = false;

import {arrayUniqueFilter} from '@lib/util'

export const DisplayGeneralsMWRoutes = ["/generals/"];

export const DisplayGeneralsMW = defineMiddleware(({ locals, url }, next) => {
  let continueHandler = false;

  const re = /[\[\]'",]/g;

  DisplayGeneralsMWRoutes.map((route) => {
    if (url.pathname.startsWith(route)) {
      continueHandler = true;
    }
  });
  //define a bunch of functions almost like a class

  const filterInvestmentOptions = z
    .function()
    .args(z.string(), InvestmentOptionsSchema)
    .returns(BuffParams.nullable())
    .implement((myEGname: string, desired: InvestmentOptionsType) => {
      const originalDesire = [...desired];

      if (DEBUGFilter) console.log(`desired is ${JSON.stringify(desired)}`);

      const myEG: ExtendedGeneralType = locals.ExtendedGeneralMap.get(myEGname);
      if (DEBUGFilter) {
        console.log(`filtering for ${desired}`)
        console.log(`${myEGname} has ${myEG.computedBuffs.length} options`)
        console.log(`looking for: ${JSON.stringify(myEG.computedBuffs)}`)
      }
      if (myEG !== undefined && myEG !== null && myEG.computedBuffs.length > 0) {
        
          const f2 = myEG.computedBuffs.filter((item) => {
            if (!item.special1.localeCompare(desired[0] as string)) {
              if (!item.special2.localeCompare(desired[1] as string)) {
                if (!item.special3.localeCompare(desired[2] as string)) {
                  if (!item.special4.localeCompare(desired[3] as string)) {
                    if (!item.special5.localeCompare(desired[4] as string)) {
                      if (!item.stars.localeCompare(desired[5] as string)) {
                        if (item.dragon === desired[6]) {
                          if (item.beast === desired[7]) {
                            return true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            return false
          })
          if (f2.length > 0) {
            if (f2.length > 1) {
              console.log(`found too many, ${f2.length}`)
              if (DEBUGFilter) {
                console.log(`found: ${JSON.stringify(f2)}`)
              }
              const r: BuffParamsType | undefined = f2.shift()
              if (r !== undefined) {
                return r;
              }
            } else {
              const r: BuffParamsType | undefined = f2.shift()
              if (r !== undefined) {
                return r;
              }
            }
          } else {
            if (DEBUGFilter) { console.log(`f2 loop found nothing`) }
          }
        
      } else {
        if (DEBUGFilter) console.log(`${myEG.general.name} computed Buffs 0`);
      }

      return null;
    });

  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  const EvAnsBuff = z
    .function()
    .args(z.string(), Display, InvestmentOptionsSchema)
    .returns(z.number())
    .implement((name, display, IO) => {

      if (DEBUG) console.log(`EvAnsBuff starting for ${name}`)
      const eg: ExtendedGeneralType = locals.ExtendedGeneralMap.get(name)
      const gc = eg.general;

      if (!eg.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
        console.log(`called early!`)
        return -6;
      }

      if (!display.localeCompare(Display.enum.assistant)) {
        IO[5] = AscendingLevels.enum[0];
      }

      const BPv: BuffParamsType | null = filterInvestmentOptions(name, IO)
      let BP: BuffParamsType;
      if (BPv !== null) {
        BP = BPv;
      } else {
        console.log(`BPv: ${JSON.stringify(BPv)}`)
        return -5;
      }

      //https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value explains the attribute to buff relationship.
      const BasicAttack =
        Math.min(gc.attack + 45 * gc.attack_increment, 900) * 0.1 +
        (gc.attack + 45 * gc.attack_increment > 900
          ? ((gc.attack + 45 * gc.attack_increment) % 900) * 0.2
          : 0);
      const BasicDefense =
        Math.min(gc.defense + 45 * gc.defense_increment, 900) * 0.1 +
        (gc.defense + 45 * gc.defense_increment > 900
          ? ((gc.defense + 45 * gc.defense_increment) % 900) * 0.2
          : 0);
      const BasicLeaderShip =
        Math.min(gc.leadership + 45 * gc.leadership_increment, 900) * 0.1 +
        (gc.leadership + 45 * gc.leadership_increment > 900
          ? ((gc.leadership + 45 * gc.leadership_increment) % 900) * 0.2
          : 0);
      const BasicPolitics =
        Math.min(gc.politics + 45 * gc.politics_increment, 900) * 0.1 +
        (gc.politics + 45 * gc.politics_increment > 900
          ? ((gc.politics + 45 * gc.politics_increment) % 900) * 0.2
          : 0);
      const BAS = BasicAttack + BasicDefense + BasicLeaderShip + BasicPolitics;

      //Built-in SkillBook Score is much more complicated
      const BSS = 0;
      if (
        gc.books !== undefined &&
        Array.isArray(gc.books) &&
        gc.books.length > 0
      ) {
        gc.books.map(async (book) => {
          const bisbC: CollectionEntry<"skillBooks"> | undefined =
            await getEntry("skillBooks", book);
          if (bisbC !== undefined) {
            const v = specialSkillBook.safeParse(bisbC.data);
            if (v.success) {
              const bisb: specialSkillBookType = v.data;
              for (const tb of bisb.buff) {
                if (tb !== undefined && tb.value !== undefined) {
                  if (tb.class === undefined) {
                    //this is an all class buff
                    if (gc.score_as !== undefined) {
                      if (
                        !gc.score_as.localeCompare(
                          generalSpecialists.enum.Archers,
                          undefined,
                          { sensitivity: "base" }
                        )
                      ) {
                        if (tb.attribute !== undefined) {
                        }
                      }
                    }
                  }
                } else {
                  console.log(
                    `how to score a buff with no value? gc is ${gc.name}`
                  );
                }
              }
            }
          }
        });
      }

      const fourSB = 0;
      const threeSS = 0;
      const fourSS = 0;
      const AES = 0;

      return (
        Math.floor(BAS) +
        Math.floor(BSS) +
        Math.floor(fourSB) +
        Math.floor(threeSS) +
        Math.floor(AES)
      );
    });

  const buffComputer = z
    .function()
    .args(z.string())
    .returns(z.void())
    .implement((name) => {
      if (DEBUG)
        console.log(
          `buffComputer for ${name}, InvestmentOptions size ${locals.InvestmentOptions.size}`
        );
      const item: ExtendedGeneralType = locals.ExtendedGeneralMap.get(name)

      if (!item.general.name.localeCompare(name)) {
        if (item.computedBuffs.length > 0) {
          if (DEBUG) { 
            console.log(`buffComputer ${name} returning early, this is done `) 
            console.log(`buffComputer ${name} detected ${item.computedBuffs.length}`)

          }
          return;
        }
        const general = item.general;
        if (Array.isArray(item.specialities)) {
          for (const IO of locals.InvestmentOptions) {
            const v1 = InvestmentOptionsSchema.safeParse(IO[1]);
            if (v1.success) {
              if (DEBUG3) console.log(`I have a valid IO`);
              const thisOption: InvestmentOptionsType = v1.data;

              const BP: BuffParamsType = {
                special1: qualityColor.parse(thisOption[0]),
                special2: qualityColor.parse(thisOption[1]),
                special3: qualityColor.parse(thisOption[2]),
                special4: qualityColor.parse(thisOption[3]),
                special5: qualityColor.parse(thisOption[4]),
                stars: AscendingLevels.parse(thisOption[5]),
                dragon: z.boolean().parse(thisOption[6]),
                beast: z.boolean().parse(thisOption[7]),
              };

              if (!BP.special5.localeCompare(qualityColor.enum.Disabled)) {
                if (item.specialities.length < 5) {
                  item.computedBuffs.push(BP)
                  continue;
                }
                if (!BP.special4.localeCompare(qualityColor.enum.Disabled)) {
                  if (item.specialities.length < 4) {
                    item.computedBuffs.push(BP)
                    continue;
                  }
                }
              }
              item.computedBuffs.push(BP)
            } else {
              console.log(
                `Invalid InvestmentOption in Set ${JSON.stringify(IO)}`
              );
              console.log(`buffComputer ${JSON.stringify(v1.error.message)}`);
            }
          }
        }
        if (DEBUG3) console.log(`returning data size ${item.computedBuffs.length}`);
      }

    });

  const enrichGeneral = z
    .function()
    .args(z.string())
    .returns(z.promise(z.boolean()))
    .implement(async (gn) => {
      if (DEBUG) console.log(`starating to enrich ${gn}`);
      let success = true;
      const entry: ExtendedGeneralType | null = locals.ExtendedGeneralMap.get(gn) ?? null;

      if (entry === undefined || entry === null) {
        return false;
      } else {
        if(!entry.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
          if(DEBUG) {console.log(`called when already complete`)}
          return true
        } else if(!entry.status.localeCompare(ExtendedGeneralStatus.enum.processing)) {
          if(DEBUG) {console.log(`called while still processing`)}
          return false;
        }
        entry.status = ExtendedGeneralStatus.enum.processing;

        if (!Array.isArray(entry.general.specialities) || entry.general.specialities.length === 0) {
          return false;
        } else {
          await Promise.all(
            entry.general.specialities.map(async (special) => {
              const sC = await getEntry("specialities", special);
              if (sC !== undefined) {
                const v = Speciality.safeParse(sC.data);
                if (v.success) {
                  if(DEBUG) { console.log(`enrichGeneral ${gn}: pushing ${v.data.name}`)}
                  entry.specialities.push(v.data);
                } else {
                  console.log(`failed to get ${special} for ${entry.general.name}`);
                  console.log(`enrichGeneral ${JSON.stringify(v.error.message)}`);
                }
              }
            })
            
          );
          if (entry.general.specialities.length !== entry.general.specialities.length) {
            console.log(
              `specialities for ${entry.general.name}: expected: ${entry.general.specialities.length} have: ${entry.specialities.length}`
            );
            return false;
          } else {
            if (DEBUG) console.log(`enrichGeneral ${gn} specials success ${entry.specialities.length}`)
          }
        }
        if (!Array.isArray(entry.general.books) || entry.general.books.length === 0) {
          return false;
        } else {
          await Promise.all(
            entry.general.books.map(async (book) => {
              const bC = await getEntry("skillBooks", book);
              if (bC !== undefined) {
                const v = Book.safeParse(bC.data);
                if (v.success) {
                  entry.books.push(v.data);
                } else {
                  console.log(`failed to get ${book} for ${gn}`);
                  console.log(`enrichGeneral ${JSON.stringify(v.error.message)}`);
                }
              }
            })
          );
          if (entry.general.books.length !== entry.books.length) {
            console.log(
              `books for ${gn}: have ${entry.books.length} expected ${entry.general.books.length}`
            );
            return false;
          }
        }

        if (success) {
          buffComputer(entry.general.name);
          entry.status = ExtendedGeneralStatus.enum.complete;
        } else {
          console.log(`failed to set buffs`);
          return false;
        }
        if (DEBUG) {
          console.log(`enrichGeneral work done for ${gn}`)
          console.log(`specials: ${entry.specialities.length}`)
          console.log(`books: ${entry.books.length}`)
          console.log(`computedBuffs: ${entry.computedBuffs.length}`)
        }
        if (DEBUG) {
          console.log(`enrichGeneral for ${gn} complete with status ${success}`)
        }
      }
      return success
    })


  const addEG2EGS = z
    .function()
    .args(GeneralClass)
    .returns(z.void())
    .implement((general) => {
      if (DEBUG)
        console.log(
          `middleware generals addEG2EGS running for ${general.name}`
        );
      if (locals.ExtendedGeneralMap.size > 0) {
        if (locals.ExtendedGeneralMap.has(general.name))
          return;
      }
      const success = true;
      const toAdd: ExtendedGeneralType = {
        general: general,
        specialities: new Array<SpecialityType>(),
        books: new Array<BookType | specialSkillBookType | standardSkillBookType>(),
        computedBuffs: new Array<BuffParamsType>(),
        status: ExtendedGeneralStatus.enum.created,
      };
      const test = ExtendedGeneral.safeParse(toAdd);
      if (test.success) {
        if (DEBUG)
          console.log(
            `addEG2EGS built a valid ExtendedGeneral for ${general.name}`
          );
        if (DEBUG) console.log(`addEG2EGS: map size: ${locals.ExtendedGeneralMap.size}`);
        if (!locals.ExtendedGeneralMap.has(test.data.general.name)) {
          locals.ExtendedGeneralMap.set(test.data.general.name, test.data)
        }
        if (DEBUG) console.log(`addEG2EGS: map size: ${locals.ExtendedGeneralMap.size} about to enrich.`);
        enrichGeneral(general.name);
      } else {
        console.log(
          `addEG2EGS built an invalid ExtendedGeneral for ${general.name}`
        );
      }

      return;
    });

  const HandlerLogic = (locals: App.Locals) => {
    if (locals.ExtendedGeneralMap === undefined) {
      locals.ExtendedGeneralMap = new d3.InternMap<string, ExtendedGeneralType>();
    }

    if (locals.InvestmentOptions === undefined) {
      locals.InvestmentOptions = new d3.InternMap<string, InvestmentOptionsType>();
    }

    if (locals.addEG2EGS === undefined) {
      locals.addEG2EGS = addEG2EGS;
    }

    if (locals.buffComputer === undefined) {
      locals.buffComputer = buffComputer;
    }

    if (locals.enrichGeneral === undefined) {
      locals.enrichGeneral = enrichGeneral;
    }

    if (locals.EvAnsBuff === undefined) {
      locals.EvAnsBuff = EvAnsBuff;
    }

    if (locals.filterInvestmentOptions === undefined) {
      locals.filterInvestmentOptions = filterInvestmentOptions;
    }

    if (locals.InvestmentOptions.size === 0) {
      const ColorBaseN = new BaseN(qualityColor.options, 5);
      [...ColorBaseN]
        .filter((ca) => {
          if (ca[4].localeCompare(qualityColor.enum.Disabled)) {
            if (DEBUGBaseN) { console.log(`1it; ${ca[4]};`) }
            if (
              !ca[0].localeCompare(qualityColor.enum.Gold) &&
              !ca[1].localeCompare(qualityColor.enum.Gold) &&
              !ca[2].localeCompare(qualityColor.enum.Gold) &&
              !ca[3].localeCompare(qualityColor.enum.Gold)
            ) {
              return true
            } else {
              return false;
            }
          } else {
            if (DEBUGBaseN) { console.log(`1ie; ${ca[4]};`) }
            if (ca[3].localeCompare(qualityColor.enum.Disabled)) {
              if (DEBUGBaseN) { console.log(`2it; ${ca[3]};`) }
              if (
                !ca[0].localeCompare(qualityColor.enum.Gold) &&
                !ca[1].localeCompare(qualityColor.enum.Gold) &&
                !ca[2].localeCompare(qualityColor.enum.Gold)
              ) {
                return true
              } else {
                return false;
              }
            } else {
              if (DEBUGBaseN) { console.log(`2ie; ${ca[3]};`) }
              if (!ca[3].localeCompare(qualityColor.enum.Disabled)) {
                if (DEBUGBaseN) { console.log(`3it; ${ca[3]}, ${ca[4]};`) }
                if (
                  !ca[3].localeCompare(qualityColor.enum.Disabled) &&
                  !ca[4].localeCompare(qualityColor.enum.Disabled)
                ) {
                  return true
                } else {
                  return false;
                }
              }
            }
          }

          if (DEBUGBaseN) { console.log(`----\n\n`) }
          return false;
        })
        .map((ca) => {
          const alMap = AscendingLevels.options.map((al) => {
            const mv = z.array(InvestmentOptionsSchema).safeParse([
              [...ca, al, false, false],
              [...ca, al, true, false],
              [...ca, al, false, true],
              [...ca, al, true, true], //needed for summary pages even though no one can have both
            ]);
            if (mv.success) {
              if (DEBUGBaseN) console.log(`alMap returning ${JSON.stringify(mv.data)}`)
              return mv.data
            } else {
              console.log(`built the returning array badly in alMap`)
            }
          });
          return alMap.flat();
        })
        .flat().filter(arrayUniqueFilter)
        .map((item) => {
          if (DEBUGBaseN) { console.log(`adding ${JSON.stringify(item)}`) }
          const re = /[\[\]'",]/g;
          const tk = JSON.stringify(item).replaceAll(re, '');
          if (DEBUGBaseN) { console.log(`key is \\${tk}`) }
          if (!locals.InvestmentOptions.has(tk)) {
            locals.InvestmentOptions.set(tk, item);
          }
        });
      if (DEBUG)
        console.log(
          `ca after filtering, ${locals.InvestmentOptions.size} options left`
        );
    }
  };

  //end of function definitions

  if (continueHandler) {
    if (DEBUG) console.log(`DisplayGeneralsMW running`);
    HandlerLogic(locals);
  }

  return next();
});
