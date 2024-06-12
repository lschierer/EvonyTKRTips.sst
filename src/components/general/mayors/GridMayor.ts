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
import { MayorAttackDetails } from '../buffComputers/TKRTipsRanking/MayorAttackDetails';

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

  public ApiUrl: URL = new URL('http://localhost/');

  private pEvAnsRanking = 0;

  get EvAnsRanking(): number {
    const value = Math.floor(this.pEvAnsRanking);
    if (DEBUG) {
      console.log(`pEvAnsRanking for ${this.primaryId} ${this.pEvAnsRanking} `);
      console.log(
        `tEvAnsRanking ${this.primaryId} ${value}`
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

  private pGroundAttackRanking = 0;

  get GroundAttackRanking() {
    return this.pGroundAttackRanking;
  }

  private pArcheryAttackRanking = 0;

  get ArcheryAttackRanking(): number {
    return this.pArcheryAttackRanking;
  }

  private pMountedAttackRanking = 0;

  get MountedAttackRanking() {
    return this.pMountedAttackRanking;
  }

  private pSiegeAttackRanking = 0;

  get SiegeAttackRanking() {
    return this.pSiegeAttackRanking;
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
          console.log(`GeneralBuffs for ${this._primary.name} as primary`);
        }
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

        this.pGroundAttackRanking = MayorAttackDetails(
          this._primary,
          this.pInvestment,
          generalSpecialists.enum.Ground,
        );

        this.pArcheryAttackRanking = MayorAttackDetails(
          this._primary,
          this.pInvestment,
          generalSpecialists.enum.Archers,
        );

        this.pMountedAttackRanking = MayorAttackDetails(
          this._primary,
          this.pInvestment,
          generalSpecialists.enum.Mounted,
        );

        this.pSiegeAttackRanking = MayorAttackDetails(
          this._primary,
          this.pInvestment,
          generalSpecialists.enum.Siege,
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
        if(DEBUG) {
          console.log(`mayors do not support secondaries`);
        }
        return false;
      } else {
        return false;
      }
    });

  constructor(p: ExtendedGeneralType, u: string) {
    this.primary = p;

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
