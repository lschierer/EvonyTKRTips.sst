import { LitElement, html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';

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

import type {DSVRowArray} from "d3-dsv";
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
    private records: Record<string, string>[];

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
        this.DataUrl = 'http://localhost';
        this._DataUrl = new URL(this.DataUrl);
        this.table = null;
        this.tableName = '';
        this.records = [];

    }

    connectedCallback() {
        super.connectedCallback()

        this.tableName = "Table";
    }

    firstUpdated() {
        if(this.renderRoot){
            this.table = this.renderRoot.querySelector('#'+ this.tableName);
            if(this.table !== undefined && this.table !== null){

                this.table.renderItem = (item,index) => {
                    return html
                        `${this.ids.map((id) => {
                            return html`<sp-table-cell id=${id.replace(' ', '_')} dir='ltr' role='gridcell'>${item[id]}</sp-table-cell>`
                        })}
                        `;
                };

                this.table.addEventListener('sorted', (event) => {
                    const {sortDirection, sortKey} = (event as CustomEvent).detail;
                    const items = this.table!.items.sort((a, b) => {
                        return sortDirection === 'asc' ?
                            (a[sortKey] as string).localeCompare((b[sortKey] as string)) :
                            (b[sortKey]as string).localeCompare((a[sortKey] as string));
                    });
                    this.table!.items = [...items];
                });

            }
        }
    }

    async willUpdate(changedProperties: PropertyValues<this>) {
        if(changedProperties.has('DataUrl')) {
            this._DataUrl = new URL(this.DataUrl);
            this.tableName = this._DataUrl.pathname;
            if(this.tableName.includes('/')) {
                const rtn = this.tableName.split('/').pop();
                if(rtn !== undefined) {
                    this.tableName = rtn;
                }
            }
            if(this.tableName.includes('.')){
                const rtn = this.tableName.split('.').shift();
                if(rtn !== undefined) {
                    this.tableName = rtn;
                }
            }
            const r = await fetch(this._DataUrl).then((response) => {
                if (response.ok) return response.text();
                else throw new Error('Status code error :' + response.status);
            }).then((t) => {
                const r = dsv.csvParse(t);
                const c = r.columns;
                this.ids = JSON.parse(JSON.stringify(c));
                this.items =r;
            }).then(() => {
                for(let i = 0; i < this.items!.length; i ++) {
                    const row:dsv.DSVRowString<string> = this.items![i];
                    const nR = { "row": row }
                    this.records.push(nR.row);
                }
                return true;
            }).catch((error) => {
                return false;
            });
            if(this.renderRoot){
                const table:Table|null = this.renderRoot.querySelector('#'+ this.tableName);
                if(table){
                    table.items = this.records;
                } else {
                }
            }
        }
    }

    render() {
        return html`
            <div class="table-container">
                <sp-table id=${this.tableName} size="m" scroller="true">
                    <sp-table-head>
                        ${this.ids.map((id)=> {
                            return html`<sp-table-head-cell value=${id.replace(/ /g, '_')} sortable sort-direction="desc" sort-key=${id} >${id}</sp-table-head-cell>`;
                        })}
                    </sp-table-head>
                    
                </sp-table>
            </div>
        `
    }

}