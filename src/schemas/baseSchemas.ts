import * as z from "zod";

export const Condition = z.enum([
  'When_Not_Mine',
  'Attacking',
  'Marching',
  'When_Rallying',
  'leading_the_army_to_attack',
  'dragon_to_the_attack',
  'brings_dragon_or_beast_to_attack',
  'Reinforcing',
  'In_City',
  'Defending',
  'When_The_Main_Defense_General',
  'When_the_City_Mayor',
  'During_SvS',
  'When_an_officer',
  'Against_Monsters',
  'Reduces_Enemy',
  'Enemy',
  'Enemy_In_City',
  'Reduces_Monster',
]);
export type ConditionType = z.infer<typeof Condition>;

export const AttributeSchema = z.enum([
 'Attack',
 'Defense',
 'HP',
 'Leadership',
 'Politics',
 'Range',
 'Training_Speed',
 'Marching_Speed',
 'March_Size_Capacity',
 'Rally_Capacity',
 'Attack_Speed',
 'Wounded_to_Death',
 'Death_to_Wounded',
 'Load',
 'Double_Items_Drop_Rate',
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
  "all",
]);
export type ClassEnum = z.infer<typeof ClassEnumSchema>;

export const ValueSchema = z.object({
  "number": z.number(),
  "unit": UnitSchema,
});
export type Value = z.infer<typeof ValueSchema>;

export const BuffSchema = z.object({
  "attribute": AttributeSchema,
  "class": ClassEnumSchema.nullish(),
  "value": ValueSchema.nullish(),
  "condition": Condition.nullish(),
});
export type Buff = z.infer<typeof BuffSchema>;



