import {z} from 'zod';

export const levelSchema = z.enum([
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

export type levelSchemaType = z.infer<typeof levelSchema>;

export const BuffAdverbs =z.enum([
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
  export type BuffAdverbsType = z.infer<typeof BuffAdverbs>;
  
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

  export const BuffAttributes = z.enum([
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
   ])
   export type BuffAttributesType = z.infer<typeof BuffAttributes>;

export const generalUseCase = z.enum([
  "all",
  "Monsters",
  "Attack",
  "Defense",
  "Overall",
  "Wall",
  "Mayors"
]);
export type generalUseCaseType = z.infer<typeof generalUseCase>;

export const troopClass = z.enum([
    'Archers',
    'Ground',
    'Mounted',
    'Siege',
    'all'
]);

export type troopClassType = z.infer<typeof troopClass>;

export const qualitySchema = z.enum([
    "Disabled",
  "Green",
  "Blue",
  "Purple",
  "Orange",
  "Gold",
]);

export type qualitySchemaType = z.infer<typeof qualitySchema>;
export const blazonTypes = z.enum([
    'Earth',
    'Wind',
    'Fire',
    'Ocean',
    'Light',
    'Shadow',
]);

export const blazonSet =z.enum([
    'Justice',
    'Valor',
    'Honor',
    'Honesty',
    'Sacrifice',
    'Compassion',
    'Soul',
    'Humility',
]);


export const BuffAdverbArray = z.array(BuffAdverbs);
export type BuffAdverbArrayType = z.infer<typeof BuffAdverbArray>;



export const buffTypeEnum = z.enum(['percentage','flat']);

export type buffType = z.infer<typeof buffTypeEnum>;

export const buffValueSchema = z.object({
    number: z.number(),
    unit: buffTypeEnum,
})

export const buffSchema = z.object({
  attribute: BuffAttributes.optional(),
  condition: z.union([BuffAdverbs, z.array(BuffAdverbs)]).optional(),
  class: troopClass.optional(),
  value: buffValueSchema,
});

export type buff = z.infer<typeof buffSchema>;
export const buffUnion = z.array(buffSchema);

export const specialtyAttribute = z.object({
    level: qualitySchema,
    buff: buffUnion
});

export type specialtyAttributeType = z.infer<typeof specialtyAttribute>;

export const specialty = z.object({
    name: z.string(),
    attribute: z.array(specialtyAttribute),
})

export type specialtyType = z.infer<typeof specialty>;

export const ascendingIncrement = z.object({
    level: levelSchema.refine((l) => {
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
    }),
    buff: buffUnion
});

export type ascendingIncrementType = z.infer<typeof ascendingIncrement>;

export const ascendingAttributes = z.array(ascendingIncrement).max(5);

export type ascendingAttributesType = z.infer<typeof ascendingAttributes>;

const redStar = z.object({
    level: levelSchema,
    bars: levelSchema.refine((l) => {
        if(l !== null && l !== undefined ) {
            switch (l) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    return true;
                default:
                    return false;
            }
        }
        return false;
    }),
    buff: buffUnion.nullable(),
})

export const specialSkillBook = z.object({
    name: z.string(),
    buff: buffUnion,
})

export const standardSkillBook = specialSkillBook.extend({
    level: levelSchema.refine((l) => {
        if(l !== null && l !== undefined ) {
            switch (l) {
                case '1':
                case '2':
                case '3':
                case '4':
                    return true;
                default:
                    return false;
            }
        }
        return false;
    }),
});

export const skillBook = z.union([specialSkillBook,standardSkillBook])
export type skillBookType = z.infer<typeof skillBook>;

export type standardSkillBookType = z.infer<typeof standardSkillBook>;
export type specialSkillBookType = z.infer<typeof specialSkillBook>;

export const generalNote = z.object({
  text: z.string(),
  severity: syslogSeverity,
});

export type generalNoteType = z.infer<typeof generalNote>;

export const totalBuffs = z.object({
    attack: z.number(),
    defense: z.number(),
    hp: z.number(),
    march: z.number(),
});
export type totalBuffsType = z.infer<typeof totalBuffs>;

export const generalSchema = z.object({
  name: z.string(),
  display: z.enum(['primary', 'assistant', 'summary']).optional(),
  note: z.array(generalNote).nullish(),
  leadership: z.number(),
  leadership_increment: z.number(),
  attack: z.number(),
  attack_increment: z.number(),
  defense: z.number(),
  defense_increment: z.number(),
  politics: z.number(),
  politics_increment: z.number(),
  level: levelSchema.default('1'),
  specialities: z.array(specialty).nullish(),
  ascending: ascendingAttributes.nullish(),
  stars: levelSchema.refine((l) => {
    if(l !== null && l !== undefined ) {
      switch (l) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
          return true;
        default:
          return false;
      }
    }
    return false;
  }).nullable(),
  books: z.array(skillBook).nullish(),
  score_as: troopClass.optional(),
  "totalBuffs": totalBuffs.nullish(),
});

export type General = z.infer<typeof generalSchema>;

export const generalObjectSchema = z.object({
    general: generalSchema,

});

export type generalObject = z.infer<typeof generalObjectSchema>;

export const beast = z.object({
    name: z.string(),
    quality: qualitySchema,
    level: z.number().refine((n) => (n > 0 && n <= 20))
})

export const dragon = z.object({
    name: z.string(),
    level: levelSchema,
    refines: z.array(buffUnion).optional(),
    talents: z.array(z.object({
        name: z.string(),
        level: z.number(),
        grants: z.union([buffUnion, z.array(buffUnion)])
    })).optional()
})

export const artTreasureSchema = z.object({
    art: z.object({
        name: z.string(),
        level: levelSchema,
        buff: z.union([buffSchema, z.array(buffSchema)])
    })
})

export type artTreasure = z.infer<typeof artTreasureSchema>;

export const BlazonSchema = z.object({
    blazon: z.object({
        type: blazonTypes,
        set: blazonSet,
        level: levelSchema,
        buff: z.union([buffSchema, z.array(buffSchema)])
    })
})

export type Blazon = z.infer<typeof BlazonSchema>;

export const BlazonSetSechma = z.object({
    set: z.object({
        earth: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Earth').nullish(),
        wind: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Wind').nullish(),
        fire: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Fire').nullish(),
        ocean: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Ocean').nullish(),
        light: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Light').nullish(),
        shadow: BlazonSchema.refine((b: Blazon) => b.blazon.type === 'Shadow').nullish()
    })
})

export type BlazonSet = z.infer<typeof BlazonSetSechma>;

const nameConflicts = z.record(z.string(), z.array(z.string()));
const otherConflicts = z.object({other: z.array(z.string())});
export const bookConflicts = z.object({books: z.array(standardSkillBook)})
export const generalConflicts = z.object({"conflicts":
    z.union([
        nameConflicts,
            otherConflicts,
        ]),
    books: z.array(standardSkillBook).nullish(),
});

export type nameConflictsTypes = z.infer<typeof nameConflicts>;
export type otherConflictType = z.infer<typeof otherConflicts>;
export type bookConflictsType = z.infer<typeof bookConflicts>;
export type generalConflictsType = z.infer<typeof generalConflicts>;

export const generalConflictCollection = z.array(generalConflicts);
