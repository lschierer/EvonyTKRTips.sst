import { createContext } from "@lit/context";


import {
    type ConflictArrayType,
    type GeneralElementType,
  } from "@schemas/index";
  
  import {GeneralTable} from './table';
  
  export type GeneralStore = {
    allGenerals: GeneralElementType[] | null;
  
    conflicts: ConflictArrayType | null;
  }

  const allGenerals = Symbol('allGenerals');
  
  
  export const GeneralStoreContext = createContext<GeneralStore>(Symbol('allGenerals'));
