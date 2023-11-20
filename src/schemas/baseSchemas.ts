import * as z from "zod";

export const levels = z.enum([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
]);

export type levelsType = z.infer<typeof levels>;

export const syslogSeverity = z.enum([
  'emerg',
  'alert',
  'crit',
  'err',
  'warning',
  'notice',
  'info',
  'debug',
])

export type syslogSeverityType = z.infer<typeof syslogSeverity>;

export const Condition = z.enum([
  'When_Not_Mine',
  'Attacking',
  'Marching',
  'When_Rallying',
  'leading_the_army_to_attack',
  'brings_a_dragon',
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
  'Reduces_Enemy_in_Attack',
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
 'Death_to_Soul',
 'Load',
 'Double_Items_Drop_Rate',
 'Healing_Speed',
]);
export type Attribute = z.infer<typeof AttributeSchema>;


export const qualityColor = z.enum([
"Disabled",
"Green",
"Blue",
"Purple",
"Orange",
"Gold",
]);

export type qualityColorType = z.infer<typeof qualityColor>;

export const UnitSchema = z.enum([
  "percentage",
  "flat",
]);
export type Unit = z.infer<typeof UnitSchema>;

export const ClassEnum = z.enum([
  "Archers",
  "Ground",
  "Mounted",
  "Siege",
  "all",
]);
export type ClassEnumType = z.infer<typeof ClassEnum>;

export const ValueSchema = z.object({
  "number": z.number(),
  "unit": UnitSchema,
});
export type Value = z.infer<typeof ValueSchema>;

export const BuffAdverbArray = z.array(Condition);
export type BuffAdverbArrayType = z.infer<typeof BuffAdverbArray>;

export const BuffSchema = z.object({
  "attribute": AttributeSchema,
  "class": ClassEnum.nullish(),
  "value": ValueSchema.nullish(),
  "condition": Condition.nullish(),
});
export type Buff = z.infer<typeof BuffSchema>;



