/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="@schemas/index.ts" />

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
