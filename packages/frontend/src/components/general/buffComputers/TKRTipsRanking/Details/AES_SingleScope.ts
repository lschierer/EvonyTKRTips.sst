const DEBUG = false;

import { type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import { type AscendingType, type generalUseCaseType } from '@schemas/generalsSchema.ts';
import { AscendingLevels, type BuffParamsType, } from '@schemas/baseSchemas.ts';
import { type AttributeMultipliersType } from '@schemas/EvAns.zod.ts';
import {type BuffFunction } from '@lib/RankingInterfaces'

const singleLevel = (ascending: AscendingType,
                     generalName: string, bp: BuffParamsType,
                     useCase: generalUseCaseType,
                     am: AttributeMultipliersType, BuffComp: BuffFunction): number => {
  const additional = ascending.buff.reduce((a2, ab, index) => {
    let buffTotal = 0;
    if (ab !== null && ab !== undefined) {
      buffTotal = BuffComp(`${ascending.level}.${index}`, generalName, ab, bp, useCase, am)
    }
    a2 += buffTotal
    return a2;
  }, 0)
  if(DEBUG) {
    console.log(`${ascending.level} accumulating ${additional}  for ${generalName}`)
  }
  return additional;
}

export const AscendingBuffs =
  (eg: ExtendedGeneralType, useCase: generalUseCaseType,
   bp: BuffParamsType, am: AttributeMultipliersType, BuffComp: BuffFunction) => {

    if(DEBUG) {console.log(`AscendingBuffs: ${eg.name}, ${useCase}`)}

    let accumulator = 0;

      if(eg.stars?.localeCompare(AscendingLevels.enum['0stars'])){
        if(eg.ascending && Array.isArray(eg.ascending) && eg.ascending.length > 0) {
          eg.ascending.forEach((ascending: AscendingType) => {
            if(DEBUG) {
              console.log(`AscendingBuffs: ${eg.name}, ${useCase} ${ascending.level}`)
            }
            switch (bp.stars) {
              case AscendingLevels.enum['5red']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['5red'])) {
                  let additional = 0;
                  if(DEBUG) { console.log(`matched 5red`) }
                  additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['4red']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['4red'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['3red']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['3red'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['2red']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['2red'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['1red']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['1red'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
                break;
              case AscendingLevels.enum['5purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['5purple'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['4purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['4purple'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['3purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['3purple'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['2purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['2purple'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['1purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['1purple'])) {
                  const additional = singleLevel(ascending, eg.name, bp, useCase, am, BuffComp);
                  accumulator += additional;
                }
                break;
              case AscendingLevels.enum['0stars']:
                break;
            }
          })
        }
      }
    return Math.floor(accumulator);
  }
