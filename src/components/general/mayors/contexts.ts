import { createContext } from '@lit/context';

import {
  type ClassEnumType,
  type levelsType,
  type qualityColorType,
} from "@schemas/baseSchemas";




import {
  type GeneralArrayType,
  type generalUseCaseType,
 } from '@schemas/generalsSchema'

 


import {
  type standardSkillBookType,
 } from "@schemas/bookSchemas";


export interface generalTypeAndUse {
  type: ClassEnumType,
  use: generalUseCaseType,
}

export interface generalInvestment {
  dragon: boolean,
  beast: boolean,
  ascending:  levelsType,
  speciality1: qualityColorType,
  speciality2: qualityColorType,
  speciality3: qualityColorType,
  speciality4: qualityColorType,
  extraBooks: standardSkillBookType[],
}


export const generalsContext = createContext<GeneralArrayType | undefined>(Symbol('generals'));

export const typeAndUseMap = createContext('typeAndUseMap');

export const primaryInvestmentMap = createContext('primaryInvestmentMap');

export const secondaryInvestmentMap = createContext('secondaryInvestmentMap');
