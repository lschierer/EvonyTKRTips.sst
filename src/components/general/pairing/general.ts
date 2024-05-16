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

import { from, map, switchMap, throwError } from "rxjs";
import {fromFetch} from 'rxjs/fetch'

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
    let returnable = 0;
    if (this.general !== undefined) {
      let path = `generals/buffs/${this.general.name}.json`;

      if (DEBUG) console.log(`EvAnsUrl based on ${path}, ${this._url}`);
      const EvAnsUrl = new URL(path, this._url);
      if (DEBUG) console.log(`constructed url is ${EvAnsUrl.toString()}`);

      const scoreObservable = fromFetch(EvAnsUrl.toString())
        .pipe(switchMap((response) => {
          if(!response.ok) {
            console.log(`problem with fetch in computeEvAnsRanking() for ${this.general.name}`)
            return throwError(() => new Error('bad response'))
          }
          return from(response.json())
        }), map((response) => {
          return z.array(BuffParams).parse(response)
        }))

        const lessData = new Array<BuffParamsType>();

        scoreObservable.subscribe({
          next: scoreData => {
            lessData.push(...scoreData.filter((datum) => {
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
            }));
          },
          error: error => {
            if( error instanceof Error) {
              console.log(error.message)
            } else {
              console.log(error)
            }
          },
          complete: () => {
            if(lessData.length > 1) {
              console.log(`found too many results in return, using first anyway`)
              returnable = lessData[0].EvAnsRanking;
            } else if (lessData.length === 1) {
              returnable = lessData[0].EvAnsRanking
            } else {
              returnable = -1;
            }
          }
        })
        
      if (DEBUG) console.log(`computeEvAnsRanking returning ${returnable}`);
      this._EvAnsRanking = Math.floor(returnable);
      return returnable;
    } else {
      returnable = -2;
    }
    this._EvAnsRanking = returnable;
    return returnable;
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
