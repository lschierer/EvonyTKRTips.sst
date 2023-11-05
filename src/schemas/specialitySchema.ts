import * as z from "zod";

import * as b from './baseSchemas';


export const SpecialityLevel = z.object({
  "level": z.string(),
  "buff": z.array(b.BuffSchema),
});
export type SpecialityLevelType = z.infer<typeof SpecialityLevel>;

export const Speciality = z.object({
  "name": z.string(),
  "attribute": z.array(SpecialityLevel),
});
export type SpecialityType = z.infer<typeof Speciality>;

