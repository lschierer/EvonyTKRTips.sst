/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />


declare namespace App {
  interface Locals {
    ExtendedGenerals: Array<ExtendedGeneralType>,
    ConflictData: Array<ConflictDatumType>,
    CachedPairs: Array<GeneralPairType>,
    addEG2EGS: function (GeneralClass): void,
    pairGenerals: function(void): void,
  }
}
