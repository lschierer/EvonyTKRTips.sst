import { z, reference, defineCollection } from 'astro:content';
import {union} from "zod";

const levelSchema = z.enum([
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

const qualitySchema = z.enum([
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

const RefineAdverbs =z.enum([
  'Marching',
  'Defending',
  'Reinforcing',
  'When The Main Defense General',
  'When the City Mayor',
  'In City',
  'When Rallying',
  'During SvS',
  'When an officer',
  'Against Monsters',
  'Reduces Enemy',
  'Reduces Monster',
])

const RefineAttributes = z.enum([
 'Attack',
 'Defense',
 'HP',
 'Leadership',
 'Politics',
 'Range',
 'Training Speed',
 'Marching Speed',
 'Attack Speed',
 'Wounded to Death',
 'Death to Wounded',
 'Load',
])

export const buffSchema = z.object({
  condition: z.union([RefineAdverbs, z.array(RefineAdverbs)]).optional(),
  attribute: z.union([RefineAttributes, z.array(RefineAttributes)]).optional(),
  class: z.enum(['Mounted', 'Ground','Archers','Siege','all']).optional(),
  value: z.union([
    z.number(),
    z.tuple([
      z.number(),
      z.enum(['percentage','flat']),
    ]),
  ]),
});

const buffUnion = z.union([buffSchema,z.array(buffSchema)]);

const specialtyIncrement = z.object({
    level: qualitySchema,
    buff: buffUnion
});

const specialty = z.object({
    name: z.string(),
    attribute: z.union([specialtyIncrement,z.array(specialtyIncrement)]),
})

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

const ascendingAttribute = z.object({

})

export const specialSkillBook = z.object({
    name: z.string(),
    buff: buffUnion,
})

export const standardSkillBook = z.object({
  attribute: buffUnion,
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
})

const skillBook = z.union([specialSkillBook,standardSkillBook])

const beast = z.object({
  name: z.string(),
  quality: z.enum([
    "Green",
    "Blue",
    "Purple",
    "Orange",
    "Gold",
  ]),
  level: z.number().refine((n) => (n > 0 && n <= 20))
})

const dragon = z.object({
  name: z.string(),
  level: levelSchema,
  refines: z.array(buffUnion).optional(),
  talents: z.array(z.object({
    name: z.string(),
    level: z.number(),
    grants: z.union([buffUnion, z.array(buffUnion)])
  })).optional()
})
export const monsterSchema = z.object({
  name: z.string(),
  level: levelSchema.optional(),
  caveats: z.array(z.object({
    class: z.enum(['mounted', 'ground','archers','siege']),
    attribute: z.enum(['attack','defense','hp']),
    type: z.enum(['flat', 'percentage']),
    value: z.union([z.string(),z.number()])
  })).optional(),
});

export const artTreasure = z.object({
  art: z.object({
    name: z.string(),
    level: levelSchema,
    buff: z.union([buffSchema, z.array(buffSchema)])
  })
})
export const Blazon = z.object({
  blazon: z.object({
    type: blazonTypes,
    set: blazonSet,
    level: levelSchema,
    buff: z.union([buffSchema, z.array(buffSchema)])
  })
})

export const BlazonSet = z.object({
  set: z.object({
    earth: Blazon.refine((b: z.infer<typeof Blazon>) => b.blazon.type === 'Earth').nullable(),
    wind: Blazon.refine((b: z.infer<typeof Blazon>) => b.blazon.type === 'Wind').nullable(),
    fire: Blazon.refine((b: z.infer<typeof Blazon>) => b.blazon.type === 'Fire').nullable(),
    ocean: Blazon.refine((b: z.infer<typeof Blazon>) => b.blazon.type === 'Ocean').nullable(),
    light: Blazon.refine((b: z.infer<typeof Blazon>) => b.blazon.type === 'Light').nullable(),
    shadow: Blazon.refine((b: z.infer<typeof Blazon>) => b.blazon.type === 'Shadow').nullable()
  })
})

export const generalSchema = z.object({
    general: z.object({
        name: z.string(),
        level: levelSchema.default('1'),
        specialities: z.array(specialty).nullable(),
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
        equipped: z.union([reference('beast'), reference('dragon')]).optional(),
    })

});
