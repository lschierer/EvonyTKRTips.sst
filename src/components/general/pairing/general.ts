import {
  BuffParams,
  type BuffParamsType,
  Display,
  type DisplayType,
  GeneralClass,
  type GeneralClassType,
  type qualityColorType,
  qualityColor,
  type AscendingLevelsType,
  AscendingLevels,
} from "@schemas/index";

import * as EvAnsRanking from "@lib/EvAnsAttributeRanking";

import { z } from "astro:content";

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
    if (this.general !== undefined) {
      let path = `generals/buffs/${this.general.name}.json`;

      if (DEBUG) console.log(`EvAnsUrl based on ${path}, ${this._url}`);
      const EvAnsUrl = new URL(path, this._url);
      if (DEBUG) console.log(`constructed url is ${EvAnsUrl.toString()}`);
      const scoreData = fetch(EvAnsUrl)
        .then((r) => {
          if (r.ok) {
            const v = z.array(BuffParams).safeParse( r.json());
            if (v.success) {
              const data: Array<BuffParamsType> = v.data;
              const lessData = data.filter((datum) => {
                if (this._dragon !== datum.dragon) {
                  return false;
                } else if (this._beast !== datum.beast) {
                  return false;
                } else if (this.stars.localeCompare(datum.stars)) {
                  return false;
                } else if (this._special1.localeCompare(datum.special1)) {
                  return false;
                } else if (this._special2.localeCompare(datum.special2)) {
                  return false;
                } else if (this._special3.localeCompare(datum.special3)) {
                  return false;
                } else if (this._special4.localeCompare(datum.special4)) {
                  return false;
                } else if (this._special5.localeCompare(datum.special5)) {
                  return false;
                }
                return true;
              });
              if(lessData.length > 1) {
                console.log(`found too many results in return, using first`)
                return lessData[0].EvAnsRanking
              } 
              return lessData[0].EvAnsRanking;
            }
          } else {
            return 0;
          }
        })
        
      if (DEBUG) console.log(`computeEvAnsRanking returning ${scoreData}`);
      this._EvAnsRanking = Math.floor(1);
      return scoreData;
    } else {
      this._EvAnsRanking = 0;
      return null;
    }
  }

  constructor(g: GeneralClassType, u: URL) {
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

  public EvAnsRanking = async () => {
    await Promise.all([
      this._primary.computeEvAnsRanking(),
      this._secondary.computeEvAnsRanking(),
    ]).catch((e): void => {
      console.log(`EvAnsRanking Promise All failed with message ${JSON.stringify(e.error)}`)
    });
    const total = this._primary.EvAnsRanking + this._secondary.EvAnsRanking;
    if (DEBUG) console.log(`pair total EvAnsRanking is ${total}`);
    return total;
  };

  constructor(p: DisplayGeneral, s: DisplayGeneral) {
    this._primary = p;
    this._secondary = s;
  }
}
