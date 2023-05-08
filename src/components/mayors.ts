import { LitElement, html, css } from "lit";
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
import {DSVRowArray} from "d3-dsv";
import * as dsv from "d3-dsv";

@customElement('compare-mayors')
export default class CompareMayors extends LitElement {

    @property()
    public DataUrl: string;

    private _DataUrl: URL;
    
    @state()
    public ids:string[];

    @state()
    public items: DSVRowArray<string> | undefined;

    @state()
    private records;

    @state()
    private tableName: string;

    @state()
    private table: Table | undefined;

    static styles = css`
      .table-container {
        overflow: auto;
        margin: 0 calc(-1 * var(--spectrum-global-dimension-size-700));
      }

      .table-container sp-table {
        max-height: 400px;
        width: 90vw;
        max-width: 90vw;
        min-width: calc(2 * var(--spectrum-global-dimension-size-3400));
        box-sizing: border-box;
        align-items: stretch;
        padding: 0 var(--spectrum-global-dimension-size-700);
      }

      .table-container sp-table-body,
      .table-container sp-table-head {
        position: relative;
        overflow-y: auto;
        overflow-x: visible;
        min-width: calc(2 * var(--spectrum-global-dimension-size-3400));
        max-width: calc(90vw - var(--spectrum-global-dimension-size-700));
      }

      .table-container #Name {
        min-width: var(--spectrum-global-dimension-size-400);
        max-width: max(var(--spectrum-global-dimension-size-1200), 12%);
        flex: 1.5 1 auto;
      }

      .table-container #Name ~ sp-table-cell {
        font-feature-settings: "tnum";
        max-width: max(var(--spectrum-global-dimension-size-600), 6%);
        flex: 1 1 auto;
      }

      .table-container sp-table-cell {
        min-width: var(--spectrum-global-dimension-size-200);
        width: min-content;
        max-width: max-content;
        font-size: x-small;
      }

      .table-container sp-table-cell,
      .table-container sp-table-head-cell {
        box-sizing: border-box;
        word-break: break-word;
      }


      .table-container sp-table-head {
        /* these have to be the same so that it does not get squished by the body*/
        min-height: var(--spectrum-global-dimension-size-1200);
        max-height: var(--spectrum-global-dimension-size-1200);
      }

      .table-container sp-table-head-cell{
        writing-mode: vertical-rl;
        min-width: var(--spectrum-global-dimension-size-300);
        max-width: max(var(--spectrum-global-dimension-size-300),6%);
        min-height: var(--spectrum-global-dimension-size-400);
        flex: 1 1 auto;
        font-size: x-small;
      }

      @media screen and (max-width: 960px) {
        .table-container {
          overflow: auto;
          margin: 0 -16px;
        }

        .table-container > sp-table {
          padding: 0 16px;
        }

        .table-container sp-table-cell {
          font-size: x-small;
        }
      }
    `

    constructor(props) {
        super(props);

        this.ids = [];

        this.records = [];

    }

    connectedCallback() {
        super.connectedCallback()

        this.tableName = "Table";
    }

    firstUpdated() {
        if(this.renderRoot){
            this.table = this.renderRoot.querySelector('#'+ this.tableName);
            if(this.table){
                console.log(`in firstUpdated, found table ${this.tableName}`);

                this.table.renderItem = (item,index) => {
                    return html
                        `${this.ids.map((id) => {
                            console.log(`in renderItem, id is ${id}`)
                            return html`<sp-table-cell id=${id.replace(' ', '_')} dir='ltr' role='gridcell'>${item[id]}</sp-table-cell>`
                        })}
                        `;
                };

                this.table.addEventListener('sorted', (event) => {
                    const {sortDirection, sortKey} = event.detail;
                    let items = this.table.items.sort((a, b) => {
                        return sortDirection === 'asc' ?
                            a[sortKey].localeCompare(b[sortKey]) :
                            b[sortKey].localeCompare(a[sortKey]);

                    });
                    this.table.items = [...items];
                });

            }
        }
    }

    async willUpdate(changedProperties: PropertyValues<this>) {
        if(changedProperties.has('DataUrl')) {
            this._DataUrl = new URL(this.DataUrl);
            this.tableName = this._DataUrl.pathname;
            if(this.tableName.includes('/')) {
                this.tableName = this.tableName.split('/').pop();
            }
            if(this.tableName.includes('.')){
                this.tableName = this.tableName.split('.').shift();
            }
            const r = await fetch(this._DataUrl).then((response) => {
                if (response.ok) return response.text();
                else throw new Error('Status code error :' + response.status);
            }).then((t) => {
                const r = dsv.csvParse(t);
                const c = r.columns;
                this.ids = JSON.parse(JSON.stringify(c));
                console.log(`items are ${JSON.stringify(r)}`);
                console.log(`ids are "${this.ids}"`);
                this.items =r;
            }).then(() => {
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
            if(this.renderRoot){
                let table:Table|null = this.renderRoot.querySelector('#'+ this.tableName);
                if(table){
                    console.log(`found table`);
                    table.items = this.records;
                } else {
                    console.log(`in changedProperties with no ${this.tableName}`);
                }
            }
        }
    }

    render() {
        return html`
            <div class="table-container">
                <sp-table id=${this.tableName} size="m">
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