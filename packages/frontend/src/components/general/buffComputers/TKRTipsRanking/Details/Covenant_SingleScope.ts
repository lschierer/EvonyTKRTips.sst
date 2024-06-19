const DEBUG = false;

import {  type ExtendedGeneralType } from '@schemas/ExtendedGeneral';
import {

  type CovenantAttributeType,

  type generalUseCaseType,
} from '@schemas/generalsSchema';
import {
  CovenantAttributeCategory,
  type BuffParamsType,

} from '@schemas/baseSchemas';
import {  type AttributeMultipliersType } from '@schemas/EvAns.zod.ts';
import {type BuffFunction } from '@lib/RankingInterfaces'

const covenantExists = (generalName: string, specialName: string,  useCase: generalUseCaseType, bp: BuffParamsType, am: AttributeMultipliersType, BuffComp: BuffFunction, tc: CovenantAttributeType ): number => {
  let returnable = 0;
    returnable = tc.buff.reduce((a2, cb) => {
      if(cb === null || cb === undefined) {
        return a2;
      } else {
        a2 += BuffComp(specialName, generalName, cb, bp, useCase, am);
      }
      return a2;
    }, 0)

  return returnable;
}

export const CovenantBuffs =
  (eg: ExtendedGeneralType, useCase: generalUseCaseType, bp: BuffParamsType, am: AttributeMultipliersType, BuffComp: BuffFunction) => {

    if(DEBUG) {console.log(`CovenantBuffs for ${eg.name} ${useCase} start `)}
    let accumulator = 0;

      let additional = 0;
      if(eg.covenants && Array.isArray(eg.covenants) && eg.covenants.length > 0){
        eg.covenants.forEach((covenantInstance: CovenantAttributeType) => {
          switch(bp.covenants) {
            case CovenantAttributeCategory.enum['Civilization Covenant']:
              if(!covenantInstance.category.localeCompare(CovenantAttributeCategory.enum['Civilization Covenant'])){
                if(!covenantInstance.type.localeCompare('personal')) {
                  additional = covenantExists(eg.name, covenantInstance.category, useCase, bp, am, BuffComp, covenantInstance);
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} additional ${additional}`);
                  }
                  accumulator += additional;
                } else {
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} is passive, skipping`)
                  }
                }
              }
            // eslint-disable-next-line no-fallthrough
            case CovenantAttributeCategory.enum['Honor Covenant']:
              if (!covenantInstance.category.localeCompare(CovenantAttributeCategory.enum['Honor Covenant'])) {
                if (!covenantInstance.type.localeCompare('personal')) {
                  additional = covenantExists(eg.name, covenantInstance.category, useCase, bp, am, BuffComp, covenantInstance);
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} additional ${additional}`);
                  }
                  accumulator += additional;
                } else {
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} is passive, skipping`)
                  }
                }
              }
            // eslint-disable-next-line no-fallthrough
            case CovenantAttributeCategory.enum['Faith Covenant']:
              if (!covenantInstance.category.localeCompare(CovenantAttributeCategory.enum['Faith Covenant'])) {
                if (!covenantInstance.type.localeCompare('personal')) {
                  additional = covenantExists(eg.name, covenantInstance.category, useCase, bp, am, BuffComp, covenantInstance);
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} additional ${additional}`);
                  }
                  accumulator += additional;
                } else {
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} is passive, skipping`)
                  }
                }
              }
            // eslint-disable-next-line no-fallthrough
            case CovenantAttributeCategory.enum['Peace Covenant']:
              if (!covenantInstance.category.localeCompare(CovenantAttributeCategory.enum['Peace Covenant'])) {
                if (!covenantInstance.type.localeCompare('personal')) {
                  additional = covenantExists(eg.name, covenantInstance.category, useCase, bp, am, BuffComp, covenantInstance);
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} additional ${additional}`);
                  }
                  accumulator += additional;
                } else {
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} is passive, skipping`)
                  }
                }
              }
            // eslint-disable-next-line no-fallthrough
            case CovenantAttributeCategory.enum['Cooperation Covenant']:
              if (!covenantInstance.category.localeCompare(CovenantAttributeCategory.enum['Cooperation Covenant'])) {
                if (!covenantInstance.type.localeCompare('personal')) {
                  additional = covenantExists(eg.name, covenantInstance.category, useCase, bp, am, BuffComp, covenantInstance);
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} additional ${additional}`);
                  }
                  accumulator += additional;
                } else {
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} is passive, skipping`)
                  }
                }
              }
            // eslint-disable-next-line no-fallthrough
            case CovenantAttributeCategory.enum['War Covenant']:
              if (!covenantInstance.category.localeCompare(CovenantAttributeCategory.enum['War Covenant'])) {
                if (!covenantInstance.type.localeCompare('personal')) {
                  additional = covenantExists(eg.name, covenantInstance.category, useCase, bp, am, BuffComp, covenantInstance);
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} additional ${additional}`);
                  }
                  accumulator += additional;
                } else {
                  if (DEBUG) {
                    console.log(`${eg.name} ${useCase} ${covenantInstance.category} is passive, skipping`)
                  }
                }
              }
            // eslint-disable-next-line no-fallthrough
            case CovenantAttributeCategory.enum.Disabled:
              break;
          }
        })
      }

    return Math.floor(accumulator);
  }
