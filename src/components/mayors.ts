import { LitElement, html, css, type PropertyValues } from "lit";
import {customElement, property, state} from 'lit/decorators.js';

import type { APIContext } from 'astro';

import type {
    Table,
    TableBody,
    TableCell,
    TableCheckboxCell,
    TableHead,
    TableHeadCell,
    TableRow
} from '@spectrum-web-components/table';
import { type DSVRowArray } from 'd3-dsv';
import * as dsv from "d3-dsv";

@customElement('compare-mayors')
export class CompareMayors extends LitElement {

    @property()
    public DataUrl: string;

    private _DataUrl: URL;

    @state()
    public ids:string[];

    @state()
    public items: DSVRowArray<string> | undefined;

    @state()
    private records:dsv.DSVRowString<string>[];

    @state()
    private tableName: string;

    @state()
    private table: Table | null;

    static styles = css`
      .table-container {
        overflow: auto;
        min-height: var(--spectrum-global-dimension-size-400);
        max-height: calc(var(--spectrum-global-dimension-size-6000)*2);
        flex: 1 1 auto;
        /*margin: 0 calc(-1 * var(--spectrum-global-dimension-size-600));*/
      }

      .table-container sp-table {
        height: var(--spectrum-global-dimension-size-5000);
        width: 85vw;
        max-width: 99%;
        flex: 1 1 auto;
        /*min-width: calc(2 * var(--spectrum-global-dimension-size-3400));*/
        box-sizing: content-box;
        align-items: stretch;
        /*padding: 0 var(--spectrum-global-dimension-size-700);*/
      }

      .table-container sp-table-body,
      .table-container sp-table-head {
        position: relative;
        overflow-y: auto;
        overflow-x: visible;
        /*min-width: calc(2 * var(--spectrum-global-dimension-size-3400));*/
        /*max-width: calc(90vw - var(--spectrum-global-dimension-size-600));*/
        width: 100%;
      }

      .table-container #Name {
        width: clamp(var(--spectrum-global-dimension-size-400), var(--spectrum-global-dimension-size-1200), 12%);
        flex: 1.5 1 auto;
      }

      .table-container #Name ~ sp-table-cell {
        font-feature-settings: "tnum";
        width: clamp(var(--spectrum-global-dimension-size-100), var(--spectrum-global-dimension-size-300), 6%);
        flex: 1 1 auto;
      }

      .table-container sp-table-cell {
        min-width: var(--spectrum-global-dimension-size-200);
        font-size: small;
      }

      .table-container sp-table-cell,
      .table-container sp-table-head-cell {
        box-sizing: border-box;
        word-break: break-word;
      }


      .table-container sp-table-head {
        /* these have to be the same so that it does not get squished by the body*/
        height: clamp(var(--spectrum-global-dimension-size-1200),var(--spectrum-global-dimension-size-1600),var(--spectrum-global-dimension-size-1700));
        
      }
      
      .table-container sp-table-head :first-child {
        width: clamp(var(--spectrum-global-dimension-size-400), var(--spectrum-global-dimension-size-1200), 12%);
      }

      .table-container sp-table-head-cell{
        writing-mode: vertical-rl;
        width: clamp(var(--spectrum-global-dimension-size-300),var(--spectrum-global-dimension-size-300),6%);
        min-height: var(--spectrum-global-dimension-size-400);
        flex: 1 1 auto;
        font-size: small;
      }

      @media screen and (max-width: 960px) {
        .table-container {
          overflow: auto;
          margin: 0 -16px;
        }

        .table-container > sp-table {
          padding: 0 16px;
        }

        .table-container sp-table-cell,
        .table-container sp-table-head-cell {
          font-size: x-small;
        }
      }
    `

    constructor() {
        super();

        this.ids = [];

        this.records = new Array<dsv.DSVRowString<string>>();

        this.DataUrl = '';
        this._DataUrl = new URL('/', 'http://localhost');
        this.table = null;
        this.tableName = '';

    }

    connectedCallback() {
        super.connectedCallback()

    }

