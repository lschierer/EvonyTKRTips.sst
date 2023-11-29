import * as z from "zod";

import * as b from './baseSchemas';

export const blazonTypes = z.enum([
    'Earth',
    'Wind',
    'Fire',
    'Ocean',
    'Light',
    'Shadow',
]);

export const blazonSet =z.enum([
    'Justice',
    'Valor',
    'Honor',
    'Honesty',
    'Sacrifice',
    'Compassion',
    'Soul',
    'Humility',
]);

export const BlazonSchema = z.object({
    blazon: z.object({
        type: blazonTypes,
        set: blazonSet,
        level: b.levels,
        buff: z.union([b.Buff, z.array(b.Buff)])
    })
})

export type Blazon = z.infer<typeof BlazonSchema>;

export const BlazonSetSechma = z.object({
    set: z.object({
        earth: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Earth').nullish(),
        wind: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Wind').nullish(),
        fire: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Fire').nullish(),
        ocean: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Ocean').nullish(),
        light: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Light').nullish(),
        shadow: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Shadow').nullish()
    })
})
export type BlazonSet = z.infer<typeof BlazonSetSechma>;
