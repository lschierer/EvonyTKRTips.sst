import {z} from 'zod';
import type { BuffType, BuffParamsType } from '@schemas/baseSchemas';
import type {AttributeMultipliersType} from '@schemas/EvAns.zod';

export interface BuffFunctionInterface {
  Attack: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType, am: AttributeMultipliersType) => number,
  DeAttack: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
  DeDefense: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
  DeHP: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
  Debilitation: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
  Defense: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
  HP: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
  MarchSize: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
  Preservation: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
  Range: (name: string, buffName: string, actualBuff: BuffType, desired: BuffParamsType) => number,
}
