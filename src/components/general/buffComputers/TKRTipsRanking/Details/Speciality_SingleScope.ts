const DEBUG = false;

import {  type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import {  type generalUseCaseType } from '@schemas/generalsSchema.ts';
import {  type BuffParamsType, qualityColor, type qualityColorType } from '@schemas/baseSchemas.ts';
import {  type AttributeMultipliersType } from '@schemas/EvAns.zod.ts';
import type { SpecialityLevelType, SpecialityType } from '@schemas/specialitySchema.ts';
import {type BuffFunction } from '@lib/RankingInterfaces'

export const SpecialityBuffs =
  (eg: ExtendedGeneralType, useCase: generalUseCaseType, bp: BuffParamsType, am: AttributeMultipliersType, BuffComp: BuffFunction) => {
    const specialChoices: qualityColorType[] = new Array<qualityColorType>();
    specialChoices.push(
      bp.special1,
      bp.special2,
      bp.special3,
      bp.special4,
    )
    if(DEBUG) {console.log(`SpecialityBuffs for ${eg.name} ${useCase}`)}
    let accumulator = 0;
    specialChoices.forEach((choice) => {
      if(eg.specialities && Array.isArray(eg.specialities) && eg.specialities.length > 0){
        eg.specialities.forEach((special: SpecialityType) => {
          let thisSpecial: SpecialityLevelType | undefined;
          switch(choice) {
            case qualityColor.enum.Gold:
              thisSpecial = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Gold)
              })
              if(thisSpecial !== null && thisSpecial !== undefined){
                const additional = thisSpecial.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            // eslint-disable-next-line no-fallthrough
            case qualityColor.enum.Orange:
              thisSpecial = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Orange)
              })
              if(thisSpecial !== null && thisSpecial !== undefined){
                const additional = thisSpecial.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            // eslint-disable-next-line no-fallthrough
            case qualityColor.enum.Purple:
              thisSpecial = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Purple)
              })
              if(thisSpecial !== null && thisSpecial !== undefined){
                const additional = thisSpecial.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            // eslint-disable-next-line no-fallthrough
            case qualityColor.enum.Blue:
              thisSpecial = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Blue)
              })
              if(thisSpecial !== null && thisSpecial !== undefined){
                const additional = thisSpecial.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            // eslint-disable-next-line no-fallthrough
            case qualityColor.enum.Green:
              thisSpecial = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Gold)
              })
              if(thisSpecial !== null && thisSpecial !== undefined){
                const additional = thisSpecial.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            // eslint-disable-next-line no-fallthrough
            case qualityColor.enum.Disabled:
              break;
          }
        })
      }
    })
    return Math.floor(accumulator);
  }
