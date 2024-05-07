import {z} from 'zod'
import { createContext } from "@lit/context";


import {
    ConflictArray,
    GeneralElement,
    type ConflictArrayType,
    type GeneralElementType,
  } from "@schemas/index";
  
  import {GeneralTable} from './table';
  
  const GeneralStoreObject = z.object({
    allGenerals: z.array(GeneralElement).nullish(),
    conflicts: ConflictArray.nullish(),
  });

  export type GeneralStore = z.infer<typeof GeneralStoreObject>;
  
  
  export const GeneralStoreContext = createContext<GeneralStore>(Symbol('allGenerals'));
