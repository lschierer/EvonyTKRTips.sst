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

export const DisplayGeneralsMWRoutes = ["/generals/"];

export const DisplayGeneralsMW = defineMiddleware(({ locals, url }, next) => {
  let continueHandler = false;
  DisplayGeneralsMWRoutes.map((route) => {
    if (url.pathname.startsWith(route)) {
      continueHandler = true;
    }
  });
  //define a bunch of functions almost like a class

  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  const EvAnsBuff = z
    .function()
    .args(GeneralClass, generalUseCase, BuffParams)
    .returns(z.union([z.number(), z.promise(z.number())]))
    .implement(async (gc, gu, ap) => {
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
      let BSS = 0;
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

      return BAS + BSS + fourSB + threeSS + AES;
    });

  const buffComputer = z
    .function()
    .args(GeneralClass)
    .returns(z.promise(z.array(BuffParams)))
    .implement(async (general) => {
      const data = Array<BuffParamsType>();
      locals.InvestmentOptions.forEach(async (IO) => {
        const v1 = InvestmentOptionsSchema.safeParse(IO);
        if (v1.success) {
          const thisOption = v1.data;

          const BP: BuffParamsType = {
            id: general.name,
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
            let t = qualityColor.safeParse(thisOption.pop());
            if (t.success) {
              BP.special1 = t.data;
            } else {
              console.log(`error parsing InvestmentOptions ${t.error.message}`);
              console.log(JSON.stringify(IO));
            }
            t = qualityColor.safeParse(thisOption.pop());
            if (t.success) {
              BP.special2 = t.data;
            } else {
              console.log(`error parsing InvestmentOptions ${t.error.message}`);
              console.log(JSON.stringify(IO));
            }
            t = qualityColor.safeParse(thisOption.pop());
            if (t.success) {
              BP.special3 = t.data;
            } else {
              console.log(`error parsing InvestmentOptions ${t.error.message}`);
              console.log(JSON.stringify(IO));
            }
            if (general.specialities.length >= 4) {
              t = qualityColor.safeParse(thisOption.pop());
              if (t.success) {
                BP.special4 = t.data;
              } else {
                console.log(
                  `error parsing InvestmentOptions ${t.error.message}`
                );
                console.log(JSON.stringify(IO));
              }
              if (general.specialities.length === 5) {
                t = qualityColor.safeParse(thisOption.pop());
                if (t.success) {
                  BP.special5 = t.data;
                } else {
                  console.log(
                    `error parsing InvestmentOptions ${t.error.message}`
                  );
                  console.log(JSON.stringify(IO));
                }
              } else {
                thisOption.pop()
              }
            } else {
              thisOption.pop()
            }
            let al = AscendingLevels.safeParse(thisOption.pop());
            if (al.success) {
              BP.stars = al.data;
            } else {
              console.log(
                `error parsing InvestmentOptions ${al.error.message}`
              );
              console.log(JSON.stringify(IO));
            }
            const td = z.boolean().safeParse(thisOption.pop())
            if(td.success) {
              BP.dragon = td.data;
            } else {
              console.log(`error parsing InvestmentOptions ${td.error.message}`)
            }
            const tb = z.boolean().safeParse(thisOption.pop());
            if(tb.success) {
              BP.beast = tb.data
            } else {
              console.log(`error parsing InvestmentOptions ${tb.error.message}`)
            }
          }
          BP.EvAnsRanking = Math.floor(
            await EvAnsBuff(general, generalUseCase.enum.Attack, BP)
          );
          data.push(BP);
        }
      });

      return data;
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
          const general: GeneralClassType = entry.general;
          if (
            Array.isArray(general.specialities) &&
            general.specialities.length > 0
          ) {
            await Promise.all(
              general.specialities.map(async (special) => {
                const sC = await getEntry("specialities", special);
                if (sC !== undefined) {
                  const v = Speciality.safeParse(sC.data);
                  if (v.success) {
                    entry.general.specialities.push(v.data);
                  } else {
                    console.log(`failed to get ${special} for ${general.name}`);
                    console.log(v.error.message);
                  }
                }
              })
            );
            if (
              general.specialities.length !== entry.general.specialities.length
            ) {
              console.log(
                `specialities for ${general.name}: expected: ${general.specialities.length} have: ${entry.general.specialities.length}`
              );
              success = false;
            }
          }
          if (Array.isArray(general.books) && general.books.length > 0) {
            await Promise.all(
              general.books.map(async (book) => {
                const bC = await getEntry("skillBooks", book);
                if (bC !== undefined) {
                  const v = Book.safeParse(bC.data);
                  if (v.success) {
                    entry.general.books.push(v.data);
                  } else {
                    console.log(`failed to get ${book} for ${general.name}`);
                    console.log(v.error.message);
                  }
                }
              })
            );
            if (general.books.length !== entry.general.books.length) {
              console.log(
                `books for ${general.name}: have ${entry.general.books.length} expected ${general.books.length}`
              );
              success = false;
            }
          }
          if (success) {
            entry.general.computedBuffs = await buffComputer(general);
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
      let success = true;
      const toAdd: ExtendedGeneralType = {
        general: general,
        specialities: [],
        books: [],
        computedBuffs: [],
        complete: false,
      };
      locals.ExtendedGeneralSet.add(toAdd);
      //enrichGeneral(general.name);
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
