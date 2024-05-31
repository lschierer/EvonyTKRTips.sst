import {z as zod} from 'zod';

import { standardSkillBook } from "./bookSchemas";

export const bookConflicts = zod.object({
    books: zod.array(standardSkillBook)
})
export type bookConflictsType = zod.infer<typeof bookConflicts>;

export const nameConflictUlid = zod.string().ulid();
type nameConflictUlidType = zod.infer<typeof nameConflictUlid>;

const nameConflicts = zod.object({
    nameConflictUlidType:  zod.array(zod.string())
});
export type nameConflictsTypes = zod.infer<typeof nameConflicts>;

const otherConflicts = zod.record(zod.literal('other'), zod.array(zod.string()));
export type otherConflictType = zod.infer<typeof otherConflicts>;

export const ConflictDatum = zod.object({
    name: nameConflictUlid,
    members: zod.array(zod.string()),
    others: zod.array(zod.string()).optional(),
    books: zod.array(standardSkillBook).optional()
});
export type ConflictDatumType = zod.infer<typeof ConflictDatum>;

export const ConflictArray = zod.array(ConflictDatum);

export type ConflictArrayType = zod.infer<typeof ConflictArray>;
