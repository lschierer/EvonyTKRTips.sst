import {z} from 'zod';
import type { BuffType, BuffParamsType } from '@schemas/baseSchemas';
import type {AttributeMultipliersType} from '@schemas/EvAns.zod';

export interface BuffFunctionInterface {
  Attack: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  DeAttack: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  DeDefense: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  DeHP: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  Debilitation: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  Defense: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  HP: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  MarchSize: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  Preservation: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  Range: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
}
