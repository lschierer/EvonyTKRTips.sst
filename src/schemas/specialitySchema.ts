import {z as zod} from 'zod';

import * as b from './baseSchemas';


export const SpecialityLevel = zod.object({
  "level": b.qualityColor,
  "buff": zod.array(b.Buff).nonempty(),
});
export type SpecialityLevelType = zod.infer<typeof SpecialityLevel>;

export const Speciality = zod.object({
  "name": zod.string(),
  "attribute": zod.array(SpecialityLevel).nonempty(),
});
export type SpecialityType = zod.infer<typeof Speciality>;

