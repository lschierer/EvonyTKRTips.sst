import { defineMiddleware } from "astro:middleware";
import { getCollection, getEntry, type CollectionEntry,  } from "astro:content";

import {z} from 'zod';


import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
  qualityColor,
  
} from "@schemas/baseSchemas";

import { 
  ConflictDatum,
  type ConflictDatumType,
 } from '@schemas/conflictSchemas'

 import {
  Display,
  GeneralClass,
  generalUseCase,
 } from '@schemas/generalsSchema'

 import {
  Speciality,
  type SpecialityType,
 } from '@schemas/specialitySchema'

 import { 
  ExtendedGeneral,
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type GeneralPairType,
  } from "@schemas/ExtendedGeneral";

import { 
  Book,
  type BookType,
  type specialSkillBookType,
  type standardSkillBookType,
 } from "@schemas/bookSchemas";


const DEBUG = true;

export const DisplayGeneralsMWRoutes = ["/generals/"];

export const DisplayGeneralsMW = defineMiddleware(
  async ({ locals, url }, next) => {
    let continueHandler = false;

    const re = /[[\]'",]/g;

    //define a bunch of functions almost like a class

    DisplayGeneralsMWRoutes.map((route) => {
      if (url.pathname.startsWith(route)) {
        continueHandler = true;
      }
    });

    
    const addEG2EGS = z
      .function()
      .args(GeneralClass)
      .returns(z.promise(z.boolean()))
      .implement(async (general) => {
        if (DEBUG)
          console.log(
            `middleware generals addEG2EGS running for ${general.name}`
          );
        if (locals.ExtendedGenerals.length > 0) {
          if (
            locals.ExtendedGenerals.some((element) => {
              return !general.name.localeCompare(element.general.name);
            })
          )
            return false;
        }
        const valid = GeneralClass.safeParse(general)
        if(valid.success) {
          const toAdd: ExtendedGeneralType = {
            general: valid.data,
            specialities: new Array<SpecialityType>(),
            books: new Array<
              BookType | specialSkillBookType | standardSkillBookType
            >(),
          };
          const test = ExtendedGeneral.safeParse(toAdd);
          if (test.success) {
            if (DEBUG)
              console.log(
                `addEG2EGS built a valid ExtendedGeneral for ${general.name}`
              );
            if (DEBUG)
              console.log(
                `addEG2EGS: map size: ${locals.ExtendedGenerals.length}`
              );
            if (
              !locals.ExtendedGenerals.some((element) => {
                return !test.data.general.name.localeCompare(
                  element.general.name
                );
              })
            ) {
              locals.ExtendedGenerals.push(test.data);
            }
            if (DEBUG)
              console.log(
                `addEG2EGS: map size: ${locals.ExtendedGenerals.length}.`
              );
          } else {
            console.log(
              `addEG2EGS built an invalid ExtendedGeneral for ${general.name}`
            );
          }
        } else {
          console.log(`addEG2EGS recieved an invalid GeneralClass object`)
        }
        
        return true;
      });

    const inializeConflicts = async () => {
      const ConflictCollection: CollectionEntry<'generalConflictData'>[] = await getCollection("generalConflictData");
        if (ConflictCollection !== undefined && ConflictCollection !== null) {
          
        }
    }

    const HandlerLogic = async (locals: App.Locals) => {
      if (locals.ExtendedGenerals === undefined) {
        locals.ExtendedGenerals = new Array<ExtendedGeneralType>();
      }

      if (locals.ConflictData === undefined) {
        locals.ConflictData = new Array<ConflictDatumType>();
      }

      if (locals.CachedPairs === undefined) {
        locals.CachedPairs = new Array<GeneralPairType>();
      }

      if (locals.addEG2EGS === undefined) {
        locals.addEG2EGS = addEG2EGS;
      }
    };

    //end of function definitions

    if (continueHandler) {
      if (DEBUG) console.log(`DisplayGeneralsMW running`);
      await HandlerLogic(locals);
    }

    return next();
  }
);
