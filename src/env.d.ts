/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="@schemas/index.ts" />

declare namespace App {
  interface Locals {
    ExtendedGeneralMap: d3.InternMap<string, ExtendedGeneralType>,
    addEG2EGS: function (GeneralClass): void,
    enrichGeneral: function (string): Promise<boolean>,
    EvAnsBuff: function (string, Display, BuffParams): number | Promise<number> ,
    InvestmentOptions2Key: function(BuffParamsType): string,
  }
}
