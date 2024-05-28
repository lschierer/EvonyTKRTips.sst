import {z as zod} from 'zod';

import * as b from './baseSchemas';

export const artTreasureSchema = zod.object({
    art: zod.object({
        name: zod.string(),
        level: b.levels,
        buff: zod.union([b.Buff, zod.array(b.Buff)])
    })
})

export type artTreasure = zod.infer<typeof artTreasureSchema>;

