import { defineMiddleware } from "astro:middleware";
import type { APIContext } from "astro";
import {
  getEntry,
  getCollection,
  z,
  type CollectionEntry,
} from "astro:content";

import { BaseN } from "js-combinatorics";

import {
  AscendingLevels,
  Book,
  BuffParams,
  type BuffParamsType,
  BuffFilterReturn,
  Display,
  ExtendedGeneral,
  type ExtendedGeneralType,
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
} from "@schemas/index";
import { specialtyAttribute } from "src/assets/evonySchemas";

const DEBUG = true;
const DEBUG2 = false;
const DEBUG3 = false;
const DEBUGFilter = false;

export const DisplayGeneralsMWRoutes = ["/generals/"];

export const DisplayGeneralsMW = defineMiddleware(({ locals, url }, next) => {
  let continueHandler = false;
  DisplayGeneralsMWRoutes.map((route) => {
    if (url.pathname.startsWith(route)) {
      continueHandler = true;
    }
  });
  //define a bunch of functions almost like a class

  const filterInvestmentOptions = z
    .function()
    .args(ExtendedGeneral, InvestmentOptionsSchema)
    .returns(z.union(BuffFilterReturn.options))
    .implement((myEG: ExtendedGeneralType, desired: InvestmentOptionsType) => {
      const originalDesire = [...desired];
      if (DEBUGFilter) console.log(`desired is ${JSON.stringify(desired)}`);
      if (myEG.computedBuffs.length > 0) {
        const found = myEG.computedBuffs.filter((item) => {
          if (
            Array.isArray(myEG.specialities) &&
            myEG.specialities.length > 0
          ) {
            let d = desired[0];
            if (!item.special1.localeCompare(d as string)) {
              d = desired[1];
              if (!item.special2.localeCompare(d as string)) {
                d = desired[2];
                if (!item.special3.localeCompare(d as string)) {
                  d = desired[3];
                  if (!item.special4.localeCompare(d as string)) {
                    d = desired[4];
                    if (!item.special5.localeCompare(d as string)) {
                      d = desired[5];
                      if (!item.stars.localeCompare(d as string)) {
                        d = desired[6];
                        if (item.dragon === (d as boolean)) {
                          d = desired[7];
                          if (item.beast === (d as boolean)) {
                            return true;
                          } else {
                            if (DEBUGFilter) {
                              console.log(`beast rejected`);
                              console.log(`found: ${item.beast}`);
                              console.log(`looking for ${d as boolean}`);
                            }
                          }
                        } else {
                          if (DEBUGFilter) {
                            console.log(`dragon rejected`);
                            console.log(`found: ${item.dragon}`);
                            console.log(`looking for ${d as boolean}`);
                          }
                        }
                      } else {
                        if (DEBUGFilter) {
                          console.log(`stars rejected`);
                          console.log(`found: ${item.stars}`);
                          console.log(`looking for ${d as string}`);
                        }
                      }
                    } else {
                      if (DEBUGFilter) {
                        console.log(`special5 rejected`);
                        console.log(`found: ${item.special5}`);
                        console.log(`looking for ${d as string}`);
                      }
                    }
                  } else {
                    if (DEBUGFilter) {
                      console.log(`special4 rejected`);
                      console.log(`found: ${item.special4}`);
                      console.log(`looking for ${d as string}`);
                    }
                  }
                } else {
                  if (DEBUGFilter) {
                    console.log(`special3 rejected`);
                    console.log(`found: ${item.special3}`);
                    console.log(`looking for ${d as string}`);
                  }
                }
              } else {
                if (DEBUGFilter) {
                  console.log(`special2 rejected`);
                  console.log(`found: ${item.special2}`);
                  console.log(`looking for ${d as string}`);
                }
              }
            } else {
              if (DEBUGFilter) {
                console.log(`special1 rejected`);
                console.log(`found: ${item.special1}`);
                console.log(`looking for ${d as string}`);
              }
            }
          }
        });
        if (found.length > 0) {
          if (found.length === 1) {
            const v = BuffParams.safeParse(found.shift());
            if (v.success) {
              return { status: "success", data: v.data };
            }
          } else {
            console.log(
              `found too many matches for ${myEG.general.name} looking for ${desired}`
            );
            const v = BuffParams.safeParse(found.shift());
            if (v.success) {
              return { status: "success", data: v.data };
            }
          }
        } else {
          if (DEBUGFilter) {
            console.log(`${myEG.general.name} found length 0`);
            console.log(`looked for ${JSON.stringify(originalDesire)}`);
          }
        }
      } else {
        if (DEBUGFilter) console.log(`${myEG.general.name} computed Buffs 0`);
      }
      return Object({
        status: "error",
        error: `no computedBuffs available for ${myEG.general.name}`,
      });
    });

  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  const EvAnsBuff = z
    .function()
    .args(GeneralClass, generalUseCase, BuffParams)
    .returns(z.union([z.number(), z.promise(z.number())]))
    .implement(async (gc, gu, ap) => {
      //if(DEBUG) console.log(`EvAnsBuff starting for ${gc.name}`)

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

      locals.ExtendedGeneralSet.forEach((item) => {
        if (!item.general.name.localeCompare(name)) {
          if (item.computedBuffs.length > 0) {
            return;
          }
          const general = item.general;
          for (const IO of locals.InvestmentOptions) {
            const v1 = InvestmentOptionsSchema.safeParse(IO);
            if (v1.success) {
              if (DEBUG3) console.log(`I have a valid IO`);
              const thisOption = v1.data;

              const BP: BuffParamsType = {
                special1: qualityColor.enum.Disabled,
                special2: qualityColor.enum.Disabled,
                special3: qualityColor.enum.Disabled,
                special4: qualityColor.enum.Disabled,
                special5: qualityColor.enum.Disabled,
                stars: AscendingLevels.enum[0],
                dragon: false,
                beast: false,
                EvAnsRanking: 0,
              };
              if (
                Array.isArray(general.specialities) &&
                general.specialities.length > 0
              ) {
                if (DEBUG3) console.log(`${general.name} has specialities`);
                let t = qualityColor.safeParse(thisOption[0]);
                if (t.success) {
                  BP.special1 = t.data;
                } else {
                  console.log(
                    `error parsing InvestmentOptions ${t.error.message}`
                  );
                  console.log(JSON.stringify(IO));
                }
                t = qualityColor.safeParse(thisOption[1]);
                if (t.success) {
                  BP.special2 = t.data;
                } else {
                  console.log(
                    `error parsing InvestmentOptions ${t.error.message}`
                  );
                  console.log(JSON.stringify(IO));
                }
                t = qualityColor.safeParse(thisOption[2]);
                if (t.success) {
                  BP.special3 = t.data;
                } else {
                  console.log(
                    `error parsing InvestmentOptions ${t.error.message}`
                  );
                  console.log(JSON.stringify(IO));
                }
                if (general.specialities.length >= 4) {
                  t = qualityColor.safeParse(thisOption[3]);
                  if (t.success) {
                    BP.special4 = t.data;
                  } else {
                    console.log(
                      `error parsing InvestmentOptions ${t.error.message}`
                    );
                    console.log(JSON.stringify(IO));
                  }
                  if (general.specialities.length === 5) {
                    t = qualityColor.safeParse(thisOption[4]);
                    if (t.success) {
                      BP.special5 = t.data;
                    } else {
                      console.log(
                        `error parsing InvestmentOptions ${t.error.message}`
                      );
                      console.log(JSON.stringify(IO));
                    }
                  }
                }
                const al = AscendingLevels.safeParse(thisOption[5]);
                if (al.success) {
                  BP.stars = al.data;
                } else {
                  console.log(
                    `error parsing InvestmentOptions ${al.error.message}`
                  );
                  console.log(JSON.stringify(IO));
                }
                const td = z.boolean().safeParse(thisOption[6]);
                if (td.success) {
                  BP.dragon = td.data;
                } else {
                  console.log(
                    `error parsing InvestmentOptions ${td.error.message}`
                  );
                }
                const tb = z.boolean().safeParse(thisOption[7]);
                if (tb.success) {
                  BP.beast = tb.data;
                } else {
                  console.log(
                    `error parsing InvestmentOptions ${tb.error.message}`
                  );
                }
                if (DEBUG3)
                  console.log(`calling EvAnsBuff for ${JSON.stringify(BP)}`);
                BP.EvAnsRanking = -5;
                item.computedBuffs.push(BP);
              }
            } else {
              console.log(
                `Invalid InvestmentOption in Set ${JSON.stringify(IO)}`
              );
              console.log(v1.error.message);
            }
          }
          if (DEBUG3) console.log(`returning data size ${item.computedBuffs.length}`);
        }
      });
    });

  const enrichGeneral = z
    .function()
    .args(z.string())
    .returns(z.promise(z.boolean()))
    .implement(async (gn) => {
      if (DEBUG) console.log(`starating to enrich ${gn}`);
      let success = true;
      for (const entry of locals.ExtendedGeneralSet) {
        if (!entry.general.name.localeCompare(gn)) {
          const eg: GeneralClassType = entry.general;
          if (Array.isArray(eg.specialities) && eg.specialities.length > 0) {
            await Promise.all(
              eg.specialities.map(async (special) => {
                const sC = await getEntry("specialities", special);
                if (sC !== undefined) {
                  const v = Speciality.safeParse(sC.data);
                  if (v.success) {
                    entry.specialities.push(v.data);
                  } else {
                    console.log(`failed to get ${special} for ${eg.name}`);
                    console.log(v.error.message);
                  }
                }
              })
            );
            if (eg.specialities.length !== entry.general.specialities.length) {
              console.log(
                `specialities for ${eg.name}: expected: ${eg.specialities.length} have: ${entry.specialities.length}`
              );
              success = false;
            }
          }
          if (Array.isArray(eg.books) && eg.books.length > 0) {
            await Promise.all(
              eg.books.map(async (book) => {
                const bC = await getEntry("skillBooks", book);
                if (bC !== undefined) {
                  const v = Book.safeParse(bC.data);
                  if (v.success) {
                    entry.books.push(v.data);
                  } else {
                    console.log(`failed to get ${book} for ${eg.name}`);
                    console.log(v.error.message);
                  }
                }
              })
            );
            if (eg.books.length !== entry.books.length) {
              console.log(
                `books for ${eg.name}: have ${entry.general.books.length} expected ${eg.books.length}`
              );
              success = false;
            }
          }
          if (success) {
            await buffComputer(entry.general.name);
            entry.general.complete = true;
          } else {
            console.log(`failed to set buffs`);
            entry.general.complete = true;
          }
        }
      }
      return true;
    });

  const addEG2EGS = z
    .function()
    .args(GeneralClass)
    .returns(z.void())
    .implement((general) => {
      if (DEBUG)
        console.log(
          `middleware generals addEG2EGS running for ${general.name}`
        );
      const success = true;
      const toAdd: ExtendedGeneralType = {
        general: general,
        specialities: [],
        books: [],
        computedBuffs: [],
        complete: false,
      };
      const test = ExtendedGeneral.safeParse(toAdd);
      if (test.success) {
        if (DEBUG)
          console.log(
            `addEG2EGS built a valid ExtendedGeneral for ${general.name}`
          );
        if (DEBUG) console.log(locals.ExtendedGeneralSet.size);
        locals.ExtendedGeneralSet.add(toAdd);
        if (DEBUG) console.log(locals.ExtendedGeneralSet.size);
        enrichGeneral(general.name);
      } else {
        console.log(
          `addEG2EGS built an invalid ExtendedGeneral for ${general.name}`
        );
      }

      return;
    });

  const HandlerLogic = (locals: App.Locals) => {
    if (locals.ExtendedGeneralSet === undefined) {
      locals.ExtendedGeneralSet = new Set<ExtendedGeneralType>();
    }

    if (locals.InvestmentOptions === undefined) {
      locals.InvestmentOptions = new Set<InvestmentOptionsType>();
    }

    if (locals.addEG2EGS === undefined) {
      locals.addEG2EGS = addEG2EGS;
    }

    if (locals.buffComputer === undefined) {
      locals.buffComputer = buffComputer;
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
          if (ca[3].localeCompare(qualityColor.enum.Disabled)) {
            if (ca[0].localeCompare(qualityColor.enum.Gold)) {
              if (DEBUG2) console.log(`ca false 1 for ${ca.toString()}`);
              return false;
            }
            if (ca[1].localeCompare(qualityColor.enum.Gold)) {
              if (DEBUG2) console.log(`ca false 2 for ${ca.toString()}`);
              return false;
            }
            if (ca[2].localeCompare(qualityColor.enum.Gold)) {
              if (DEBUG2) console.log(`ca false 3 for ${ca.toString()}`);
              return false;
            }
          } else {
            if (DEBUG2) console.log(`ca3 if passed ${ca.toString()}`);
          }
          if (ca[4].localeCompare(qualityColor.enum.Disabled)) {
            if (ca[3].localeCompare(qualityColor.enum.Gold)) {
              if (DEBUG2) console.log(`ca false 4 for ${ca.toString()}`);
              return false;
            } else {
              if (DEBUG2) console.log(`ca3 if passed for ${ca.toString()}`);
            }
          } else {
            if (DEBUG2) console.log(`ca4 if passed ${ca.toString()}`);
          }
          if (DEBUG2) console.log(`ca returning true for ${ca.toString()}`);
          return true;
        })
        .map((ca) => {
          const alMap = AscendingLevels.options.map((al) => {
            return [
              [...ca, al, false, false],
              [...ca, al, true, false],
              [...ca, al, false, true],
              [...ca, al, true, true], //needed for summary pages even though no one can have both
            ];
          });
          return alMap.flat();
        })
        .flat()
        .map((item) => {
          locals.InvestmentOptions.add(item);
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
