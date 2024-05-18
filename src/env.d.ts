/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="@schemas/index.ts" />

declare namespace App {
  interface Locals {
    ExtendedGeneralMap: d3.InternMap<string, ExtendedGeneralType>,
    InvestmentOptions: d3.InternSet<InvestmentOptionsType>,
    addEG2EGS: function (GeneralClass): void,
    buffComputer: function (ExtendedGeneral): void,
    EvAnsBuff: function (GeneralClass, generalUseCase, BuffParams): number ,
    filterInvestmentOptions: function (ExtendedGeneral, InvestmentOptionsSchema): BuffFilterReturnType
  }
}
