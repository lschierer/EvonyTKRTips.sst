import { provide, createContext, ContextProvider } from '@lit/context';

import {
  ClassEnum,
  GeneralArray,
  generalUseCase,
  levels,
  qualityColor,
  standardSkillBook,
  type ClassEnumType,
  type GeneralArrayType,
  type GeneralElementType,
  type generalUseCaseType,
  type levelsType,
  type qualityColorType,
  type standardSkillBookType,
} from "@schemas/index";


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
