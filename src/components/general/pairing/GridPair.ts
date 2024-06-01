import { fromFetch } from "rxjs/fetch";
import { BehaviorSubject, from, map, concatMap, switchMap, throwError } from "rxjs";
import { z } from "zod";

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

  set primary(g:GeneralClassType) {
    const v = GeneralClass.safeParse(g)
    if(v.success) {
      this._primary = v.data;
      if(DEBUG) {
        console.log(`GridPair set primary; _primary.getValue().name: ${this._primary.name}`)
      }
      if(this._primaryId.localeCompare((this._primary.name))) {
        this._primaryId = this._primary.name;
      }
      if(DEBUG){
        console.log(`GridPair set primary; _primary.getValue().name: ${this._primary.name}`)
        console.log(`GridPair set primary; _primaryId: ${this._primaryId}`)
      }
    }
  }

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
    const v = GeneralClass.safeParse(g)
    if (v.success) {
      this._secondary = v.data;
      if(this._secondaryId.localeCompare((this._secondary.name))) {
        this._secondaryId = this._secondary.name;
      }
    }
  }

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
    const v = BuffParams.safeParse(level)
    if(v.success) {
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
      }
    }
  }

  get InvestmentLevel(): BuffParamsType {
    return this.pInvestment;
  }

  private async getSkillBooks(forG: generalRoleType) {
    let general: GeneralClassType;
    let sArray: SpecialityType[];
    if(!forG.localeCompare(generalRole.enum.primary)){
      general = this._primary;
      sArray = this.pSpecialities;
    } else {
      general = this._secondary;
      sArray = this.sSpecialities;
    }
    if(Array.isArray(general.specialities)){
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
        if (v1.success ) {
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
          console.log(`invalid special detected for ${general.name}`);
          console.log(JSON.stringify(data));
          return false;
        }
      })
    }
  }

  constructor(p: GeneralClassType, s: GeneralClassType, u: string) {
    this.primary = p;
    this.pSpecialities = new Array<SpecialityType>()
    this.secondary = s;
    this.sSpecialities = new Array<SpecialityType>()
    this.InvestmentLevel = {
      special1: qualityColor.enum.Disabled,
      special2: qualityColor.enum.Disabled,
      special3: qualityColor.enum.Disabled,
      special4: qualityColor.enum.Disabled,
      special5: qualityColor.enum.Disabled,
      stars: AscendingLevels.enum['0'],
      dragon: false,
      beast: false,
    }
    this.ApiUrl = new URL('/',u);
    if(DEBUG) {
      console.log(`base URL initialized to ${this.ApiUrl}`)
    }
    this.getSkillBooks(generalRole.enum.primary);
  }
}