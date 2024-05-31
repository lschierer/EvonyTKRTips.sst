import { z as zod } from 'zod';

import * as b from './baseSchemas';

export const beast = zod.object({
  name: zod.string(),
  quality: b.qualityColor,
  level: zod.number().refine((n) => n > 0 && n <= 20),
});
export const dragon = zod.object({
  name: zod.string(),
  level: b.levels,
  refines: zod.array(b.buffUnion).optional(),
  talents: zod
    .array(
      zod.object({
        name: zod.string(),
        level: zod.number(),
        grants: zod.union([b.buffUnion, zod.array(b.buffUnion)]),
      })
    )
    .optional(),
});
