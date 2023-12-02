import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

const DEBUG = true;

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

import {TypeSelector} from './TypeSelector.ts';
import {InvestmentSelector} from './InvestmentSelector.ts';
import {GeneralFilter}  from './generalFilter';
import {PairingTable} from './table.ts';

import {
  type generalInvestment,
  type generalTypeAndUse,
  primaryInvestmentMap,
  secondaryInvestmentMap,
  typeAndUseMap
} from './selectionStore.ts';

import {
  conflictingGenerals,
  conflictRecords,
} from "./ConflictingSkillExcludes.ts";

import {
  allGenerals,
  generalPairs,
} from './generals.ts';

import {
  GeneralArray,
  type GeneralArrayType,
  GeneralElement,
  type GeneralElementType,
} from "@schemas/generalsSchema.ts"

import {Book, type BookType} from '@schemas/bookSchemas.ts'

import {ConflictArray, type ConflictArrayType} from "@schemas/conflictSchemas.ts";


@customElement('pairing-page')
export class PairingPage extends withStores(SpectrumElement, [allGenerals,generalPairs,conflictingGenerals,conflictRecords,typeAndUseMap,primaryInvestmentMap, secondaryInvestmentMap]) {

  @property({type: String})
  public dataUrl: string = 'http://localhost';

  @state()
  private _dataUrl: URL = new URL(this.dataUrl);

  @property({type: String})
  public conflictData: string = 'http://localhost';

  @state()
  private _conflictData: URL = new URL(this.conflictData);

  constructor() {
    super()

    const stores = [
      allGenerals,
      generalPairs,
      conflictingGenerals,
      conflictRecords,
      typeAndUseMap,
      primaryInvestmentMap,
      secondaryInvestmentMap,
    ]
    for(let ns in stores) {
      stores[ns].subscribe((ms) => {
        if(DEBUG) {console.log(`store ${ns}`)}
      })
    }


  }

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
          } else {
            console.error(`result had no data`)
          }
          return true;
        } else {
          console.error(`validation failed`)
          console.error(result.error)
        }
      })
    }
    if (changedProperties.has('dataUrl')) {
      if (DEBUG) {console.log(`dataUrl changed`) }
      this._dataUrl = new URL(this.dataUrl);

      const result = await fetch(this._dataUrl).then((response) => {
        if (response.ok) {
          return response.text();
        } else throw new Error('Status code error: ' + response.status);
      }).then((text) => {
        const jsonResult = JSON.parse(text);
        if(DEBUG) {console.log(jsonResult)}
        const result: { success: true; data: GeneralArrayType } | { success: false; error: ZodError; } = GeneralArray.safeParse(jsonResult);
        if (result.success) {
          if(result.data !== undefined && result.data !== null) {
            if(DEBUG) {console.log(`setting generals to ${result.data}`)}
            allGenerals.set(result.data);
            return true;
          }
        } else {
          console.error(result.error);
        }
        return false;
      }).catch((error) => {
        console.error(`in the catch with ${error}`)
        return false;
      });
      if (result) {
      }
    }

  }

  private changeHandler(e: CustomEvent) {
    if(DEBUG) {console.log(`${JSON.stringify(e)}`)}
  }

  static styles = css`
    .sp-table-container {
      display: block;
      flex: 2 0 auto;
      min-height: calc(var(--spectrum-global-dimension-size-6000)*2);
      
    }
    .topRow {
      display: flex;
      flex-direction: row;
    }
    .type {
      width: 60%;
    }
    .filter {
      width: 40%;
    }
  `

  public render() {

    return html`
      <div class="sp-table-container">
        <div class="topRow">
          <div class="type"><type-selector role="primary"></type-selector></div>
          <div class="filter"><general-filter></general-filter></div>
        </div>
        <investment-selector generalRole="primary" @PickerChanged=${this.changeHandler} ></investment-selector>
        <investment-selector generalRole="secondary" @PickerChanged=${this.changeHandler}></investment-selector>
        <pairing-table></pairing-table>
      </div>
    `

  }

}