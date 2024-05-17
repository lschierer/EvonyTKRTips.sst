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

  private _context: App.Locals;

  public display: DisplayType = Display.enum.summary;

  public general: GeneralClassType;

  private _special1: qualityColorType = qualityColor.enum.Disabled;
  private _special2: qualityColorType = qualityColor.enum.Disabled;
  private _special3: qualityColorType = qualityColor.enum.Disabled;
  private _special4: qualityColorType = qualityColor.enum.Disabled;
  private _special5: qualityColorType = qualityColor.enum.Disabled;
  private _stars: AscendingLevelsType = AscendingLevels.enum[0];
  private _dragon: boolean = false;
  private _beast: boolean = false;

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

  public async computeEvAnsRanking() {
    let returnable = 0;

    if (this._context.ExtendedGeneralSet !== undefined) {
      for (const eg of this._context.ExtendedGeneralSet) {

        if (!eg.general.name.localeCompare(this.general.name)) {
          let delayIteration = 1;
          while (!(eg.complete as boolean) && delayIteration < 20) {
            if (DEBUG) console.log(`in DispalyGeneral computeEvAnsRanking, ${delayIteration} delay for complete `)
            await delay(60 * delayIteration)
            delayIteration++;
          }
          const possibleBuffs = [...eg.computedBuffs as Array<BuffParamsType>]
          for (const cb of possibleBuffs) {
            if (cb.special1.localeCompare(this._special1)) {
              if (cb.special2.localeCompare(this._special2)) {
                if (cb.special3.localeCompare(this._special3)) {
                  if (cb.special4.localeCompare(this._special4)) {
                    if (cb.special5.localeCompare(this._special5)) {
                      if (cb.stars.localeCompare(this._stars)) {
                        if (cb.dragon === this._dragon) {
                          if (cb.beast === this.beast) {
                            returnable = cb.EvAnsRanking;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return returnable;
  }

  constructor(g: GeneralClassType, u: URL, c: App.Locals) {
    //zod is an easy way to get a deep clone
    this.general = GeneralClass.parse(g);

    this._url = new URL("/", u);

    this._context = c;
  }
}

export class DisplayPair {
  private _primary: DisplayGeneral;

  private _secondary: DisplayGeneral;

  private _context: App.Locals;

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

  public EvAnsRanking = async () => {
    await Promise.all([
      this._primary.computeEvAnsRanking(),
      this._secondary.computeEvAnsRanking(),
    ]).catch((e): void => {
      console.log(`EvAnsRanking Promise All failed with message ${JSON.stringify(e.error)}`)
    });
    const total = this._primary.EvAnsRanking + this._secondary.EvAnsRanking;
    //if (DEBUG) console.log(`pair total EvAnsRanking is ${total}`);
    return total;
  };

  constructor(p: DisplayGeneral, s: DisplayGeneral, c: App.Locals) {
    this._primary = p;
    this._secondary = s;
    this._context = c;
  }
}
