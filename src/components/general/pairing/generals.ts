const DEBUG = true;

import {atom, map, action, computed} from "nanostores";
import { logger } from '@nanostores/logger'

import {z} from "zod";

import {
  GeneralArray,
  type GeneralArrayType,
  GeneralElementSchema,
  type GeneralElement,
} from "@schemas/generalsSchema.ts"


export const allGenerals = atom<GeneralArrayType|null>(null);

