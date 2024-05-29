import { customElement, property, state } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";

import { z} from 'zod'

import {delay } from 'nanodelay'

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
  computedBuffs?: Map<string,RankInstanceType>,
}

@customElement("grid-general")
export class GridGeneral extends SizedMixin(BaseGeneral, {
  noDefaultSize: true,
}) {

  
  constructor() {
    super();
    
  }

  static InvestmentOptionsRE = /[[\]'",]/g;

  static InvestmentOptions2Key = z
    .function()
    .args(BuffParams)
    .returns(z.string())
    .implement((BP: BuffParamsType) => {
      return JSON.stringify(BP).replace(GridGeneral.InvestmentOptionsRE, "");
  });

  

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    super.willUpdate(_changedProperties)

  }

  public static override get styles(): CSSResultArray {
    const localStyle = css``;
    if(super.styles !== undefined && Array.isArray(super.styles)) {
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
