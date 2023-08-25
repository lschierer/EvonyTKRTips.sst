import { builder } from "../builder";
import { General } from '../../../../core/src/general'

export class General {
  name: string;
  leadership: number;
  attack: number;
  defense: number;
  politics: number;
  maxStars: number;

  constructor(name: string) {
    this.name = name;
  }
}

builder.objectType(General, {
  name: 'General',
  description: 'Evony Generals',
  fields: (t) => ({
    name: t.exposeString('name', {})

  }),
});

builder.queryFields((t) => ({
  general: t.field({
    type: General,
    args: {
      name: t.arg.string({required: true})
    },
    resolve: async (_, args) => {
      let general;
      if(!general) {
        throw new Error(`no general with ID ${args.name}`)
      }
      return general;
    },
  }),

}))