    firstUpdated() {
        if(this.renderRoot && (this.tableName.length > 0)){
            this.table = this.renderRoot.querySelector('#'+ this.tableName);
            if(this.table){
                console.log(`in firstUpdated, found table ${this.tableName}`);

                this.table.addEventListener('sorted', (event) => {
                    const {sortDirection, sortKey} = (event as CustomEvent).detail;
                    if(this.table) {
                        let items = this.table.items.sort((a, b) => {
                            const itemA: string = (a[sortKey] as string);
                            const itemB:string  = (b[sortKey] as string);
                            return sortDirection === 'asc' ?
                              itemA.localeCompare(itemB) :
                              itemB.localeCompare(itemA);
                        });
                        this.table.items = [...items];
                    }

                });

            }
        }
    }

    async willUpdate(changedProperties: PropertyValues<this>) {
        if(changedProperties.has('DataUrl')) {
            console.log(`willUpdate; changedProperties has DataUrl`)
            this._DataUrl = new URL(this.DataUrl);
            let tempTableName = this._DataUrl.pathname;
            console.log(`tempTableName currently ${tempTableName}`)
            if(tempTableName.includes('/')) {
                const tableParts = tempTableName.split('/');
                const name = tableParts.pop();
                tempTableName = (typeof name !== 'undefined') ? name : tempTableName;
            }
            console.log(`tempTableName currently ${tempTableName}`)
            
            if(tempTableName.includes('.')){
                const tableParts = tempTableName.split('.');
                const name = tableParts.shift();
                tempTableName = (typeof name !== 'undefined') ? name : tempTableName;
            }
            console.log(`tempTableName currently ${tempTableName}`)
            
            if((!tempTableName.localeCompare(this.tableName)) || (tempTableName.length > 0 && this.tableName.length === 0)) {
                console.log(`setting table name to ${tempTableName}`)
                this.tableName = tempTableName;
            } else {
                console.log(`table name already set: ${this.tableName}`)
            }
            const r = await fetch(this._DataUrl)
              .then((response) => {
                  console.log(`first then`);
                  if (response.ok) return response.text();
                  else throw new Error('Status code error :' + response.status);
            }).then((t) => {
                  console.log(`second then`);
                const r = dsv.csvParse(t);
                const c = r.columns;
                this.ids = JSON.parse(JSON.stringify(c));
                console.log(`items are ${JSON.stringify(r)}`);
                console.log(`ids are "${this.ids}"`);
                this.items =r;
            }).then(() => {
                  console.log(`third then`);
                  for(let i = 0; i < this.items!.length; i ++) {
                      let row:dsv.DSVRowString<string> = this.items![i];
                      let nR = { "row": row }
                      console.log(`pushing item ${i} row is ${JSON.stringify(nR)}`);
                      this.records.push(nR.row);
                  }
                  return true;
            }).catch((error) => {
                console.log(error);
                return false;
            });
            if(this.renderRoot && (this.tableName.length > 0)){
                console.log(`renderRoot set with tableName: ${this.tableName}`)
                this.table = this.renderRoot.querySelector('#'+ this.tableName);
                if(this.table){
                    console.log(`found table`);
                    console.log(`I have ${this.table.items.length} items`);
                    this.table.renderItem = (item,index) => {
                        console.log(`in table's renderItem ${item.toString()}`)
                        return html`
                            ${this.ids.map((id) => {
                              console.log(`in renderItem, id is ${id}`)
                              return html`
                                  <sp-table-cell id=${id.replace(' ', '_')} dir='ltr' role='gridcell'>
                                      ${item[id]}
                                  </sp-table-cell>
                              `
                          })}
                        `;
                    };

                    this.table.items = this.records;
                    this.requestUpdate();
                } else {
                    console.log(`in changedProperties with no ${this.tableName}`);
                }
            } else {
                if(this.tableName.length <= 0) {
                    console.log(`no table name set`)
                }
            }
        }
    }

    render() {
        return html`
            <div class="table-container">
                <sp-table id=${this.tableName} scroller="true">
                    <sp-table-head>
                        ${this.ids.map((id)=> {
                            console.log(`id is ${id}`)
                            return html`<sp-table-head-cell value=${id.replace(/ /g, '_')} sortable sort-direction="desc" sort-key=${id} >${id}</sp-table-head-cell>`;
                        })}
                    </sp-table-head>
                    
                </sp-table>
            </div>
        `
    }

}
