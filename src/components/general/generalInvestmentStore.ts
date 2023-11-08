import {z} from "zod";

import {
  generalUseCase,
  type generalUseCaseType,
  type levelSchemaType,
  type qualitySchemaType,
  type standardSkillBookType,
  troopClass,
  type troopClassType
} from "@schemas/evonySchemas.ts";
import {map} from "nanostores";
import { logger } from '@nanostores/logger'

import {boolean} from "zod";

export const BoS = z.enum(['none', 'dragon', 'beast']);
export type BoSType = z.infer<typeof BoS>;

export interface generalInvestment {
  dragon: boolean,
  beast: boolean,
  ascending: levelSchemaType,
  speciality1: qualitySchemaType,
  speciality2: qualitySchemaType,
  speciality3: qualitySchemaType,
  speciality4: qualitySchemaType,
  extraBooks: standardSkillBookType[],
}

export interface generalTypeAndUse {
  type: troopClassType,
  use: generalUseCaseType,
}

export const typeAndUseMap = map<generalTypeAndUse>({
  type: troopClass.enum.all,
  use: generalUseCase.enum.all,
})

export const primaryInvestmentMap = map<generalInvestment>();

export const secondaryInvestmentMap = map<generalInvestment>();

let destroy = logger({
  'GeneralTypeAndUseCase': typeAndUseMap,
  'PrimaryGeneralInvestment': primaryInvestmentMap,
  'SecondaryGeneralInvestment': secondaryInvestmentMap,
})