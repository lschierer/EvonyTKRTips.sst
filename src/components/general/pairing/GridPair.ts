//do NOT import this from anywhere except DisplayGrid. Use the function in the class to generate one.
import { z } from 'zod';
import { PvPBuffDetails } from '@components/general/buffComputers/TKRTipsRanking/PvPDetail.ts';
import { ExtendedGeneral } from '@schemas/ExtendedGeneral.ts';

export const GridData = z.object({
  id: z.string().ulid(),
  Primary: z.object({
    Name: z.string(),
    Conflicts: z.number(),
    PvPBuffDetails,
    Original: ExtendedGeneral,
  }),
  Secondary: z.object({
    Name: z.string(),
    Conflicts: z.number(),
    PvPBuffDetails,
    Original: ExtendedGeneral,
  }),
})
export type GridData = z.infer<typeof GridData>;

