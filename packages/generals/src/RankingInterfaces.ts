import type { BuffType, BuffParamsType } from '@schemas/baseSchemas';
import type { AttributeMultipliersType } from '@schemas/EvAns.zod';
import type { generalUseCaseType } from '@schemas/generalsSchema';

export type BuffFunction = (
  name: string,
  buffName: string,
  actualBuff: BuffType,
  desired: BuffParamsType,
  useCase: generalUseCaseType,
  am: AttributeMultipliersType,
) => number;

export interface BuffFunctionInterface {
  Attack: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  DeAttack: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  DeDefense: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  DeHP: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  Debilitation: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  Defense: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  HP: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  MarchSize: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  Preservation: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
  Range: (
    name: string,
    buffName: string,
    actualBuff: BuffType,
    desired: BuffParamsType,
    useCase: generalUseCaseType,
    am: AttributeMultipliersType,
  ) => number;
}
