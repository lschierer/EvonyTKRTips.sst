import { provide, createContext, ContextProvider } from '@lit/context';

import {
  AscendingLevels,
  type BuffType,
  type ClassEnumType,
  Condition,
  type levelsType,
  qualityColor,
  type qualityColorType,
  syslogSeverity,
} from "@schemas/baseSchemas";

import {
  ConflictArray, 
  ConflictDatum,   
  type bookConflictsType,
  type ConflictDatumType,
 } from '@schemas/conflictSchemas'

 import {
  Note,
  Display,
  type NoteType,
  GeneralArray,
  GeneralElement,
  type GeneralArrayType,
  type GeneralElementType,
  generalSpecialists,
  type generalUseCaseType,
 } from '@schemas/generalsSchema'

 import { 
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  } from "@schemas/ExtendedGeneral";

import { 
  type BookType,
  specialSkillBook,
  standardSkillBook,
  type specialSkillBookType,
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
