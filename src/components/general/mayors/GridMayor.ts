import { z } from 'zod';

import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType, CovenantAttributeCategory,
  qualityColor,
} from '@schemas/baseSchemas';

import {
  Display,
  type DisplayType,

  type generalRoleType, generalSpecialists,
  generalUseCase, type generalUseCaseType,
} from '@schemas/generalsSchema';

import {
  type ExtendedGeneralType,
  ExtendedGeneral,
} from '@schemas/ExtendedGeneral';

import { EvAnsScoreComputer } from '../buffComputers/EvAnsRanking/EvAnsScoreComputer';
import { AttackingScoreComputer } from '../buffComputers/TKRTipsRanking/AttackScoreComputer';
import { ToughnessScoreComputer } from '../buffComputers/TKRTipsRanking/ToughnessScoreComputer';
import { type MayorBuffDetails, MayorDetail } from '../buffComputers/TKRTipsRanking/MayorDetail';

const DEBUG = false;

export class GridMayor {
  public index = 0;

  private _useCase: generalUseCaseType = generalUseCase.enum.Mayor;

  get useCase(): generalUseCaseType {
    return this._useCase;
  }

  set useCase(value: generalUseCaseType) {
    const v = generalUseCase.safeParse(value)
    if(v.success) {
      this._useCase = v.data;
    }
  }

  private _generalId = '';

  get generalId(): string {
    return this._generalId;
  }

  set generalId(pId: string) {
    this._generalId = pId;
  }

  // @ts-ignore
  private _eg: ExtendedGeneralType;

  get eg(): ExtendedGeneralType {
    return this._eg;
  }

  set eg(g: ExtendedGeneralType) {
    const v = ExtendedGeneral.safeParse(g);
    if (v.success) {
      this._eg = v.data;
      if (this._generalId.localeCompare(this._eg.name)) {
        this._generalId = this._eg.name;
      }
      if (DEBUG) {
        console.log(
          `GridPair set primary; _primary.name: ${this._eg.name}`
        );
        console.log(`GridPair set primary; _primaryId: ${this._generalId}`);
      }
    }
  }

  public ApiUrl: URL = new URL('http://localhost/');

  private pEvAnsRanking = 0;

  get EvAnsRanking(): number {
    const value = Math.floor(this.pEvAnsRanking);
    if (DEBUG) {
      console.log(`pEvAnsRanking for ${this.generalId} ${this.pEvAnsRanking} `);
      console.log(
        `tEvAnsRanking ${this.generalId} ${value}`
      );
    }
    return value;
  }

  private pAttackRanking = 0;
  get AttackRanking(): number {
    return this.pAttackRanking
  }

  private pToughnessRanking = 0;
  get ToughnessRanking(): number {
    return this.pToughnessRanking ;
  }

  private pAttack = 0;
  get Attack():number {
    return this.pAttack;
  }

  private pDeAttack = 0;
  get DeAttack(): number {
    return this.pDeAttack;
  }

  private pDeDefense = 0;
  get DeDefense(): number {
    return this.pDeDefense;
  }

  private pDeHP = 0;
  get DeHP(): number {
    return this.pDeHP;
  }

  private pDebilitation = 0;
  get Debilitation(): number {
    return this.pDebilitation;
  }

  private pDefense = 0;
  get Defense(): number {
    return this.pDefense;
  }

  private pHP = 0;
  get HP(): number {
    return this.pHP;
  }

  private pMarchSize = 0;
  get MarchSize(): number {
    return this.pMarchSize;
  }

  private pPreservation = 0;
  get Preservation(): number {
    return this.pPreservation;
  }

  private pRange = 0;
  get Range(): number {
    return this.pRange;
  }

  // @ts-ignore
  private pInvestment: BuffParamsType;

  set InvestmentLevel(level: BuffParamsType) {
    const v = BuffParams.safeParse(level);
    if (v.success) {
      this.pInvestment = v.data;
    }
  }

  get InvestmentLevel(): BuffParamsType {
    return this.pInvestment;
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
      return JSON.stringify(BP).replace(GridMayor.InvestmentOptionsRE, '');
    });

  public BuffsForInvestment(pBP: BuffParamsType) {
    this.InvestmentLevel = pBP;

    const r1 = this.GeneralBuffs(Display.enum.primary);

    return (r1);
  }

  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  private GeneralBuffs = z
    .function()
    .args(Display)
    .returns(z.boolean())
    .implement((display: DisplayType) => {
      if (!display.localeCompare(Display.enum.primary)) {
        if (DEBUG) {
          console.log(`GeneralBuffs for ${this._eg.name} as primary`);
        }
        this.pAttackRanking = AttackingScoreComputer(
          this.useCase,
          this._eg,
          display,
          this.pInvestment
        );
        this.pToughnessRanking = ToughnessScoreComputer(
          this.useCase,
          this._eg,
          display,
          this.pInvestment
        );

        const Details: MayorBuffDetails = MayorDetail(
          this._eg,
          this.pInvestment,
          generalSpecialists.enum.Mayor,
          )

        this.pAttack = Details.Attack;
        this.pDeAttack = Details.DeAttack;
        this.pDeDefense = Details.DeDefense;
        this.pDeHP = Details.DeHP;
        this.pDebilitation = Details.Debilitation;
        this.pDefense = Details.Defense;
        this.pHP = Details.HP;
        this.pMarchSize = Details.MarchSize;
        this.pPreservation = Details.Preservation;
        this.pRange = Details.Range;

        if (DEBUG) {
          console.log(
            `GeneralBuffs ${display} ${this._eg.name}: ${this.pEvAnsRanking}, ${this.pAttackRanking}, ${this.pToughnessRanking}`
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
        if(DEBUG) {
          console.log(`mayors do not support secondaries`);
        }
        return false;
      } else {
        return false;
      }
    });

  constructor(p: ExtendedGeneralType, u: string) {
    this.eg = p;

    this.InvestmentLevel = {
      special1: qualityColor.enum.Disabled,
      special2: qualityColor.enum.Disabled,
      special3: qualityColor.enum.Disabled,
      special4: qualityColor.enum.Disabled,
      special5: qualityColor.enum.Disabled,
      stars: AscendingLevels.enum['0stars'],
      covenants: CovenantAttributeCategory.enum.Disabled,
      dragon: false,
      beast: false,
    };
    this.ApiUrl = new URL('/', u);

    this.GeneralBuffs(Display.enum.primary);

    if (DEBUG) {
      console.log(`base URL initialized to ${this.ApiUrl}`);
    }
  }
}
