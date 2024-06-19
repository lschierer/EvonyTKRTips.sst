import { z } from 'astro:content';
import { ulid } from 'ulidx';

import { ClassEnum } from '@schemas/baseSchemas';

const bookAttributes = z.enum([
  'HP',
  'Defense',
  'Attack',
  'Speed',
  'Range_Bonus',
  'March_Size',
  'March_Speed',
  'Monster_March_Speed',
  'Renascence',
  'Exploration',
  'Gatherer',
  'Load',
  'Luck',
  'Respect',
  'Rebirth',
  'Construction',
  'Gold_Production',
  'Training_Capacity',
  'Training_Speed',
  'Attack_Against_Monster',
  'Defense_Against_Monster',
  'HP_Against_Monster',
]);

type bookAttributesType = z.infer<typeof bookAttributes>;

const book = z.object({
  book: bookAttributes,
  level: z.number(),
  class: ClassEnum.nullish(),
});

type bookType = z.infer<typeof book>;

const ClassEnums = [
  ClassEnum.enum.Archers,
  ClassEnum.enum.Ground,
  ClassEnum.enum.Mounted,
  ClassEnum.enum.Siege,
  ClassEnum.enum.all,
];

const bookValues: Map<bookType, string> = new Map<bookType, string>();
const t = {
  book: bookAttributes.enum.HP,
  level: 1,
  class: ClassEnum.enum.Ground,
};
const value: string = '---\n'.concat('books:\n').concat('  ', ulid(), ':\n');
bookValues.set(t, value);

const mapIter = bookValues.values();

for (const i of mapIter) {
  console.log(i);
}
