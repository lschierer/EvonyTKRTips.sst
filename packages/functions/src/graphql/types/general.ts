import { General } from '@core/general';
import { builder} from "../builder";

const GeneralType = builder
    .objectRef<General.GeneralEntityType>("General")
    .implement({
        fields: (t) => ({
            generalId: t.exposeID("generalID"),
            name: t.exposeString("name")
        })
    });

builder.queryFields((t) => ({
    general: t.field({
        type: GeneralType,
        args: {
            generalID: t.arg.string({ required: true }),
            name: t.arg.string({required: true}),
        },
        resolve: async (_, args) => {
            const result = await General.get(args.generalID, args.name);

            if (!result) {
                throw new Error("General not found");
            }

            return result;
        },
    }),
    generals: t.field({
        type: [GeneralType],
        resolve: () => General.list(),
    }),
}));

builder.mutationFields((t) => ({
    createGeneral: t.field({
        type: GeneralType,
        args: {
            name: t.arg.string({ required: true }),
        },
        resolve: (_, args) => General.create(args.name),
    }),
}));
