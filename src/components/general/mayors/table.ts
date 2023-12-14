import { LitElement, html, type PropertyValues, type PropertyValueMap, nothing } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import { consume } from '@lit/context';

import {
  ClassEnum,
  GeneralArray,
  generalUseCase,
  levels,
  qualityColor,
  standardSkillBook,
  type ClassEnumType,
  type GeneralArrayType,
  type GeneralElementType,
  type generalUseCaseType,
  type levelsType,
  type qualityColorType,
  type standardSkillBookType,
} from "@schemas/index";

import {
  type generalTypeAndUse, 
  type generalInvestment,  
  generalsContext,
} from "./contexts"

import { SpectrumElement } from "@spectrum-web-components/base";

@customElement("general-table")
export class GeneralTable extends SpectrumElement {

  @consume({ context: generalsContext, subscribe: true })
  @property({attribute: false})
  public theGenerals?: GeneralArrayType | undefined;

  render() {
    return html`
      ${(this.theGenerals !== undefined) ?  this.theGenerals?.length : nothing }
    `
  }

}