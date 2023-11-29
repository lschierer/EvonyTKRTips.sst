import {z} from "zod";

import {
  generalUseCase,
  type generalUseCaseType,
  type levelsType,
  type qualityColorType,
  type standardSkillBookType,
  ClassEnum,
  type ClassEnumType,
} from "@schemas/index";
import {map} from "nanostores";
import { logger } from '@nanostores/logger'

import {boolean} from "zod";

export const BoS = z.enum(['none', 'dragon', 'beast']);
export type BoSType = z.infer<typeof BoS>;

export interface generalInvestment {
  dragon: boolean,
  beast: boolean,
  ascending: levelsType,
  speciality1: qualityColorType,
  speciality2: qualityColorType,
  speciality3: qualityColorType,
  speciality4: qualityColorType,
  extraBooks: standardSkillBookType[],
}

export interface generalTypeAndUse {
  type: ClassEnumType,
  use: generalUseCaseType,
}

export const typeAndUseMap = map<generalTypeAndUse>({
  type: ClassEnum.enum.all,
  use: generalUseCase.enum.all,
})

export const primaryInvestmentMap = map<generalInvestment>();

export const secondaryInvestmentMap = map<generalInvestment>();

let destroy = logger({
  'GeneralTypeAndUseCase': typeAndUseMap,
  'PrimaryGeneralInvestment': primaryInvestmentMap,
  'SecondaryGeneralInvestment': secondaryInvestmentMap,
})