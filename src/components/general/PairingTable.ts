import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

import {z,  type ZodError} from 'zod';

import { SpectrumElement } from '@spectrum-web-components/base';

import type {
  Table,
  TableBody,
  TableCell,
  TableCheckboxCell,
  TableHead,
  TableHeadCell,
  TableRow
} from '@spectrum-web-components/table';
import '@spectrum-web-components/table/elements.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import {
  BuffAdverbs,
  type BuffAdverbsType,
  type BuffAdverbArrayType,
  generalSchema,
  type General,
  generalObjectSchema,
  generalUseCase,
  type generalUseCaseType,
  type generalObject,
  levelSchema,
  type levelSchemaType,
  qualitySchema,
  type qualitySchemaType,
  troopClass,
  type troopClassType,
} from "@schemas/evonySchemas.ts";

const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

@customElement('pairing-table')
export class PairingTable extends SpectrumElement {
  @property({type: String})
  public dataUrl: string;
  
  @state()
  private _dataUrl: URL;
  
  @state()
  private allGenerals: generalArrayType;
  
  constructor() {
    super();
    
    this.dataUrl = 'http://localhost';
    this._dataUrl = new URL(this.dataUrl)
    this.generalRecords = new Array<Record<string,tableGeneralType>>();
    
  }
  
  private MutationObserverCallback = (mutationList: MutationRecord[] , observer: MutationObserver) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
      } else if (mutation.type === "attributes") {
        console.log(`The ${mutation.attributeName} attribute was modified.`);
      }
    }
  };
  
  private observer = new MutationObserver(this.MutationObserverCallback);
  
  connectedCallback() {
    super.connectedCallback();
    
  }
  
  async willUpdate(changedProperties: PropertyValues<this>) {
    console.log(`willUpdate; start`);
    if (changedProperties.has('dataUrl')) {
      console.log(`setting dataUrl`)
      this._dataUrl = new URL(this.dataUrl);
      
      const result = await fetch(this._dataUrl).then((response) => {
        if (response.ok) {
          console.log(`response ok`)
          return response.text();
        } else throw new Error('Status code error: ' + response.status);
      }).then((text) => {
        const jsonResult = JSON.parse(text);
        console.log(JSON.stringify(jsonResult))
        const result: { success: true; data: generalArrayType; } | { success: false; error: ZodError; } = generalArray.safeParse(jsonResult);
        if (result.success) {
          console.log(`result success`)
          this.allGenerals = result.data;
          return true;
        } else {
          console.log(`zod failed validation`);
          result.error;
        }
        return false;
      }).catch((error) => {
        console.log(error)
        return false;
      });
      if (result) {
        console.log(`successful fetch`);
      }
    }
    /*if (this.allGenerals !== undefined && this.allGenerals !== null) {
      console.log(`willUpdate; I have generals`);
      if (this.table !== undefined && this.table !== null) {
        console.log(`willUpdate; I have a table`);
        if (this.table.items !== undefined && this.table.items !== null && this.table.items.length === 0) {
          console.log(`willUpdate; I need records`);
          this.processGenerals();
          
        }
      }
    }*/
  }
  
  private processGenerals() {
  
  }
  
}



