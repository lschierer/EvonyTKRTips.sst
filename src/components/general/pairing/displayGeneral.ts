import { delay } from 'nanodelay'

import {
  BuffParams,
  type BuffParamsType,
  Display,
  type DisplayType,
  ExtendedGeneral,
  type ExtendedGeneralType,
  GeneralClass,
  type GeneralClassType,
  type qualityColorType,
  qualityColor,
  type AscendingLevelsType,
  AscendingLevels,
} from "@schemas/index";

import * as EvAnsRanking from "@lib/EvAnsAttributeRanking";

import { z } from "astro:content";
import type { APIContext } from "astro";


import { from, map, switchMap, throwError } from "rxjs";
import { fromFetch } from 'rxjs/fetch'

export const DEBUG = true;

export class DisplayGeneral {
  private _url: URL;

  public display: DisplayType = Display.enum.summary;

  public general: GeneralClassType;

  private _special1: qualityColorType = qualityColor.enum.Disabled;
  private _special2: qualityColorType = qualityColor.enum.Disabled;
  private _special3: qualityColorType = qualityColor.enum.Disabled;
  private _special4: qualityColorType = qualityColor.enum.Disabled;
  private _special5: qualityColorType = qualityColor.enum.Disabled;
  private _stars: AscendingLevelsType = AscendingLevels.enum[0];
  private _dragon = false;
  private _beast = false;

  get special1() {
    return this._special1;
  }

  set special1(qc: qualityColorType) {
    this._special1 = qc;
  }

  get special2() {
    return this._special2;
  }

  set special2(qc: qualityColorType) {
    this._special2 = qc;
  }

  get special3() {
    return this._special3;
  }

  set special3(qc: qualityColorType) {
    this._special3 = qc;
  }

  get special4() {
    return this._special4;
  }

  set special4(qc: qualityColorType) {
    this._special4 = qc;
  }

  get special5() {
    return this._special5;
  }

  set special5(qc: qualityColorType) {
    this._special5 = qc;
  }

  get stars() {
    return this._stars;
  }

  set stars(stars: AscendingLevelsType) {
    this._stars = stars;
  }

  get dragon() {
    return this._dragon;
  }

  set dragon(d: boolean) {
    this._dragon = d;
  }

  get beast() {
    return this._beast;
  }

  set beast(b: boolean) {
    this._beast = b;
  }

  private _EvAnsRanking = 0;

  get EvAnsRanking() {
    return this._EvAnsRanking;
  }

  set EvAnsRanking(n) {
    this._EvAnsRanking = n;
  }

  constructor(g: GeneralClassType, u: URL, ) {
    //zod is an easy way to get a deep clone
    this.general = GeneralClass.parse(g);

    this._url = new URL("/", u);

  }
}

export class DisplayPair {
  private _primary: DisplayGeneral;

  private _secondary: DisplayGeneral;

  get primary() {
    return this._primary;
  }

  set primary(p: DisplayGeneral) {
    this._primary = p;
  }

  get secondary() {
    return this._secondary;
  }

  set secondary(s: DisplayGeneral) {
    this._secondary = s;
  }

  get EvAnsRanking() {
    
    const total = this._primary.EvAnsRanking + this._secondary.EvAnsRanking;
    //if (DEBUG) console.log(`pair total EvAnsRanking is ${total}`);
    return total;
  };

  constructor(p: DisplayGeneral, s: DisplayGeneral) {
    this._primary = p;
    this._secondary = s;
  }
}
