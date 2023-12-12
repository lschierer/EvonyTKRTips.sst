import {z} from "zod";
import {map, action} from "nanostores";
import { logger } from '@nanostores/logger'

import * as b from "@schemas/baseSchemas.ts";

import {Book, type BookType, type standardSkillBookType} from "@schemas/bookSchemas.ts";

import {generalUseCase, type generalUseCaseType} from "@schemas/generalsSchema.ts";

const DEBUG = false;

export const BoS = z.enum(['none', 'dragon', 'beast']);
export type BoSType = z.infer<typeof BoS>;

export interface generalInvestment {
  dragon: boolean,
  beast: boolean,
  ascending: b.levelsType,
  speciality1: b.qualityColorType,
  speciality2: b.qualityColorType,
  speciality3: b.qualityColorType,
  speciality4: b.qualityColorType,
  extraBooks: standardSkillBookType[],
}

export interface generalTypeAndUse {
  type: b.ClassEnumType,
  use: generalUseCaseType,
}

export const typeAndUseMap = map<generalTypeAndUse>();

export const primaryInvestmentMap = map<generalInvestment>();

export const secondaryInvestmentMap = map<generalInvestment>();

let destroy = null;

if(DEBUG) {
  destroy = logger({
  'GeneralTypeAndUseCase': typeAndUseMap,
  'PrimaryGeneralInvestment': primaryInvestmentMap,
  'SecondaryGeneralInvestment': secondaryInvestmentMap,
})
}

export const pickType = action(typeAndUseMap, 'Pick Type', 
(store, newType: b.ClassEnumType) => {
  store.setKey('type',newType)
})

export const pickUseCase = action(typeAndUseMap, 'Pick Use Case', 
(store, newCase: generalUseCaseType) => {
  store.setKey('use', newCase);
})

