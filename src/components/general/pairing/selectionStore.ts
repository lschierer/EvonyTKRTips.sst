import {z} from "zod";
import {map, action} from "nanostores";
import { logger } from '@nanostores/logger'

import * as b from "@schemas/baseSchemas.ts";

import {generalRole, type generalRoleType} from '@schemas/generalsSchema';

import {Book, type BookType, type standardSkillBookType} from "@schemas/bookSchemas.ts";

import {generalUseCase, type generalUseCaseType} from "@schemas/generalsSchema.ts";

const DEBUG = false;

export const BoS = z.enum(['none', 'dragon', 'beast']);
export type BoSType = z.infer<typeof BoS>;

export interface generalInvestment {
  dragon: boolean,
  beast: boolean,
  debuffLead: boolean,
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

export const PrimaryInvestmentInitialize = action(primaryInvestmentMap, 'Initialize PIM', (store) => {
  if(store.value !== undefined && store.value !== null) {
    const value = store.value;
    if(
      (value.speciality1 === undefined || value.speciality1 === null) &&
      (value.speciality2 === undefined || value.speciality2 === null) &&
      (value.speciality3 === undefined || value.speciality3 === null) &&
      (value.speciality4 === undefined || value.speciality4 === null) &&
      (value.dragon === undefined || value.dragon === null) &&
      (value.beast === undefined || value.beast === null) &&
      (value.ascending === undefined || value.ascending === null)
    ) {
      store.setKey('speciality1', b.qualityColor.enum.Gold)
      store.setKey('speciality2', b.qualityColor.enum.Gold)
      store.setKey('speciality3', b.qualityColor.enum.Gold)
      store.setKey('speciality4', b.qualityColor.enum.Gold)
      store.setKey('ascending',b.levels.enum[10])
      store.setKey('dragon', true)
      store.setKey('beast', false)
      store.setKey('debuffLead', false);
    }
  }
});

export const SecondaryInvestmentInitialize = action(secondaryInvestmentMap, 'Initialize SIM', (store) => {
  if(store.value !== undefined && store.value !== null) {
    const value = store.value;
    if(
      (value.speciality1 === undefined || value.speciality1 === null) &&
      (value.speciality2 === undefined || value.speciality2 === null) &&
      (value.speciality3 === undefined || value.speciality3 === null) &&
      (value.speciality4 === undefined || value.speciality4 === null) &&
      (value.dragon === undefined || value.dragon === null) &&
      (value.beast === undefined || value.beast === null) &&
      (value.ascending === undefined || value.ascending === null)
    ) {
      store.setKey('speciality1', b.qualityColor.enum.Gold)
      store.setKey('speciality2', b.qualityColor.enum.Gold)
      store.setKey('speciality3', b.qualityColor.enum.Gold)
      store.setKey('speciality4', b.qualityColor.enum.Gold)
      store.setKey('ascending',b.levels.enum[0])
      store.setKey('dragon', false)
      store.setKey('beast', false)
    }
  }
});
