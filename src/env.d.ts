/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="@schemas/index.ts" />

declare namespace App {
  interface Locals {
    ExtendedGeneralMap: Map<string, ExtendedGeneralType>,
    addEG2EGS: function (GeneralClass): void,
    enrichGeneral: function (string): Promise<boolean>,
    GeneralBuffs: function (string, Display, BuffParams): boolean,
    InvestmentOptions2Key: function(BuffParamsType): string,
  }
}
