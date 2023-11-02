import * as z from "zod";

import * as b from './baseSchemas';


export const SpecialityLevelSchema = z.object({
  "level": z.string(),
  "buff": z.array(b.BuffSchema),
});
export type SpecialityLevel = z.infer<typeof SpecialityLevelSchema>;

export const SpecialitySchema = z.object({
  "name": z.string(),
  "attribute": z.array(SpecialityLevelSchema),
});
export type Speciality = z.infer<typeof SpecialitySchema>;

