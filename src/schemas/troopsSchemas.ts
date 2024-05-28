import {z as zod} from 'zod';

export const Tier = zod.enum([
  't1',
  't2',
  't3',
  't4',
  't5',
  't6',
  't7',
  't8',
  't9',
  't10',
  't11',
  't12',
  't13',
  't14',
  't15',
  't16',
]);
export type TierType = zod.infer<typeof Tier>;