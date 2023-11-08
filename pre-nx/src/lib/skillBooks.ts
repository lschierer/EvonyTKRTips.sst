import {z} from 'zod';
import { ulid } from 'ulid'

import {
    bookConflicts,
    type bookConflictsType,
    troopClass,
    type troopClassType,
} from "../schemas/evonySchemas.js";

const bookAttributes = z.enum([
    "HP",
    "Defense",
    "Attack",
    "Speed",
    "Range_Bonus",
    "March_Size",
    "March_Speed",
    "Monster_March_Speed",
    "Renascence",
    "Exploration",
    "Gatherer",
    "Load",
    "Luck",
    "Respect",
    "Rebirth",
    "Construction",
    "Gold_Production",
    "Training_Capacity",
    "Training_Speed",
    "Attack_Against_Monster",
    "Defense_Against_Monster",
    "HP_Against_Monster",
]);

type bookAttributesType = z.infer<typeof bookAttributes>;

const book = z.object({
    book: bookAttributes,
    level: z.number(),
    class: troopClass.nullish(),
});

type bookType = z.infer<typeof book>;

const troopClasses = [
    troopClass.enum.Archers, 
    troopClass.enum.Ground, 
    troopClass.enum.Mounted, 
    troopClass.enum.Siege,
    troopClass.enum.all,
];

const bookValues:Map<bookType,string> = new Map();
const t = {book: bookAttributes.enum.HP, level: 1, class: troopClass.enum.Ground};
let value = '---\n';
    value = value.concat('books:\n')
    value = value.concat('  ', ulid(),':\n')
bookValues.set(t, value);

const mapIter = bookValues.values();


for(let i of mapIter ){
    console.log(i);
}