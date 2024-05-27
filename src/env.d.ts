/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="@schemas/EvAns.zod.ts" />
/// <reference path="@schemas/ExtendedGeneral.ts" />
/// <reference path="@schemas/baseSchemas.ts" />
/// <reference path="@schemas/beastSchemas.ts" />
/// <reference path="@schemas/blazonSchemas.ts" />
/// <reference path="@schemas/bookSchemas.ts" />
/// <reference path="@schemas/conflictSchemas.ts" />
/// <reference path="@schemas/generalsSchema.ts" />
/// <reference path="@schemas/specialitySchema.ts" />
/// <reference path="@schemas/statusLightsSchema.ts" />
/// <reference path="@schemas/treasureSchemas.ts" />
/// <reference path="@schemas/troopsSchemas.ts" />

declare namespace App {
  interface Locals {
    ExtendedGenerals: Array<ExtendedGeneralType>,
    ConflictData: Array<ConflictDatumType>,
    CachedPairs: Array<GeneralPairType>,
    addEG2EGS: function (GeneralClass): void,
    GeneralBuffs: function (string, Display, BuffParams): boolean,
    InvestmentOptions2Key: function(BuffParamsType): string,
  }
}
