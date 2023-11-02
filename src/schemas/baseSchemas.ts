import * as z from "zod";

export const ConditionSchema = z.enum([
  "Against_Monsters",
  "Attacking",
  "brings_dragon_or_beast_to_attack",
  "dragon_to_the_attack",
  "Enemy_In_City",
  "leading_the_army_to_attack",
  "Marching",
  "Reduces_Enemy",
  "Reduces_Monster",
  "When_Rallying",
]);
export type Condition = z.infer<typeof ConditionSchema>;

export const AttributeSchema = z.enum([
  "Attack",
  "Death_to_Wounded",
  "Defense",
  "Double_Items_Drop_Rate",
  "HP",
  "March_Size_Capacity",
  "Marching_Speed",
  "Rally_Capacity",
  "Wounded_to_Death",
]);
export type Attribute = z.infer<typeof AttributeSchema>;

export const UnitSchema = z.enum([
  "percentage",
]);
export type Unit = z.infer<typeof UnitSchema>;

export const ClassEnumSchema = z.enum([
  "Archers",
  "Ground",
  "Mounted",
  "Siege",
]);
export type ClassEnum = z.infer<typeof ClassEnumSchema>;

export const ValueSchema = z.object({
  "number": z.number(),
  "unit": UnitSchema,
});
export type Value = z.infer<typeof ValueSchema>;

export const BuffSchema = z.object({
  "attribute": AttributeSchema,
  "class": z.union([ClassEnumSchema, z.null()]).optional(),
  "value": ValueSchema,
  "condition": z.union([z.null(), z.string()]).optional(),
});
export type Buff = z.infer<typeof BuffSchema>;



