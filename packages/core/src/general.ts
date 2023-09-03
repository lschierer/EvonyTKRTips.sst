import { ulid } from "ulid";
import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

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
                required: true,
                readOnly: false,
            },
            leadership:{
                type: "number",
                required: false,
                readOnly: false,
            },
            attack:{
                type: "number",
                required: false,
                readOnly: false,
            },
            defense:{
                type: "number",
                required: false,
                readOnly: false,
            },
            politics:{
                type: "number",
                required: false,
                readOnly: false,
            },
            maxStars:{
                type: "number",
                required: false,
                readOnly: false,
            },
        },
        indexes: {
            primary: {
                pk: {
                    field: "pk",
                    composite: ["generalID"],
                },
                sk: {
                    field: "sk",
                    composite: ["name"],
                },
            },
        },
    },
    Dynamo.Configuration
);

export type GeneralEntityType = EntityItem<typeof GeneralEntity>;

export async function create(name: string, leadership?: number, attack?: number, defense?: number, politics?: number, maxStars?: number){
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

export async function get(generalID: string, name: string) {
    const result = await GeneralEntity.get({
        generalID,
        name
    }).go();
    return result.data;
}

export async function list() {
    const result = await GeneralEntity.scan.go();
    return result.data;
}
