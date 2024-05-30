import { customElement, property, state } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";

import { z } from 'zod'

import { delay } from 'nanodelay'

import {
  SizedMixin,
  SpectrumElement,
  type CSSResultArray,
  html,
  css,
  unsafeCSS,
  type PropertyValueMap,
} from "@spectrum-web-components/base";

import SpectrumTokens from "@spectrum-css/tokens/dist/index.css?inline";
import SpectrumTypography from "@spectrum-css/typography/dist/index.css?inline";
import SpectrumIcon from "@spectrum-css/icon/dist/index.css?inline";
import SpectrumTable from "@spectrum-css/table/dist/index.css?inline";

import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
  qualityColor,
} from "@schemas/baseSchemas";

import {
  Speciality,
  type SpecialityType,
} from "@schemas/specialitySchema";

import {
  Book,
  specialSkillBook,
  standardSkillBook,
  type BookType,
  type specialSkillBookType,
  type standardSkillBookType,
} from "@schemas/bookSchemas";


import {
  Display,
  GeneralClass,
  type GeneralClassType,
  generalUseCase,
} from '@schemas/generalsSchema'

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type ExtendedGeneralStatusType,
  RankInstance,
  type RankInstanceType,
} from "@schemas/ExtendedGeneral";

import { BaseGeneral } from "../BaseGeneral";

const DEBUG = true;

interface Props {
  general: GeneralClassType,
  status: ExtendedGeneralStatusType,
  computedBuffs?: Map<string, RankInstanceType>,
}

@customElement("grid-general")
export class GridGeneral extends SizedMixin(BaseGeneral, {
  noDefaultSize: true,
}) {

  @property({
    type: Number,
    reflect: true
  })
  public EvAnsRanking = 0;

  @property({
    type: Number,
    reflect: true
  })
  public AttackRanking = 0;

  @property({
    type: Number,
    reflect: true
  })
  public ToughnessRanking = 0;

  @property({ type: Object })
  public InvestmentLevel: BuffParamsType | null = null;

  constructor() {
    super();

  }

  private recomputeBuffs = async () => {
    let InComplete = true;
    do {
      if (this.InvestmentLevel !== null && !this.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
        InComplete = false;
        const result = this.GeneralBuffs(Display.enum.summary, this.InvestmentLevel)
        if (result) {
          this.EvAnsRanking = this.computedBuffs.get(BaseGeneral.InvestmentOptions2Key(this.InvestmentLevel))?.EvAnsRanking ?? -7;
          this.AttackRanking = this.computedBuffs.get(BaseGeneral.InvestmentOptions2Key(this.InvestmentLevel))?.AttackRanking ?? -7;
          this.ToughnessRanking = this.computedBuffs.get(BaseGeneral.InvestmentOptions2Key(this.InvestmentLevel))?.ToughnessRanking ?? -7;
        }
      } else {
        await delay(10);
      }
    } while (InComplete)
  }

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    super.willUpdate(_changedProperties)
    if(_changedProperties.has('_eg')){
      if(this.InvestmentLevel !== null){
        await this.recomputeBuffs();
      }
    }
    if(_changedProperties.has('InvestmentLevel')){
      if(this._eg !== null && this._eg !== undefined){
        await this.recomputeBuffs();
      }
    }
  }

  public static override get styles(): CSSResultArray {
    const localStyle = css``;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [
        ...super.styles,
        localStyle
      ]
    } else {
      return [
        localStyle
      ]
    }
  }


}
