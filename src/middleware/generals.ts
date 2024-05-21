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

import {EvAnsScoreComputer} from './EvAnsScoreComputer';

const DEBUG = true;


import { arrayUniqueFilter } from '@lib/util'

export const DisplayGeneralsMWRoutes = ["/generals/"];

export const DisplayGeneralsMW = defineMiddleware(({ locals, url }, next) => {
  let continueHandler = false;

  const re = /[\[\]'",]/g;

  //define a bunch of functions almost like a class

  const InvestmentOptions2Key = z.function()
    .args(BuffParams)
    .returns(z.string())
    .implement((BP: BuffParamsType) => {
      return JSON.stringify(BP).replace(re, '');
    })

  DisplayGeneralsMWRoutes.map((route) => {
    if (url.pathname.startsWith(route)) {
      continueHandler = true;
    }
  });
  
  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  const EvAnsBuff = z
    .function()
    .args(z.string(), Display, BuffParams)
    .returns(z.promise(z.number()))
    .implement(async (name, display, BP: BuffParamsType) => {

      if (DEBUG) console.log(`EvAnsBuff starting for ${name}`)
      const eg: ExtendedGeneralType = locals.ExtendedGeneralMap.get(name)
      const gc = eg.general;

      if (eg.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
        if (DEBUG) { console.log(`called early for ${name} status is ${eg.status}`) }
        return -6;
      }

      const _BP: BuffParamsType = {
        special1: BP.special1,
        special2: BP.special2,
        special3: BP.special3,
        special4: BP.special4,
        special5: BP.special5,
        stars: (display.localeCompare(Display.enum.assistant)) ? BP.stars : AscendingLevels.enum[0],
        dragon: BP.dragon,
        beast: BP.beast,
      }

      
      const rankScore = await EvAnsScoreComputer(generalUseCase.enum.Attack, eg, BP);
      if(DEBUG) {
        console.log(`${eg.general.name}: rankScore: ${rankScore}`)
      }
      return rankScore;
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
        if (!entry.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
          if (DEBUG) { console.log(`called when already complete`) }
          return true
        } else if (!entry.status.localeCompare(ExtendedGeneralStatus.enum.processing)) {
          if (DEBUG) { console.log(`called while still processing`) }
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
                  if (DEBUG) { console.log(`enrichGeneral ${gn}: pushing ${v.data.name}`) }
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
          if (DEBUG) {
            console.log(`enrichGeneral for ${gn} complete with status ${success}`)
          }
          entry.status = ExtendedGeneralStatus.enum.complete;
          if (DEBUG) {
            console.log(`enrichGeneral work done for ${gn}`)
            console.log(`specials: ${entry.specialities.length}`)
            console.log(`books: ${entry.books.length}`)
            console.log(`computedBuffs: ${entry.computedBuffs.length}`)
            console.log(`status: ${entry.status}`)
          }
          return success;
        } else {
          console.log(`failed to set buffs`);
          return false;
        }
      }
      return false
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

    
    if (locals.addEG2EGS === undefined) {
      locals.addEG2EGS = addEG2EGS;
    }

    if (locals.enrichGeneral === undefined) {
      locals.enrichGeneral = enrichGeneral;
    }

    if (locals.EvAnsBuff === undefined) {
      locals.EvAnsBuff = EvAnsBuff;
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
