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

export const troopClass = z.enum([
    'Mounted',
    'Ground',
    'Archers',
    'Siege',
    'all'
]);

export const qualitySchema = z.enum([
  "Green",
  "Blue",
  "Purple",
  "Orange",
  "Gold",
]);

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

export const BuffAdverbs =z.enum([
  'Attacking',
  'Marching',
  'When Rallying',
  'leading the army to attack',
  'Reinforcing',
  'In City',
  'Defending',
  'When The Main Defense General',
  'When the City Mayor',
  'During SvS',
  'When an officer',
  'Against Monsters',
  'Reduces Enemy',
  'Enemy',
  'Enemy In City',
  'Reduces Monster',
])

export const BuffAttributes = z.enum([
 'Attack',
 'Defense',
 'HP',
 'Leadership',
 'Politics',
 'Range',
 'Training Speed',
 'Marching Speed',
 'March Size Capacity',
 'Rally Capacity',
 'Attack Speed',
 'Wounded to Death',
 'Death to Wounded',
 'Load',
])

export type BuffAttributesType = z.infer<typeof BuffAttributes>;

export const buffTypeEnum = z.enum(['percentage','flat']);

export type buffType = z.infer<typeof buffTypeEnum>;

export const buffValueSchema = z.object({
    number: z.number(),
    unit: buffTypeEnum,
})

export const buffSchema = z.object({
  condition: z.union([BuffAdverbs, z.array(BuffAdverbs)]).optional(),
  attribute: z.union([BuffAttributes, z.array(BuffAttributes)]).optional(),
  class: troopClass.optional(),
  value: buffValueSchema,
});

export type buff = z.infer<typeof buffSchema>;
export const buffUnion = z.union([buffSchema,z.array(buffSchema)]);

export const specialtyIncrement = z.object({
    level: qualitySchema,
    buff: buffUnion
});

export type specialtyIncrementType = z.infer<typeof specialtyIncrement>;

export const specialty = z.object({
    name: z.string(),
    attribute: z.array(specialtyIncrement),
})

export type specialtyType = z.infer<typeof specialty>;

export const ascendingIncrement = z.object({
    level: levelSchema.refine((l) => {
        switch (l) {
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



export const generalSchema = z.object({
  name: z.string(),
  leadership: z.number(),
  leadership_increment: z.number(),
  attack: z.number(),
  attack_increment: z.number(),
  defense: z.number(),
  defense_increment: z.number(),
  politics: z.number(),
  politics_increment: z.number(),
  level: levelSchema.default('1'),
  specialities: z.array(specialty).nullable(),
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
  role: z.enum(['primary', 'assistant']).optional(),
  score_as: troopClass.optional(),
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
