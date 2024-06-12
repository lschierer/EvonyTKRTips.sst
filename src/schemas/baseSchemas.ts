import { z as zod } from 'zod';

export const levels = zod.enum([
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
export type levelsType = zod.infer<typeof levels>;

export const AscendingLevels = zod.enum([
  '0stars',
  '1purple',
  '2purple',
  '3purple',
  '4purple',
  '5purple',
  '1red',
  '2red',
  '3red',
  '4red',
  '5red',
]);
export type AscendingLevelsType = zod.infer<typeof AscendingLevels>;

export const ActivationSituations = zod.enum([
  'Solo PvP',
  'Rally Owner PvP',
  'Rally Participant PvP',
  'Defense of Camp',
  'Defense of Self',
  'Defense of Buildings',
  'Reinforcement of Buildings',
  'Reinforcement of Others',
  'Solo Monster',
  'Rally Owner Monster',
  'Rally Participant Monster',
]);
export type ActivationSituationsType = zod.infer<typeof ActivationSituations>;

export const Condition = zod.enum([
  'Against Monsters',
  'Attacking',
  'Defending',
  'During_SvS',
  'Enemy',
  'Enemy_In_City',
  'In_City',
  'In_Main_City',
  'Marching',
  'Reduces_Enemy',
  'Reduces_Enemy_in_Attack',
  'Reduces_Enemy_with_a_Dragon',
  'Reduces Monster',
  'Reinforcing',
  'When not mine',
  'When_City_Mayor',
  'When_City_Mayor_for_this_SubCity',
  'When_Defending_Outside_The_Main_City',
  'When_Rallying',
  'When_The_Main_Defense_General',
  'When_an_officer',
  'brings_a_dragon',
  'brings_dragon_or_beast_to_attack',
  'dragon_to_the_attack',
  'leading_the_army_to_attack',
]);
export type ConditionType = zod.infer<typeof Condition>;

export const syslogSeverity = zod.enum([
  'emerg',
  'alert',
  'crit',
  'err',
  'warning',
  'notice',
  'info',
  'debug',
]);

export type syslogSeverityType = zod.infer<typeof syslogSeverity>;

export const Attribute = zod.enum([
  'Attack',
  'Attack_Speed',
  'Death to Survival',
  'Death_to_Soul',
  'Death_to_Wounded',
  'Defense',
  'Deserter Capacity',
  'Double Items Drop Rate',
  'HP',
  'Healing_Speed',
  'Hospital Capacity',
  'Leadership',
  'Load',
  'March_Size_Capacity',
  'March_Time',
  'Marching_Speed',
  'Marching_Speed_to_Monsters',
  'Monster_Attack',
  'Politics',
  'Rally_Capacity',
  'Range',
  'Resources Production',
  'Stamina_cost',
  'SubCity Construction Speed',
  'SubCity Gold Production',
  'SubCity_Training_Speed',
  'SubCity_Troop_Capacity',
  'Training Capacity',
  'Training_Speed',
  'Wounded_to_Death',
]);
export type AttributeType = zod.infer<typeof Attribute>;

export const qualityColor = zod.enum([
  'Disabled',
  'Green',
  'Blue',
  'Purple',
  'Orange',
  'Gold',
]);

export type qualityColorType = zod.infer<typeof qualityColor>;

export const UnitSchema = zod.enum(['percentage', 'flat']);
export type Unit = zod.infer<typeof UnitSchema>;

export const ClassEnum = zod.enum([
  'Archers',
  'Ground',
  'Mounted',
  'Siege',
  'all',
]);
export type ClassEnumType = zod.infer<typeof ClassEnum>;

export const CovenantAttributeCategory = zod.enum([
  'Disabled',
  'War Covenant',
  'Cooperation Covenant',
  'Peace Covenant',
  'Faith Covenant',
  'Honor Covenant',
  'Civilization Covenant',
]);

export type CovenantAttributeCategoryType = zod.infer<
  typeof CovenantAttributeCategory
>;

export const ValueSchema = zod.object({
  number: zod.number(),
  unit: UnitSchema,
});
export type Value = zod.infer<typeof ValueSchema>;

export const Buff = zod.object({
  attribute: Attribute.optional(),
  condition: zod.array(Condition).optional(),
  class: ClassEnum.nullish(),
  value: ValueSchema.nullish(),
});
export type BuffType = zod.infer<typeof Buff>;

export const buffUnion = zod.array(Buff);

export const BuffParams = zod.object({
  special1: qualityColor.default(qualityColor.enum.Disabled), //0
  special2: qualityColor.default(qualityColor.enum.Disabled), //1
  special3: qualityColor.default(qualityColor.enum.Disabled), //2
  special4: qualityColor.default(qualityColor.enum.Disabled), //3
  special5: qualityColor.default(qualityColor.enum.Disabled), //4
  stars: AscendingLevels.default(AscendingLevels.enum['0stars']), //5
  covenants: CovenantAttributeCategory.default(CovenantAttributeCategory.enum.Disabled),
  dragon: zod.boolean().default(false), //6
  beast: zod.boolean().default(false), //7
});
export type BuffParamsType = zod.infer<typeof BuffParams>;

