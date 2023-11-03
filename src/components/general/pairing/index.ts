import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

const DEBUG = false;

import { withStores } from "@nanostores/lit";

import {z,  type ZodError} from 'zod';

import { SpectrumElement } from '@spectrum-web-components/base';

import '@spectrum-web-components/table/elements.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';
import '@spectrum-web-components/status-light/sp-status-light.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import {InterestSelector} from '../InterestSelector.ts';
import {InvestmentSelector} from '../InvestmentSelector.ts';
import {PairingTable} from './table.ts';

import {
  type generalInvestment,
  type generalTypeAndUse,
  primaryInvestmentMap,
  secondaryInvestmentMap,
  typeAndUseMap
} from '../generalInvestmentStore.ts';

import {
  conflictingGenerals,
  conflictRecords,
  checkConflicts,
} from "./ConflictingSkillExcludes.ts";

import {
  allGenerals,
} from './generals.ts';

import {
  GeneralArray,
  type GeneralArrayType,
  GeneralElementSchema,
  type GeneralElement,
} from "@schemas/generalsSchema.ts"

import {BookSchema, type Book} from '@schemas/bookSchemas.ts'

import {ConflictArray, type ConflictArrayType} from "@schemas/conflictSchemas.ts";


@customElement('pairing-page')
export class PairingPage extends withStores(SpectrumElement, [allGenerals,conflictingGenerals,conflictRecords,typeAndUseMap,primaryInvestmentMap, secondaryInvestmentMap]) {

  @property({type: String})
  public dataUrl: string = 'http://localhost';

  @state()
  private _dataUrl: URL = new URL(this.dataUrl);

  @property({type: String})
  public conflictData: string = 'http://localhost';

  @state()
  private _conflictData: URL = new URL(this.conflictData);

  async willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('conflictData')) {
      this._conflictData = new URL(this.conflictData);
      
      const result = await fetch(this._conflictData).then((response) => {
        if(response.ok) {
          return response.text();
        } else throw new Error('Status code error: ' + response.status);
      }).then((text) => {
        const jsonResult = JSON.parse(text);
        const result = ConflictArray.safeParse(jsonResult);
        if(result.success) {
          if(result.data !== undefined) {
            conflictRecords.set(result.data);
          }
          return true;
        } else {
          console.error(result.error)
        }
      })
    }
    if (changedProperties.has('dataUrl')) {
      this._dataUrl = new URL(this.dataUrl);

      const result = await fetch(this._dataUrl).then((response) => {
        if (response.ok) {
          return response.text();
        } else throw new Error('Status code error: ' + response.status);
      }).then((text) => {
        const jsonResult = JSON.parse(text);
        const result: { success: true; data: GeneralArrayType } | { success: false; error: ZodError; } = GeneralArray.safeParse(jsonResult);
        if (result.success) {
          if(result.data !== undefined && result.data !== null) {
            allGenerals.set(result.data);
            return true;
          }
        } else {
          result.error;
        }
        return false;
      }).catch((error) => {
        return false;
      });
      if (result) {
      }
    }

  }

  private changeHandler(e: CustomEvent) {
    console.log(`${JSON.stringify(e)}`)
  }

  static styles = css`
    .sp-table-container {
      display: block;
      flex: 2 0 auto;
      min-height: calc(var(--spectrum-global-dimension-size-6000)*2);
      
    }
    
  `

  public render() {

    return html`
      <div class="sp-table-container">
        <interest-selector role="primary"></interest-selector>
        <investment-selector generalRole="primary" @PickerChanged=${this.changeHandler} ></investment-selector>
        <investment-selector generalRole="secondary" @PickerChanged=${this.changeHandler}></investment-selector>
        <pairing-table></pairing-table>
      </div>
    `

  }

}