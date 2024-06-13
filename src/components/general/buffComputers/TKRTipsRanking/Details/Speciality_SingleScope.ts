const DEBUG = false;
import { z } from 'zod';
import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import { generalUseCase, type generalUseCaseType } from '@schemas/generalsSchema.ts';
import { BuffParams, type BuffParamsType, qualityColor, type qualityColorType } from '@schemas/baseSchemas.ts';
import { AttributeMultipliers, type AttributeMultipliersType } from '@schemas/EvAns.zod.ts';
import type { SpecialityType } from '@schemas/specialitySchema.ts';
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
    let accumulator = 0;
    specialChoices.forEach((choice) => {
      if(eg.specialities && Array.isArray(eg.specialities) && eg.specialities.length > 0){
        eg.specialities.forEach((special: SpecialityType) => {
          switch(choice) {
            case qualityColor.enum.Gold:
              const gold = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Gold)
              })
              if(gold !== null && gold !== undefined){
                const additional = gold.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            case qualityColor.enum.Orange:
              const orange = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Orange)
              })
              if(orange !== null && orange !== undefined){
                const additional = orange.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            case qualityColor.enum.Purple:
              const purple = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Purple)
              })
              if(purple !== null && purple !== undefined){
                const additional = purple.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            case qualityColor.enum.Blue:
              const blue = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Blue)
              })
              if(blue !== null && blue !== undefined){
                const additional = blue.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            case qualityColor.enum.Green:
              const green = special.attribute.find((sa) => {
                return !sa.level.localeCompare(qualityColor.enum.Gold)
              })
              if(green !== null && green !== undefined){
                const additional = green.buff.reduce((a2, sb, index) => {
                  if(sb === null || sb === undefined) {
                    return a2
                  } else {
                    return BuffComp(special.name, eg.name, sb, bp, useCase, am)
                  }
                }, 0)
                accumulator += additional;
              }
            case qualityColor.enum.Disabled:
              break;
          }
        })
      }
    })
    return Math.floor(accumulator);
  }
