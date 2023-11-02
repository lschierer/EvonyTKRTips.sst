const DEBUG = true;

import {atom, map, action, computed} from "nanostores";
import { logger } from '@nanostores/logger'

import {z} from "zod";

import {
  AllGeneralSchema,
  type AllGeneral,
} from "@schemas/generalsSchema.ts"


export const allGenerals = atom<AllGeneral|null>(null);
