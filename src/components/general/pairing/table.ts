import {  html, css, type PropertyValues, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

const DEBUG = true;
import { withStores } from "@nanostores/lit";

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
import '@spectrum-web-components/status-light/sp-status-light.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import {InterestSelector} from '../InterestSelector.ts';
import {InvestmentSelector} from '../InvestmentSelector.ts';

import { PairingRow } from "./row.ts";

import {
  type generalInvestment,
  type generalTypeAndUse,
  primaryInvestmentMap,
  secondaryInvestmentMap,
  typeAndUseMap
} from '../generalInvestmentStore.ts';

import { type GeneralPairType } from '@schemas/generalsSchema.ts';

import { generalPairs} from './generals.ts'

@customElement('pairing-table')
export class PairingTable extends withStores(SpectrumElement, [generalPairs, typeAndUseMap,primaryInvestmentMap, secondaryInvestmentMap]) {

  @state()
  private items: Record<string,GeneralPairType>[] = new Array<Record<string,GeneralPairType>>();

  @state()
  private table: Table | undefined;

  private tableRef: Ref<Table> = createRef();

  private rowMapper(pair: GeneralPairType, index: string) {
        
    const newRecord: Record<string,GeneralPairType> = {index: pair}
    this.items.push(newRecord);
  }

  constructor() {
    super();

    generalPairs.subscribe(gp => {
      gp.forEach((primary,index) => {
        console.log(`general pairs subscribe`)
        primary.forEach((pair,index2) => {
          const label=`${index}.${index2}`
          console.log(` label is ${label}\n`)
          this.rowMapper(pair, label)
        })
      })
    })
  }
  
  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties);
    if(this.renderRoot) {
      this.table = this.tableRef.value;
      if(this.table !== undefined && this.table !== null) {
        this.table.renderItem = (item, index) => {
          const one = item['primary' as keyof typeof item]; 
          const two = item['secondary' as keyof typeof item];
          const row = new PairingRow;
          console.log(`one is ${ JSON.stringify(one)}`)
          row.setAttribute('one', JSON.stringify(one));
          return html`
            ${row.render1()}
          `
        }
      }
    }
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(_changedProperties);

    if(this.renderRoot){
      if(this.table !== null && this.table !== undefined) {
        if(this.items !== null && this.items.length >= 1) {
          this.table.items = this.items;
          this.table.requestUpdate();
        }
      }
    }
  }

  static styles = css`
     sp-table {
        background-color: var(--spectrum-cyan-600);
                        
        & #primeName {
          flex-grow: 3;
        }
        
        & #assistName {
          flex-grow: 3;
        }

        & sp-table-body {
          min-height: var(--spectrum-global-dimension-size-900);
        }
      }
    
    
  `

  render(){
    return html`
    
    <sp-table size="m" style="height: calc(var(--spectrum-global-dimension-size-3600)*2)"scroller="true" ${ref(this.tableRef)}>
            <sp-table-head>
                <sp-table-head-cell id='primeName' sortable sort-direction="desc" sort-key="primeName">
                    Primary General
                </sp-table-head-cell>
                <sp-table-head-cell id='assistName' sortable sort-direction="desc" sort-key="assistName">
                    Secondary General
                </sp-table-head-cell>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="attackBuff">
                    Attack Buff
                </sp-table-head-cell>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="HPBuff">
                    HP Buff
                </sp-table-head-cell>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="defenseBuff">
                    Defense Buff
                </sp-table-head-cell>
            </sp-table-head>
        </sp-table>
    `
  }

}