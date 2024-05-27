import {
  LitElement,
  html,
  css,
  type CSSResultGroup,
  type CSSResultArray,
  getCompatibleStyle,
  type PropertyValues,
  type PropertyValueMap,
  nothing,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";
import { consume } from "@lit/context";

import {z} from "astro:content";

import {
  type generalTypeAndUse,
  type generalInvestment,
  generalsContext,
} from "./contexts";

import {
  AscendingLevels,
  type BuffType,
  type ClassEnumType,
  Condition,
  type levelsType,
  qualityColor,
  type qualityColorType,
  syslogSeverity,
} from "@schemas/baseSchemas";

import {
  ConflictArray, 
  ConflictDatum,   
  type bookConflictsType,
  type ConflictDatumType,
 } from '@schemas/conflictSchemas'

 import {
  Note,
  Display,
  type NoteType,
  GeneralArray,
  type GeneralClassType,
  GeneralElement,
  type GeneralArrayType,
  type GeneralElementType,
  generalSpecialists,
  type generalUseCaseType,
 } from '@schemas/generalsSchema'

 import { 
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  } from "@schemas/ExtendedGeneral";

import { 
  type BookType,
  specialSkillBook,
  standardSkillBook,
  type specialSkillBookType,
  type standardSkillBookType,
 } from "@schemas/bookSchemas";

import {
  Table,
  type TableBody,
  type TableCell,
  type TableCheckboxCell,
  type TableHead,
  type TableHeadCell,
  type TableRow,
} from "@spectrum-web-components/table";
import { SpectrumElement } from "@spectrum-web-components/base";
import "@spectrum-web-components/table/elements.js";

@customElement("table-general")
export class TableGeneral extends SpectrumElement {
  
  @property({ type: Object })
  public thisGeneral: GeneralClassType | null = null;

  @state()
  readonly attackDebuff: number = 0;

  @state()
  readonly SDebuff: number = 0;

  @state()
  readonly HPDebuff: number = 0;

  @state()
  readonly defenseDebuff: number = 0;

  @state()
  readonly W2DDebuff: number = 0;

  @state()
  readonly SCTSDebuff: number = 0;

  @state()
  readonly SCTCDebuff: number = 0;

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.willUpdate(_changedProperties);
    if(_changedProperties.has('thisGeneral')) {

    }
  }

  render() {
    if(this.thisGeneral !== null) {
      return html`
        <sp-table-cell role='gridcell' id="primeName">
          <div class="cellDiv not-content">
            <div class="name not-content">
              ${this.thisGeneral.name}
            </div>
          </div>
        </sp-table-cell>
        <sp-table-cell role='gridcell' class="buff">
          ${this.attackDebuff}
        </sp-table-cell>
        <sp-table-cell role='gridcell' class="buff">
          ${this.SDebuff}
        </sp-table-cell>
        <sp-table-cell role='gridcell' class="buff">
          ${this.HPDebuff}
        </sp-table-cell>
        <sp-table-cell role='gridcell' class="buff">
          ${this.defenseDebuff}
        </sp-table-cell>
        <sp-table-cell role='gridcell' class="buff">
          ${this.W2DDebuff}
        </sp-table-cell>
        <sp-table-cell role='gridcell' class="buff">
          ${this.SCTSDebuff}
        </sp-table-cell>
        <sp-table-cell role='gridcell' class="buff">
          ${this.SCTCDebuff}
        </sp-table-cell>
      `
    }
  }
}
