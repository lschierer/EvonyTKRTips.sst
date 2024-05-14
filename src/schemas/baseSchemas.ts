import {z} from 'astro:content';

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

export const AscendingLevels = levels.refine((l) => {
  switch (l) {
    case '0':
    case '6':
    case '7':
    case '8':
    case '9':
    case '10':
      return true;
    default:
      return false;
    }
});
export type AscendingLevels = z.infer<typeof AscendingLevels>;

export const Condition = z.enum([
  'When_Not_Mine',
  'Attacking',
  'Marching',
  'When_Rallying',
  'leading_the_army_to_attack',
  "When_Defending_Outside_The_Main_City",
  'brings_a_dragon',
  'dragon_to_the_attack',
  'brings_dragon_or_beast_to_attack',
  'Reinforcing',
  'In_City',
  'Defending',
  'When_The_Main_Defense_General',
  'During_SvS',
  'When_an_officer',
  'Against Monsters',
  'When_City_Mayor',
  'When_City_Mayor_for_this_SubCity',
  'Reduces_Enemy',
  'Reduces_Enemy_in_Attack',
  'Reduces_Enemy_with_a_Dragon',
  'Enemy',
  'Enemy_In_City',
  'Reduces_Monster',
  'In_Main_City',
]);
export type ConditionType = z.infer<typeof Condition>;

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

export const Attribute = z.enum([
 'Attack',
 'Defense',
 'HP',
 'Leadership',
 'Politics',
 'Range',
 'Training_Speed',
 'Marching_Speed',
 'Marching_Speed_to_Monsters',
 'March_Size_Capacity',
 'March_Time',
 'Rally_Capacity',
 'Attack_Speed',
 'Wounded_to_Death',
 'Death_to_Wounded',
 'Death_to_Soul',
 'Load',
 'Double_Items_Drop_Rate',
 'Healing_Speed',
 'Stamina_cost',
 'SubCity_Training_Speed',
 'SubCity_Troop_Capacity',
 'Monster_Attack',
 'Double Items Drop Rate',
]);
export type AttributeType = z.infer<typeof Attribute>;


export const qualityColor = z.enum([
'Disabled',
'Green',
'Blue',
'Purple',
'Orange',
'Gold',
]);

export type qualityColorType = z.infer<typeof qualityColor>;

export const UnitSchema = z.enum([
  'percentage',
  'flat',
]);
export type Unit = z.infer<typeof UnitSchema>;

export const ClassEnum = z.enum([
  'Archers',
  'Ground',
  'Mounted',
  'Siege',
  'all',
]);
export type ClassEnumType = z.infer<typeof ClassEnum>;

export const ValueSchema = z.object({
  'number': z.number(),
  'unit': UnitSchema,
});
export type Value = z.infer<typeof ValueSchema>;

export const BuffAdverbArray = z.array(Condition);
export type BuffAdverbArrayType = z.infer<typeof BuffAdverbArray>;

export const Buff = z.object({
  'attribute': Attribute.optional(),
  'condition': z.union([Condition,BuffAdverbArray]).optional(),
  'class': ClassEnum.nullish(),
  'value': ValueSchema.nullish(),
});
export type BuffType = z.infer<typeof Buff>;

export const buffUnion = z.array(Buff);


