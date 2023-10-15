import { z, reference, defineCollection } from 'astro:content';
import {union} from "zod";

const levelSchema = z.enum([
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
  '15'
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
  class: z.enum(['mounted', 'ground','archers','siege']).optional(),
  value: z.union([
    z.number(),
    z.tuple([
      z.number(),
      z.enum(['percentage','flat']),
    ]),
  ]),
});

const refine = z.union([buffSchema,z.array(buffSchema)]);

const specialty = z.object({
  name: z.string(),
  level: qualitySchema,
});

const redStar = z.object({
  level: levelSchema,
  attributes: z.union([refine, z.array(refine)])
})

const ascendingAttribute = z.object({

})


const skillBook = z.object({
  attribute: z.string(),
  level: levelSchema,
})


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
  refines: z.array(refine).optional(),
  talents: z.array(z.object({
    name: z.string(),
    level: z.number(),
    grants: z.union([refine, z.array(refine)])
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

const generalSchema = z.object({
  name: z.string().optional(),
  role: z.enum(['primary', 'assistant']),
  level: z.number().optional(),
  specialities: z.array(specialty).nullable(),
  stars: z.number().default(0).refine((n) => (n >=0 && n <= 10)),
  books: z.array(skillBook),
  equipped: z.union([reference('beast'), reference('dragon')]).optional(),
});
