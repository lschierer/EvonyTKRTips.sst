import {z as zod} from 'zod';

import * as b from './baseSchemas';

export const blazonTypes = zod.enum([
  'Earth',
  'Wind',
  'Fire',
  'Ocean',
  'Light',
  'Shadow',
]);

export const blazonSet =zod.enum([
  'Justice',
  'Valor',
  'Honor',
  'Honesty',
  'Sacrifice',
  'Compassion',
  'Soul',
  'Humility',
]);

export const BlazonSchema = zod.object({
  blazon: zod.object({
  type: blazonTypes,
  set: blazonSet,
  level: b.levels,
  buff: zod.array(b.Buff)
  })
})

export type Blazon = zod.infer<typeof BlazonSchema>;

export const BlazonSetSchema = zod.object({
  set: zod.object({
  earth: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Earth').nullish(),
  wind: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Wind').nullish(),
  fire: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Fire').nullish(),
  ocean: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Ocean').nullish(),
  light: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Light').nullish(),
  shadow: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Shadow').nullish()
  })
})
export type BlazonSet = zod.infer<typeof BlazonSetSchema>;
