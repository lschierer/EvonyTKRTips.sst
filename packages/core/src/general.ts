import {ulid} from "ulid";
import {Entity, EntityItem} from "electrodb";
import {Dynamo} from "./dynamo";

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

export async function create(name: string, leadership?: number, attack?: number, defense?: number, politics?: number, maxStars?: number) {
  // no general can have less than 5 stars, if I did not send a number, assume that default.
  maxStars = maxStars ? maxStars : 5;
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
