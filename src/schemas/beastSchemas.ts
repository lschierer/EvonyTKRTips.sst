import {z} from 'zod';

import * as b from './baseSchemas';

export const beast = z.object({
    name: z.string(),
    quality: b.qualityColor,
    level: z.number().refine((n) => (n > 0 && n <= 20))
})
export const dragon = z.object({
    name: z.string(),
    level: b.levels,
    refines: z.array(b.buffUnion).optional(),
    talents: z.array(z.object({
        name: z.string(),
        level: z.number(),
        grants: z.union([b.buffUnion, z.array(b.buffUnion)])
    })).optional()
})

