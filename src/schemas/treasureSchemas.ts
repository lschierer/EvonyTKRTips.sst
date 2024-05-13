import {z} from "astro:content";

import * as b from './baseSchemas';

export const artTreasureSchema = z.object({
    art: z.object({
        name: z.string(),
        level: b.levels,
        buff: z.union([b.Buff, z.array(b.Buff)])
    })
})

export type artTreasure = z.infer<typeof artTreasureSchema>;

