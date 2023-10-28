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
import {boolean} from "zod";

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
