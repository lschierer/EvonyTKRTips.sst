import {z} from "astro:content";

import * as b from './baseSchemas';


export const SpecialityLevel = z.object({
  "level": b.qualityColor,
  "buff": z.array(b.Buff),
});
export type SpecialityLevelType = z.infer<typeof SpecialityLevel>;

export const Speciality = z.object({
  "name": z.string(),
  "attribute": z.array(SpecialityLevel),
});
export type SpecialityType = z.infer<typeof Speciality>;

