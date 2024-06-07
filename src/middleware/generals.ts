import { defineMiddleware } from 'astro:middleware';

import { z } from 'zod';

import {
  type ConflictDatumType,
} from '@schemas/conflictSchemas';

import {
  GeneralClass,
} from '@schemas/generalsSchema';

import {
  type GeneralPairType,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

const DEBUG = false;

export const DisplayGeneralsMWRoutes = ['/generals/'];

export const DisplayGeneralsMW = defineMiddleware(
  async ({ locals, url }, next) => {
    let continueHandler = false;

    //define a bunch of functions almost like a class

    DisplayGeneralsMWRoutes.map((route) => {
      if (url.pathname.startsWith(route)) {
        continueHandler = true;
      }
    });

    const addEG2EGS = z
      .function()
      .args(GeneralClass)
      .returns(z.boolean())
      .implement((general) => {
        if (DEBUG) {
          console.log(
            `middleware generals addEG2EGS running for ${general.name}`
          );
        }
        if (
          Array.isArray(locals.CachedGenerals) &&
          locals.CachedGenerals.length > 0
        ) {
          const allDone = locals.CachedGenerals.some((element) => {
            if (!general.name.localeCompare(element.name)) {
              return true;
            }
            return false;
          });
          if (allDone) {
            return false;
          }
        } else {
          const valid = GeneralClass.safeParse(general);
          if (valid.success) {
            //double-checking because I seem to be hitting race conditions.
            const present = locals.CachedGenerals.some(
              (element: ExtendedGeneralType) => {
                return !element.name.localeCompare(valid.data.name);
              }
            );
            if (!present) {
              locals.CachedGenerals.push(valid.data);
              if (DEBUG)
                console.log(
                  `addEG2EGS built a valid ExtendedGeneralType for ${general.name}`
                );
              console.log(
                `addEG2EGS: map size: ${locals.CachedGenerals.length}`
              );
              return true;
            }
          } else {
            console.log(`addEG2EGS recieved an invalid GeneralClass object`);
            return false;
          }
        }
        return false;
      });

    const HandlerLogic = async (locals: App.Locals) => {
      if (locals.CachedGenerals === undefined) {
        locals.CachedGenerals = new Array<ExtendedGeneralType>();
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
