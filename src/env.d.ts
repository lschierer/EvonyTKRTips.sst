/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="@schemas/index.ts" />

declare namespace App {
  interface Locals {
    ExtendedGeneralMap: d3.InternMap<string, ExtendedGeneralType>,
    addEG2EGS: function (GeneralClass): void,
    enrichGeneral: function (string): Promise<boolean>,
    GeneralBuffs: function (string, Display, BuffParams): Promise<boolean> ,
    InvestmentOptions2Key: function(BuffParamsType): string,
  }
}
