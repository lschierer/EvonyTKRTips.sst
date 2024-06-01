import { fromFetch } from 'rxjs/fetch';
import { BehaviorSubject, from, map, concatMap, switchMap, throwError } from 'rxjs';
import { z } from 'zod';

import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType, qualityColor,
} from '@schemas/baseSchemas';

import {
  Speciality,
  type SpecialityType,
} from '@schemas/specialitySchema';

import {
  specialSkillBook,
  Book,
  type BookType,
  type specialSkillBookType,
  type standardSkillBookType,
} from '@schemas/bookSchemas';

import {
  Display,
  GeneralClass,
  type GeneralClassType,
  generalRole,
  type generalRoleType,
  generalUseCase,
} from '@schemas/generalsSchema';

import {
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type ExtendedGeneralStatusType,
  type RankInstanceType,
} from '@schemas/ExtendedGeneral';

import { EvAnsScoreComputer } from '../buffComputers/EvAnsRanking/EvAnsScoreComputer';
import { ScoreComputer as AttackScoreComputer } from '../buffComputers/AttackRanking/ScoreComputer';
import { ScoreComputer as ToughnessScoreComputer } from '../buffComputers/ToughnessRanking/ScoreComputer';

const DEBUG = true;

export class GridPair {

  public index = 0;

  private _primaryId = '';

  get primaryId(): string {
    return this._primaryId;
  }

  set primaryId(pId: string) {
    this._primaryId = pId;

  }

  // @ts-ignore
  private _primary: GeneralClassType;

  get primary(): GeneralClassType {
    return this._primary;
  }

  set primary(g: GeneralClassType) {
    const v = GeneralClass.safeParse(g);
    if (v.success) {
      this._primary = v.data;
      if (DEBUG) {
        console.log(`GridPair set primary; _primary.getValue().name: ${this._primary.name}`);
      }
      if (this._primaryId.localeCompare((this._primary.name))) {
        this._primaryId = this._primary.name;
      }
      if (DEBUG) {
        console.log(`GridPair set primary; _primary.getValue().name: ${this._primary.name}`);
        console.log(`GridPair set primary; _primaryId: ${this._primaryId}`);
      }
    }
  }

  private pBooks: BookType[];
  private pSpecialities: SpecialityType[];


  private _secondaryId = '';

  get secondaryId(): string {
    return this._secondaryId;
  }

  set secondaryId(sId: string) {
    this._secondaryId = sId;

  }

  // @ts-ignore
  private _secondary: GeneralClassType;

  get secondary(): GeneralClassType {
    return this._secondary;
  }

  set secondary(g: GeneralClassType) {
    const v = GeneralClass.safeParse(g);
    if (v.success) {
      this._secondary = v.data;
      if (this._secondaryId.localeCompare((this._secondary.name))) {
        this._secondaryId = this._secondary.name;
      }
    }
  }

  private sBooks: BookType[];
  private sSpecialities: SpecialityType[];

  public ApiUrl: URL;

  private _EvAnsRanking = 0;

  get EvAnsRanking(): number {
    return this._EvAnsRanking;
  }

  private _AttackRanking = 0;

  get AttackRanking(): number {
    return this._AttackRanking;
  }

  private _ToughnessRanking = 0;

  get ToughnessRanking(): number {
    return this._ToughnessRanking;
  }

  // @ts-ignore
  private pInvestment: BuffParamsType;

  // @ts-ignore
  private sInvestment: BuffParamsType;

  set InvestmentLevel(level: BuffParamsType) {
    const v = BuffParams.safeParse(level);
    if (v.success) {
      this.pInvestment = v.data;
      this.sInvestment = {
        special1: v.data.special1,
        special2: v.data.special2,
        special3: v.data.special3,
        special4: v.data.special4,
        special5: v.data.special5,
        stars: AscendingLevels.enum['0'],
        dragon: v.data.dragon,
        beast: v.data.beast,
      };
    }
  }

  get InvestmentLevel(): BuffParamsType {
    return this.pInvestment;
  }

  public async getSkillBooks(forG: generalRoleType){
    let general: GeneralClassType;
    let bArray: BookType[];
    if (!forG.localeCompare(generalRole.enum.primary)) {
      general = this._primary;
      bArray = this.pBooks;
    } else {
      general = this._secondary;
      bArray = this.sBooks;
    }
    if(Array.isArray(general.books)){
      general.books.map(async (gb) => {
        const bUrl = new URL(`/books/${gb}.json`, this.ApiUrl);
        const data = await fetch(bUrl)
          .then((response) => {
            if (response.ok) return response.json();
            else throw new Error('Status code error :' + response.status);
          })
          .catch((error) => {
            console.error(JSON.stringify(error));
            return false;
          });
        const v1 = Book.safeParse(data);
        if(v1.success){
          const bd = bArray.some((tb: BookType) => {
            return !tb.name.localeCompare(v1.data.name);
          });
          if(bd) {
            return false;
          } else {
            bArray.push(v1.data);
          }
        } else {
          //the general could not have been null, I already tested for that
          console.log(`invalid book detected for ${general.name} `, this.index);
          console.log(JSON.stringify(data));
          return false;
        }
      })
    }
    if(bArray.length > 0){
      if (!forG.localeCompare(generalRole.enum.primary)){
        this.pBooks = [...bArray];
      } else {
        this.sBooks = [...bArray];
      }
    }
  }

  public async getSpecialities(forG: generalRoleType) {
    let general: GeneralClassType;
    let sArray: SpecialityType[];
    if (!forG.localeCompare(generalRole.enum.primary)) {
      general = this._primary;
      sArray = this.pSpecialities;
    } else {
      general = this._secondary;
      sArray = this.sSpecialities;
    }
    if (Array.isArray(general.specialities)) {
      general.specialities.map(async (sn) => {
        const sURL = new URL(`/specialities/${sn}.json`, this.ApiUrl);
        const data = await fetch(sURL)
          .then((response) => {
            if (response.ok) return response.json();
            else throw new Error('Status code error :' + response.status);
          })
          .catch((error) => {
            console.error(JSON.stringify(error));
            return false;
          });
        const v1 = Speciality.safeParse(data);
        if (v1.success) {
          const sd = sArray.some((ts: SpecialityType) => {
            return !ts.name.localeCompare(v1.data.name);
          });
          if (sd) {
            return false;
          } else {
            sArray.push(v1.data);
          }
        } else {
          //the general could not have been null, I already tested for that
          console.log(`invalid special detected for ${general.name} `, this.index);
          console.log(JSON.stringify(data));
          return false;
        }
      });
    }
    if (sArray.length > 0) {
      if (!forG.localeCompare(generalRole.enum.primary)) {
        this.pSpecialities = [...sArray];
      } else {
        this.sSpecialities = [...sArray];
      }
    }
  }

  constructor(p: GeneralClassType, s: GeneralClassType, u: string) {
    this.primary = p;
    this.pBooks = new Array<BookType>();
    this.pSpecialities = new Array<SpecialityType>();

    this.secondary = s;
    this.sBooks = new Array<BookType>();
    this.sSpecialities = new Array<SpecialityType>();

    this.InvestmentLevel = {
      special1: qualityColor.enum.Disabled,
      special2: qualityColor.enum.Disabled,
      special3: qualityColor.enum.Disabled,
      special4: qualityColor.enum.Disabled,
      special5: qualityColor.enum.Disabled,
      stars: AscendingLevels.enum['0'],
      dragon: false,
      beast: false,
    };
    this.ApiUrl = new URL('/', u);
    if (DEBUG) {
      console.log(`base URL initialized to ${this.ApiUrl}`);
    }
  }
}