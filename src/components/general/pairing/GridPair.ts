import { z } from 'zod';

import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
  qualityColor,
} from '@schemas/baseSchemas';

import {
  Display,
  type DisplayType,

  type generalRoleType,
  generalUseCase, type generalUseCaseType,
} from '@schemas/generalsSchema';

import {
  type ExtendedGeneralType,
  ExtendedGeneral,
} from '@schemas/ExtendedGeneral';

import { EvAnsScoreComputer } from '../buffComputers/EvAnsRanking/EvAnsScoreComputer';
import { AttackingScoreComputer } from '../buffComputers/TKRTipsRanking/AttackScoreComputer';
import { ToughnessScoreComputer } from '../buffComputers/TKRTipsRanking/ToughnessScoreComputer';

const DEBUG = false;

export class GridPair {
  public index = 0;

  private _useCase: generalUseCaseType = generalUseCase.enum.all;

  get useCase(): generalUseCaseType {
    return this._useCase;
  }

  set useCase(value: generalUseCaseType) {
    const v = generalUseCase.safeParse(value)
    if(v.success) {
      this._useCase = v.data;
    }
  }

  private _primaryId = '';

  get primaryId(): string {
    return this._primaryId;
  }

  set primaryId(pId: string) {
    this._primaryId = pId;
  }

  // @ts-ignore
  private _primary: ExtendedGeneralType;

  get primary(): ExtendedGeneralType {
    return this._primary;
  }

  set primary(g: ExtendedGeneralType) {
    const v = ExtendedGeneral.safeParse(g);
    if (v.success) {
      this._primary = v.data;
      if (this._primaryId.localeCompare(this._primary.name)) {
        this._primaryId = this._primary.name;
      }
      if (DEBUG) {
        console.log(
          `GridPair set primary; _primary.name: ${this._primary.name}`
        );
        console.log(`GridPair set primary; _primaryId: ${this._primaryId}`);
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

  // @ts-ignore
  private _secondary: ExtendedGeneralType;

  get secondary(): ExtendedGeneralType {
    return this._secondary;
  }

  set secondary(g: ExtendedGeneralType) {
    const v = ExtendedGeneral.safeParse(g);
    if (v.success) {
      this._secondary = v.data;
      if (this._secondaryId.localeCompare(this._secondary.name)) {
        this._secondaryId = this._secondary.name;
      }
    }
  }

  public ApiUrl: URL = new URL('http://localhost/');

  private pEvAnsRanking = 0;
  private sEvAnsRanking = 0;

  get EvAnsRanking(): number {
    const value = this.pEvAnsRanking + this.sEvAnsRanking;
    if (DEBUG) {
      console.log(`pEvAnsRanking for ${this.primaryId} ${this.pEvAnsRanking} `);
      console.log(
        `sEvAnsRanking for ${this.secondaryId} ${this.sEvAnsRanking} `
      );
      console.log(
        `tEvAnsRanking ${this.primaryId} ${this.secondaryId} ${value}`
      );
    }
    return value;
  }

  private pAttackRanking = 0;
  private sAttackRanking = 0;

  get AttackRanking(): number {
    return this.pAttackRanking + this.sAttackRanking;
  }

  private pToughnessRanking = 0;
  private sToughnessRanking = 0;

  get ToughnessRanking(): number {
    return this.pToughnessRanking + this.sToughnessRanking;
  }

  // @ts-ignore
  private pInvestment: BuffParamsType;

  // @ts-ignore
  private sInvestment: BuffParamsType;

  set InvestmentLevel(level: BuffParamsType) {
    const v = BuffParams.safeParse(level);
    if (v.success) {
      this.pInvestment = v.data;
      if(this.sInvestment === null || this.sInvestment === undefined) {
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
  }

  get InvestmentLevel(): BuffParamsType {
    return this.pInvestment;
  }

  get SecondaryInvestmentLevel(): BuffParamsType {
    return this.sInvestment;
  }

  set SecondaryInvestmentLevel(level: BuffParamsType) {
    const v = BuffParams.safeParse(level);
    if(v.success) {
      this.sInvestment = v.data;
    }
  }

  public async getSkillBooks(forG: generalRoleType) {
    //this will eventually need to handle skill books that are not built in
  }

  static InvestmentOptionsRE = /[[\]'",]/g;

  static InvestmentOptions2Key = z
    .function()
    .args(BuffParams)
    .returns(z.string())
    .implement((BP: BuffParamsType) => {
      return JSON.stringify(BP).replace(GridPair.InvestmentOptionsRE, '');
    });

  public BuffsForInvestment(pBP: BuffParamsType, sBP: BuffParamsType) {
    this.InvestmentLevel = pBP;
    this.SecondaryInvestmentLevel = sBP;
    this.GeneralBuffs(Display.enum.primary);
    this.GeneralBuffs(Display.enum.secondary);
  }

  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  private GeneralBuffs = z
    .function()
    .args(Display)
    .returns(z.boolean())
    .implement((display: DisplayType) => {
      if (!display.localeCompare(Display.enum.primary)) {
        if (DEBUG) {
          console.log(`GeneralBuffs for ${this._primary.name} as primary`);
        }
        this.pEvAnsRanking = EvAnsScoreComputer(
          this.useCase,
          this._primary,
          display,
          this.pInvestment
        );
        this.pAttackRanking = AttackingScoreComputer(
          this.useCase,
          this._primary,
          display,
          this.pInvestment
        );
        this.pToughnessRanking = ToughnessScoreComputer(
          this.useCase,
          this._primary,
          display,
          this.pInvestment
        );
        if (DEBUG) {
          console.log(
            `GeneralBuffs ${display} ${this._primary.name}: ${this.pEvAnsRanking}, ${this.pAttackRanking}, ${this.pToughnessRanking}`
          );
        }
        if (
          this.pEvAnsRanking > 0 &&
          this.pAttackRanking > 0 &&
          this.pToughnessRanking > 0
        ) {
          return true;
        } else {
          return false;
        }
      } else if (!display.localeCompare(Display.enum.secondary)) {
        if (DEBUG) {
          console.log(`GeneralBuffs for ${this._secondary.name} as secondary`);
        }
        this.sEvAnsRanking = EvAnsScoreComputer(
          this.useCase,
          this._secondary,
          display,
          this.sInvestment
        );
        this.sAttackRanking = AttackingScoreComputer(
          this.useCase,
          this._secondary,
          display,
          this.sInvestment
        );
        this.sToughnessRanking = ToughnessScoreComputer(
          this.useCase,
          this._secondary,
          display,
          this.sInvestment
        );
        if (DEBUG) {
          console.log(
            `GeneralBuffs ${display} ${this._secondary.name}: ${this.sEvAnsRanking}, ${this.sAttackRanking}, ${this.sToughnessRanking}`
          );
        }
        if (
          this.sEvAnsRanking > 0 &&
          this.sAttackRanking > 0 &&
          this.sToughnessRanking > 0
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });

  constructor(p: ExtendedGeneralType, s: ExtendedGeneralType, u: string) {
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
    };
    this.ApiUrl = new URL('/', u);

    this.GeneralBuffs(Display.enum.primary);
    this.GeneralBuffs(Display.enum.secondary);

    if (DEBUG) {
      console.log(`base URL initialized to ${this.ApiUrl}`);
    }
  }
}
