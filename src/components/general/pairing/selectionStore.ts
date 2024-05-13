import {z} from "astro:content";
import {map} from "nanostores";
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

export function pickType(newType: b.ClassEnumType){
  typeAndUseMap.setKey('type', newType);
}


export function pickUseCase( newCase: generalUseCaseType) {
  typeAndUseMap.setKey('use', newCase);
}

export function PrimaryInvestmentInitialize () {
  if(primaryInvestmentMap.value !== undefined && primaryInvestmentMap.value !== null) {
    const value = primaryInvestmentMap.value;
    if(
      (value.speciality1 === undefined || value.speciality1 === null) &&
      (value.speciality2 === undefined || value.speciality2 === null) &&
      (value.speciality3 === undefined || value.speciality3 === null) &&
      (value.speciality4 === undefined || value.speciality4 === null) &&
      (value.dragon === undefined || value.dragon === null) &&
      (value.beast === undefined || value.beast === null) &&
      (value.ascending === undefined || value.ascending === null)
    ) {
      primaryInvestmentMap.setKey('speciality1', b.qualityColor.enum.Gold)
      primaryInvestmentMap.setKey('speciality2', b.qualityColor.enum.Gold)
      primaryInvestmentMap.setKey('speciality3', b.qualityColor.enum.Gold)
      primaryInvestmentMap.setKey('speciality4', b.qualityColor.enum.Gold)
      primaryInvestmentMap.setKey('ascending',b.levels.enum[10])
      primaryInvestmentMap.setKey('dragon', true)
      primaryInvestmentMap.setKey('beast', false)
      primaryInvestmentMap.setKey('debuffLead', false);
    }
  }
};

export function SecondaryInvestmentInitialize () {
  if(secondaryInvestmentMap.value !== undefined && secondaryInvestmentMap.value !== null) {
    const value = secondaryInvestmentMap.value;
    if(
      (value.speciality1 === undefined || value.speciality1 === null) &&
      (value.speciality2 === undefined || value.speciality2 === null) &&
      (value.speciality3 === undefined || value.speciality3 === null) &&
      (value.speciality4 === undefined || value.speciality4 === null) &&
      (value.dragon === undefined || value.dragon === null) &&
      (value.beast === undefined || value.beast === null) &&
      (value.ascending === undefined || value.ascending === null)
    ) {
      secondaryInvestmentMap.setKey('speciality1', b.qualityColor.enum.Gold)
      secondaryInvestmentMap.setKey('speciality2', b.qualityColor.enum.Gold)
      secondaryInvestmentMap.setKey('speciality3', b.qualityColor.enum.Gold)
      secondaryInvestmentMap.setKey('speciality4', b.qualityColor.enum.Gold)
      secondaryInvestmentMap.setKey('ascending',b.levels.enum[0])
      secondaryInvestmentMap.setKey('dragon', false)
      secondaryInvestmentMap.setKey('beast', false)
    }
  }
};
