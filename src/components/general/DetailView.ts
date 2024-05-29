import { customElement, property, state } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

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
  type TemplateResult
} from "@spectrum-web-components/base";

import SpectrumTokens from "@spectrum-css/tokens/dist/index.css?inline";
import SpectrumTypography from "@spectrum-css/typography/dist/index.css?inline";
import SpectrumIcon from "@spectrum-css/icon/dist/index.css?inline";
import SpectrumTable from "@spectrum-css/table/dist/index.css?inline";
import "iconify-icon";

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

import { BaseGeneral } from "./BaseGeneral";
const DEBUG = true;

@customElement("detail-view")
export class DetailView extends SizedMixin(BaseGeneral, {
  noDefaultSize: true,
}) {

  @state()
  private starsHtml = " ";

  @state()
  private EvAnsRanking = 0;

  constructor() {
    super();

  }

  static InvestmentLevel: BuffParamsType = {
    special1: qualityColor.enum.Gold,
    special2: qualityColor.enum.Gold,
    special3: qualityColor.enum.Gold,
    special4: qualityColor.enum.Gold,
    special5: qualityColor.enum.Disabled,
    stars: AscendingLevels.enum[10],
    dragon: true,
    beast: true,
  }
  
  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    await super.willUpdate(_changedProperties)
    if(_changedProperties.has('_eg')) {
      let InComplete = true;
      do {
        if(!this.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
          InComplete = false;
          const result = this.GeneralBuffs(Display.enum.summary, DetailView.InvestmentLevel)
          if(result) {
            this.EvAnsRanking = this.computedBuffs.get(BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel))?.EvAnsRanking ?? -7;
          }
        } else {
          await delay(10);
        }
      }while (InComplete)
    }
  }

  public static override get styles(): CSSResultArray {
    const SpectrumIconCSS = unsafeCSS(SpectrumIcon)
    const SpectrumTableCSS = unsafeCSS(SpectrumTable)
    const localStyle = css``;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [
        ...super.styles,
        SpectrumIconCSS,
        SpectrumTableCSS,
        localStyle
      ]
    } else {
      return [
        SpectrumIconCSS,
        SpectrumTableCSS,
        localStyle
      ]
    }
  }

  private renderStars() {
    let starsNum = 0;
    let starsLimit = 0;
    if(this.general !== null ) {
      starsNum = +(this.general.stars ? this.general.stars : 0);
      starsLimit = starsNum <= 5 ? starsNum : 5;
      for (let i = 0; i < starsLimit; i++) {
        if (starsNum >= 6 && i < starsNum - 5) {
          this.starsHtml = this.starsHtml.concat(
            '<iconify-icon style="color: var(--spectrum-red-900)" icon="mdi:star"></iconify-icon>'
          );
        } else {
          this.starsHtml = this.starsHtml.concat(
            '<iconify-icon style="color: var(--spectrum-yellow-300)" icon="mdi:star"></iconify-icon>'
          );
        }
      }
    }
  }

  protected override render(): TemplateResult {
    return html`
    <div class="GeneralDetails not-content" id={generalName}>
      <span class="center spectrum-Heading spectrum-Heading--sizeS">Level: {this.general.level}</span>
      <div class="not-content Stars">
        ${unsafeHTML(this.starsHtml)}
      </div>
      <br/>
    </div>
    `
  }

}