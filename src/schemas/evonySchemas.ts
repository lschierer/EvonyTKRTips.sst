import { z, defineCollection } from 'astro:content';

export const docsSchema = z.object({
  title: z.string(),
  author: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
  date: z.date().optional(),
});

export const monsterSchema = z.object({
  name: z.string(),
  level: z.number(),
});

const ColorEnum = z.enum ( [
  "Green",
  "Blue",
  "Purple",
  "Orange",
  "Gold",
]);

const specialty = z.object({
  name: z.string(),
  level: z.enum<ColorEnum>(),
});

const generalSchema = z.object({
  name: z.string(),
  level: z.number(),
  specialities: z.array(specialty).optional(),
  stars: z.number().default(0),

});