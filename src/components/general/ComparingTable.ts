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

import {
  generalSchema,
  type General,
  generalObjectSchema,
  type generalObject,
} from "@schemas/evonySchemas.ts";

const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

const tableGeneral = z.object({
  name: z.string(),
  attack: z.number(),
})
type tableGeneralType = z.infer<typeof tableGeneral>;

type generalRecord = Record<string, tableGeneralType>;

@customElement('comparing-table')
export class ComparingTable extends SpectrumElement {
  
  private tableRef: Ref<Table> = createRef();
  
  @property({type: String})
  public dataUrl: string;
  
  @state()
  private _dataUrl: URL;
  
  @state()
  private allGenerals: generalArrayType;
  
  @state()
  private generalRecords: generalRecord[]
  
  @state()
  private table: Table | undefined;
  
  constructor() {
    super();
    
    this.dataUrl = 'http://localhost';
    this._dataUrl = new URL(this.dataUrl)
    this.generalRecords = new Array<Record<string,General>>();
    
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
  
  firstUpdated() {
    if (this.renderRoot) {
      this.table = this.tableRef.value
      if (this.table !== undefined && this.table !== null) {
        console.log(`firstUpdated; found table`)
        
        this.table.renderItem = (item, index) => {
          const general: General = (item['general'] as General);
          console.log(`renderItem; ${general.name}`)
          return html`
              <sp-table-cell id='name' dir='ltr' role='gridcell' >${general.name}
              </sp-table-cell>
              <sp-table-cell id='attack' dir='ltr' role='gridcell'>${general.attack}
              </sp-table-cell>
          `;
        };
        
        this.table.addEventListener('sorted', (event) => {
          const {sortDirection, sortKey} = (event as CustomEvent).detail;
          let items = (this.table!.items as generalRecord[]).sort((a, b) => {
            const ga: General = (a['general'] as General);
            const gb: General = (b['general'] as General);
            switch (sortKey) {
              case 'attack':
                if(ga.attack === gb.attack) {
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                    (ga.attack < gb.attack ? -1 : 1) :
                    (ga.attack < gb.attack ? 1 : -1);
                }
              case 'name':
                return (sortDirection === 'asc') ?
                  (ga.name.localeCompare(gb.name,undefined,{sensitivity: "base"})) :
                  (gb.name.localeCompare(ga.name,undefined,{sensitivity: "base"}));
              default:
                return 0;
            }
            return 0;
          });
          this.table!.items = [...items];
        });
      }
    }
  }
  
  async willUpdate(changedProperties: PropertyValues<this>) {
    console.log(`willUpdate; start`);
    if(changedProperties.has('dataUrl')) {
      console.log(`setting dataUrl`)
      this._dataUrl = new URL(this.dataUrl);
      
      const result = await fetch(this._dataUrl).then((response) => {
        if (response.ok) {
          console.log(`response ok`)
          return response.text();
        }
        else throw new Error('Status code error: ' + response.status);
      }).then((text) => {
        const jsonResult = JSON.parse(text);
        console.log(JSON.stringify(jsonResult))
        const result: { success: true; data: generalArrayType; } | { success: false; error: ZodError; } = generalArray.safeParse(jsonResult);
        if(result.success) {
          console.log(`result success`)
          this.allGenerals = result.data;
          return true;
        }else {
          console.log(`zod failed validation`);
          result.error;
        }
        return false;
      }).catch((error) =>{
        console.log(error)
        return false;
      });
      if(result){
        console.log(`successful fetch`);
      }
    }
    if(this.allGenerals !== undefined && this.allGenerals !== null) {
      console.log(`willUpdate; I have generals`);
      if(this.table !== undefined && this.table !== null) {
        console.log(`willUpdate; I have a table`);
        if(this.table.items !== undefined && this.table.items !== null && this.table.items.length === 0) {
          console.log(`willUpdate; I need records`);
          this.processGenerals();
        }
      }
    }
  }
  
  private processGenerals() {
    if(this.allGenerals !== undefined && this.allGenerals !== null && this.allGenerals.length > 0) {
      if(this.table !== undefined && this.table !== null) {
        this.allGenerals.forEach((g) => {
          const valid = generalObjectSchema.safeParse(g);
          if(valid.success) {
            console.log(`pushing ${JSON.stringify(valid.data.general.name)}`)
            const go: generalObject = valid.data;
            const name = go.general.name;
            const attack = go.general.attack;
            this.table!.items.push({'general': {name: name, attack: attack}});
            this.table!.requestUpdate();
          }
        })
        this.generalRecords = (this.table.items as generalRecord[]);
      }
    }
  }
  
  
  
  static styles = css`
    .sp-table-container {
      & sp-table {
        background-color: var(--spectrum-indigo-400);
        min-height: var(--spectrum-global-dimension-size-300);
        
        & sp-table-body {
          min-height: var(--spectrum-global-dimension-size-200);
        }
      }
    }
  `
  
  public render() {
    return html`
        <div class="sp-table-container">
            <sp-table size="m" scroller="true" ${ref(this.tableRef)} >
                <sp-table-head>
                    <sp-table-head-cell sortable sort-direction="desc" sort-key="name">
                        Name
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable sort-direction="desc" sort-key="attack">
                        Attack
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable sort-direction="desc" sort-key="attackBuff">
                        Attack Buff
                    </sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        </div>
        `;
  }
}
