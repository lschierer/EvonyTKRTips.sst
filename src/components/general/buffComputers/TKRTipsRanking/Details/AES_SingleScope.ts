const DEBUG = false;

import { type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import { type AscendingType, type generalUseCaseType } from '@schemas/generalsSchema.ts';
import { AscendingLevels, type BuffParamsType,  } from '@schemas/baseSchemas.ts';
import { type AttributeMultipliersType } from '@schemas/EvAns.zod.ts';
import {type BuffFunction } from '@lib/RankingInterfaces'

export const AscendingBuffs =
  (eg: ExtendedGeneralType, useCase: generalUseCaseType, bp: BuffParamsType, am: AttributeMultipliersType, BuffComp: BuffFunction) => {

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
                  const additional = ascending.buff.reduce((a2, ab, index) => {
                    if (ab === null || ab === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, ab, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['4red']:
                
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['4red'])) {
                  const additional = ascending.buff.reduce((a2, sb, index) => {
                    if (sb === null || sb === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, sb, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['3red']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['3red'])) {
                  const additional = ascending.buff.reduce((a2, sb, index) => {
                    if (sb === null || sb === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, sb, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['2red']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['2red'])) {
                  const additional = ascending.buff.reduce((a2, sb, index) => {
                    if (sb === null || sb === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, sb, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['1red']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['1red'])) {
                  const additional = ascending.buff.reduce((a2, sb, index) => {
                    if (sb === null || sb === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, sb, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
                break;
              case AscendingLevels.enum['5purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['5purple'])) {
                  const additional = ascending.buff.reduce((a2, ab, index) => {
                    if (ab === null || ab === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, ab, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['4purple']:

                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['4purple'])) {
                  const additional = ascending.buff.reduce((a2, sb, index) => {
                    if (sb === null || sb === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, sb, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['3purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['3purple'])) {
                  const additional = ascending.buff.reduce((a2, sb, index) => {
                    if (sb === null || sb === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, sb, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['2purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['2purple'])) {
                  const additional = ascending.buff.reduce((a2, sb, index) => {
                    if (sb === null || sb === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, sb, bp, useCase, am)
                    }
                  }, 0)
                  accumulator += additional;
                }
              // eslint-disable-next-line no-fallthrough
              case AscendingLevels.enum['1purple']:
                if (ascending !== null && ascending !== undefined && !ascending.level.localeCompare(AscendingLevels.enum['1purple'])) {
                  const additional = ascending.buff.reduce((a2, sb, index) => {
                    if (sb === null || sb === undefined) {
                      return a2
                    } else {
                      return BuffComp(`${ascending.level}.${index}`, eg.name, sb, bp, useCase, am)
                    }
                  }, 0)
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
