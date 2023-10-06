import {ulid} from "ulid";
import {Entity, EntityItem} from "electrodb";
import {Dynamo} from "./dynamo";
import {z} from 'zod';

export * as General from "./general";

const GeneralEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "General",
      service: "evonytips",
    },
    attributes: {
      generalID: {
        type: "string",
        required: true,
        readOnly: true,
      },
      name: {
        type: "string",
        required: false,
        readOnly: false,
      },
      leadership: {
        type: "number",
        required: false,
        readOnly: false,
      },
      attack: {
        type: "number",
        required: false,
        readOnly: false,
      },
      defense: {
        type: "number",
        required: false,
        readOnly: false,
      },
      politics: {
        type: "number",
        required: false,
        readOnly: false,
      },
      maxStars: {
        type: "number",
        required: false,
        readOnly: false,
      },
    },
    indexes: {
      byID: {
        pk: {
          field: 'pk',
          composite: ['generalID'],
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      byName: {
        index: "gsi1pk-gsi1sk-index",
        pk: {
          field: 'gsi1pk',
          composite: ['name'],
        },
        sk: {
          field: "gsi1sk",
          composite: []
        }
      },
      byStars: {
        index: "gsi3pk-gsi3sk-index",
        pk: {
          field: 'gsi3pk',
          composite: ['maxStars']
        },
        sk: {
          field: "gsi3sk",
          composite: []
        }
      }
    }
  },
  Dynamo.Configuration
);

export type GeneralEntityType = EntityItem<typeof GeneralEntity>;

export const zodGeneral = z.object({
  name: z.string(),
  leadership: z.number().optional(),
  attack: z.number().optional(),
  defense: z.number().optional(),
  politics: z.number().optional(),
  maxStars: z.number().positive().multipleOf(5).max(10).optional(),
})

type zodGeneralType = z.infer<typeof zodGeneral>;

export async function create(general: zodGeneralType) {
  const name = general.name;
  const leadership = general.leadership ? general.leadership : 0;
  const attack = general.attack ? general.attack : 0;
  const defense = general.defense ? general.defense : 0;
  const politics = general.politics ? general.politics : 0;
  const maxStars = general.maxStars ? general.maxStars : 5;
  const result = await GeneralEntity.create({
    generalID: ulid(),
    name,
    leadership,
    attack,
    defense,
    politics,
    maxStars,
  }).go();
  return result.data;
}

export async function generalByID(generalID: string) {
  const result = await GeneralEntity.query.byID({
    generalID: generalID
  }).go();
  return result.data;
}

export async function list() {
  const result = await GeneralEntity.scan.go();
  return result.data;
}
