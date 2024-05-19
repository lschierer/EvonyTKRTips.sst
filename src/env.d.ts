/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="@schemas/index.ts" />

declare namespace App {
  interface Locals {
    ExtendedGeneralMap: d3.InternMap<string, ExtendedGeneralType>,
    InvestmentOptions: d3.InternMap<string, InvestmentOptionsType>,
    addEG2EGS: function (GeneralClass): void,
    enrichGeneral: function (string): Promise<boolean>,
    EvAnsBuff: function (GeneralClass, Display, BuffParams): number ,
    InvestmentOptions2Key: function(BuffParamsType): string,
  }
}
