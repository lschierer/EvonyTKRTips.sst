import { defineMiddleware } from "astro:middleware";
import type { APIContext } from "astro";
import {
  getEntry,
  getCollection,
  z,
  type CollectionEntry,
} from "astro:content";

import { BaseN } from "js-combinatorics";

import * as d3 from "d3";

import {
  Attribute,
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
  qualityColor,
  Speciality,
  specialSkillBook,
  type specialSkillBookType,
  type GeneralClassType,
  type SpecialityType,
  type BookType,
  type standardSkillBookType,
} from "@schemas/index";

import { EvAnsScoreComputer } from "./EvAnsScoreComputer";

const DEBUG = true;

import { arrayUniqueFilter } from "@lib/util";

export const DisplayGeneralsMWRoutes = ["/generals/"];

export const DisplayGeneralsMW = defineMiddleware(({ locals, url }, next) => {
  let continueHandler = false;

  const re = /[\[\]'",]/g;

  //define a bunch of functions almost like a class

  const InvestmentOptions2Key = z
    .function()
    .args(BuffParams)
    .returns(z.string())
    .implement((BP: BuffParamsType) => {
      return JSON.stringify(BP).replace(re, "");
    });

  DisplayGeneralsMWRoutes.map((route) => {
    if (url.pathname.startsWith(route)) {
      continueHandler = true;
    }
  });

  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  const GeneralBuffs = z
    .function()
    .args(z.string(), Display, BuffParams)
    .returns(z.promise(z.boolean()))
    .implement(async (name, display, BP: BuffParamsType) => {
      if (DEBUG) console.log(`EvAnsBuff starting for ${name}`);
      const eg: ExtendedGeneralType = locals.ExtendedGeneralMap.get(name);
      const gc = eg.general;

      if (!eg.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
        if (DEBUG) {
          console.log(`${name} status is ${eg.status}`);
        }
        return true;
      } else if(
        !eg.status.localeCompare(ExtendedGeneralStatus.enum.created) ||
        !eg.status.localeCompare(ExtendedGeneralStatus.enum.fetching)
      ){
        if(DEBUG) {
          console.log(`${name} status is ${eg.status}`)
          console.log(`called early`)
          return false
        }
       } else {
        if (DEBUG) {
          console.log(`${name} GeneralBuffs continuing to call EvAnsScoreComputer`);
        }
      }

      const _BP: BuffParamsType = {
        special1: BP.special1,
        special2: BP.special2,
        special3: BP.special3,
        special4: BP.special4,
        special5: BP.special5,
        stars: display.localeCompare(Display.enum.assistant)
          ? BP.stars
          : AscendingLevels.enum[0],
        dragon: BP.dragon,
        beast: BP.beast,
      };

      const rankScore = EvAnsScoreComputer(generalUseCase.enum.Attack, eg, _BP);
      if (DEBUG) {
        console.log(`in GeneralBuffs, got rankScore: ${rankScore} for ${name}`);
      }
      const hashKey = InvestmentOptions2Key(_BP);
      eg.computedBuffs.set(hashKey, {
        EvAns: rankScore,
      });
      if (DEBUG) {
        console.log(`hashKey: ${hashKey}`);
        console.log(`${eg.general.name}: rankScore: ${rankScore}`);
        console.log(
          `computedBuffs: ${JSON.stringify(Array.from(eg.computedBuffs))}`
        );
        console.log(eg.computedBuffs.get(hashKey)?.EvAns);
      }

      return true;
    });

  const enrichGeneral = z
    .function()
    .args(z.string())
    .returns(z.promise(z.boolean()))
    .implement(async (gn) => {
      if (DEBUG) console.log(`starating to enrich ${gn}`);
      let success = true;
      const entry: ExtendedGeneralType | null =
        locals.ExtendedGeneralMap.get(gn) ?? null;

      if (entry === undefined || entry === null) {
        console.log(`failed to find general ${gn}`);
        return false;
      } else {
        if (!entry.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
          return true;
        } else if (
          !entry.status.localeCompare(ExtendedGeneralStatus.enum.processing)
        ) {
          return false;
        } else if (
          !entry.status.localeCompare(ExtendedGeneralStatus.enum.fetching)
        ) {
          return false;
        } else {
          entry.status = ExtendedGeneralStatus.enum.fetching;
          if (
            !Array.isArray(entry.general.specialities) ||
            entry.general.specialities.length === 0
          ) {
            console.log(`${gn} has no specialities`);
            return false;
          } else {
            await Promise.all(
              entry.general.specialities.map(async (special) => {
                const sC = await getEntry("specialities", special);
                if (sC === undefined) {
                  console.log(`failed to fetch special ${special} for ${gn}`);
                  return false;
                } else {
                  const v = Speciality.safeParse(sC.data);
                  if (v.error) {
                    console.log(
                      `got invalid speciality for ${special} of ${gn}`
                    );
                    return false;
                  } else {
                    entry.specialities.push(v.data);
                  }
                }
              })
            ).then(() => {
              if (
                Array.isArray(entry.general.specialities) &&
                entry.general.specialities.length !== entry.specialities.length
              ) {
                console.log(
                  `specialities for ${entry.general.name}: expected: ${entry.general.specialities.length} have: ${entry.specialities.length}`
                );
                return false;
              } else {
                if (DEBUG)
                  console.log(
                    `enrichGeneral ${gn} specials success ${entry.specialities.length}`
                  );
              }
            });
          }
          if (
            !Array.isArray(entry.general.books) ||
            entry.general.books.length === 0
          ) {
            console.log(`${gn} has no books`);
            return false;
          } else {
            await Promise.all(
              entry.general.books.map(async (book) => {
                const bC = await getEntry("skillBooks", book);
                if (bC === undefined) {
                  console.log(`failed to fetch book ${book} for ${gn}`);
                  return false;
                } else {
                  const v = Book.safeParse(bC.data);
                  if (v.error) {
                    console.log(`got invalid book ${book} for ${gn}`);
                    return false;
                  } else {
                    entry.books.push(v.data);
                  }
                }
              })
            ).then(() => {
              if (
                Array.isArray(entry.general.books) &&
                entry.general.books.length !== entry.books.length
              ) {
                console.log(
                  `${gn} books: have ${entry.books.length} expected: ${entry.general.books.length}`
                );
                return false;
              } else {
                if (DEBUG) {
                  console.log(
                    `enrichGeneral ${gn} books success ${entry.books.length}`
                  );
                }
              }
            });
          }
          entry.status = ExtendedGeneralStatus.enum.processing;

          const pbs = await GeneralBuffs(gn, Display.enum.primary, {
            special1: qualityColor.enum.Gold,
            special2: qualityColor.enum.Gold,
            special3: qualityColor.enum.Gold,
            special4: qualityColor.enum.Gold,
            special5: qualityColor.enum.Disabled,
            stars: AscendingLevels.enum[10],
            dragon: true,
            beast: true,
          });
          if (!pbs) {
            console.log(`${gn}: failed to get GeneralBuffs as primary`);
            return false;
          }
          const abs = await GeneralBuffs(gn, Display.enum.assistant, {
            special1: qualityColor.enum.Gold,
            special2: qualityColor.enum.Gold,
            special3: qualityColor.enum.Gold,
            special4: qualityColor.enum.Gold,
            special5: qualityColor.enum.Disabled,
            stars: AscendingLevels.enum[0],
            dragon: true,
            beast: true,
          });
          if (!abs) {
            console.log(`${gn}: failed to get GeneralBuffs as assistant`);
            return false;
          }
          const sbs = await GeneralBuffs(gn, Display.enum.summary, {
            special1: qualityColor.enum.Gold,
            special2: qualityColor.enum.Gold,
            special3: qualityColor.enum.Gold,
            special4: qualityColor.enum.Gold,
            special5: qualityColor.enum.Disabled,
            stars: AscendingLevels.enum[10],
            dragon: true,
            beast: true,
          });
          if (!sbs) {
            console.log(`${gn}: failed to get GeneralBuffs as summary`);
            return false;
          }
        }
        entry.status = ExtendedGeneralStatus.enum.complete;
        if (DEBUG) {
          console.log(`enrichGeneral work done for ${gn}`);
          console.log(`specials: ${entry.specialities.length}`);
          console.log(`books: ${entry.books.length}`);
          console.log(`computedBuffs: ${entry.computedBuffs.size}`);
          console.log(`status: ${entry.status}`);
        }
        return success;
      }
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
      if (locals.ExtendedGeneralMap.size > 0) {
        if (locals.ExtendedGeneralMap.has(general.name)) return;
      }
      const success = true;
      const toAdd: ExtendedGeneralType = {
        general: general,
        specialities: new Array<SpecialityType>(),
        books: new Array<
          BookType | specialSkillBookType | standardSkillBookType
        >(),
        computedBuffs: new Map<string, { EvAns: number }>(),
        status: ExtendedGeneralStatus.enum.created,
      };
      const test = ExtendedGeneral.safeParse(toAdd);
      if (test.success) {
        if (DEBUG)
          console.log(
            `addEG2EGS built a valid ExtendedGeneral for ${general.name}`
          );
        if (DEBUG)
          console.log(`addEG2EGS: map size: ${locals.ExtendedGeneralMap.size}`);
        if (!locals.ExtendedGeneralMap.has(test.data.general.name)) {
          locals.ExtendedGeneralMap.set(test.data.general.name, test.data);
        }
        if (DEBUG)
          console.log(
            `addEG2EGS: map size: ${locals.ExtendedGeneralMap.size} about to enrich.`
          );
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
      locals.ExtendedGeneralMap = new d3.InternMap<
        string,
        ExtendedGeneralType
      >();
    }

    if (locals.addEG2EGS === undefined) {
      locals.addEG2EGS = addEG2EGS;
    }

    if (locals.enrichGeneral === undefined) {
      locals.enrichGeneral = enrichGeneral;
    }

    if (locals.GeneralBuffs === undefined) {
      locals.GeneralBuffs = GeneralBuffs;
    }

    if (locals.InvestmentOptions2Key === undefined) {
      locals.InvestmentOptions2Key = InvestmentOptions2Key;
    }
  };

  //end of function definitions

  if (continueHandler) {
    if (DEBUG) console.log(`DisplayGeneralsMW running`);
    HandlerLogic(locals);
  }

  return next();
});
