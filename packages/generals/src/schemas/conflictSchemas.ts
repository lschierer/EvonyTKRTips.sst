import { z as zod } from 'zod';

import { standardSkillBook } from './bookSchemas';

export const bookCondition = zod.enum(['when not mine', 'all the time']);
export type bookCondition = zod.infer<typeof bookCondition>;

export const bookConflict = zod.object({
  book: standardSkillBook,
  condition: bookCondition,
});
export type bookConflict = zod.infer<typeof bookConflict>;

export const nameConflictUlid = zod.string().ulid();
export type nameConflictUlid = zod.infer<typeof nameConflictUlid>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nameConflicts = zod.object({
  nameConflictUlidType: zod.array(zod.string()),
});
export type nameConflictsTypes = zod.infer<typeof nameConflicts>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const otherConflicts = zod.record(
  zod.literal('other'),
  zod.array(zod.string()),
);
export type otherConflictType = zod.infer<typeof otherConflicts>;

export const ConflictDatum = zod.object({
  name: nameConflictUlid,
  members: zod.array(zod.string()),
  others: zod.array(zod.string()).optional(),
  books: zod.array(bookConflict).optional(),
});
export type ConflictDatum = zod.infer<typeof ConflictDatum>;
