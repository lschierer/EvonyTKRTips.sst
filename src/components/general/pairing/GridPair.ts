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

  private _primary: BehaviorSubject<GeneralClassType>;

  get primary(): GeneralClassType {
    return this._primary.getValue();
  }

  set primary(g:GeneralClassType) {
    const v = GeneralClass.safeParse(g)
    if(v.success) {
      this._primary = new BehaviorSubject<GeneralClassType>(v.data);
      if(DEBUG) {
        console.log(`GridPair set primary; _primary.getValue().name: ${this._primary.getValue().name}`)
      }
      if(this._primaryId.localeCompare((this._primary.getValue().name))) {
        this._primaryId = this._primary.getValue().name;
      }
      if(DEBUG){
        console.log(`GridPair set primary; _primary.getValue().name: ${this._primary.getValue().name}`)
        console.log(`GridPair set primary; _primaryId: ${this._primaryId}`)
      }
    }
  }

  private _secondaryId = '';

  get secondaryId(): string {
    return this._secondaryId;
  }

  set secondaryId(sId: string) {
    this._secondaryId = sId;

  }

  private _secondary: BehaviorSubject<GeneralClassType>;

  get secondary(): GeneralClassType {
    return this._secondary.getValue();
  }

  set secondary(g: GeneralClassType) {
    const v = GeneralClass.safeParse(g)
    if (v.success) {
      this._secondary = new BehaviorSubject<GeneralClassType>(v.data);
      if(this._secondaryId.localeCompare((this._secondary.name))) {
        this._secondaryId = this._secondary.getValue().name;
      }
    }
  }

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

  private pInvestment: BuffParamsType;

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

  constructor(p: GeneralClassType, s: GeneralClassType){
    this.primary = p;
    this.secondary = s;
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
  }

}