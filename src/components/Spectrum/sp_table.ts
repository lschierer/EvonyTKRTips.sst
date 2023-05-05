import { html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {ref, Ref, createRef} from 'lit/directives/ref.js';
import {styleMap} from 'lit/directives/style-map.js';
import type { PropertyValues } from "lit/development";

import * as dsv from "d3-dsv";
import type {DSVRowArray} from "d3-dsv";
import * as d3 from 'd3';

import '@spectrum-web-components/table/sp-table-body.js';
import '@spectrum-web-components/table/sp-table-cell.js';
import '@spectrum-web-components/table/sp-table-checkbox-cell.js';
import '@spectrum-web-components/table/sp-table-head.js';
import '@spectrum-web-components/table/sp-table-head-cell.js';
import '@spectrum-web-components/table/sp-table-row.js';
import { Table } from '@spectrum-web-components/table';
import type {
  TableBody,
  TableCell,
  TableCheckboxCell,
  TableHead,
  TableHeadCell,
  TableRow
} from '@spectrum-web-components/table';
import { SpectrumElement } from '@spectrum-web-components/base';

@customElement("sp-table")
export class MayorTable extends Table {

  @property({type: String, reflect: true, attribute: "csv"})
  public CsvName: string;

  @state()
  protected _id: string;

  @state()
  private CsvUrl: string;

  @state()
  protected _ids: string[];

  @state()
  private _items: DSVRowArray<string> | undefined;

  @state()
  private fetchingMayors: boolean;

  @state()
  protected fetchMayorsComplete: boolean;

  constructor() {
    super();
    this._id = "";
    this.CsvName = "";
    this.CsvUrl = "";
    this._ids = [];
    this.fetchingMayors = false;
    this.fetchMayorsComplete = false;
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    if (changedProperties.has('CsvName')) {
      console.log(`detected Name change, new value: ${this.CsvName}`);
      const re = /\.\w{3}$/;
      this._id = this.CsvName.replace(re,'');
      let f = "../../../public/CSVs/".concat(this.CsvName);
      f = f.replace(/public\//,'');
      this.CsvUrl = new URL(f, import.meta.url).href;
      console.log(`URL is ${this.CsvUrl}`);

    }
    this.initTable();
  }

  protected async getMayors() {
    console.log('fetching mayors');
    if (this.fetchingMayors) {
      console.log('already done');
      return;
    } else {
      this.fetchingMayors = true;
      fetch(this.CsvUrl)
        .then((response) => {
          if (response.ok) return response.text();
          else throw new Error('Status code error :' + response.status);
        }).then((t) => {
        const r = dsv.csvParse(t);
        const c = r.columns;
        this._ids = JSON.parse(JSON.stringify(c));
        console.log(`items are ${JSON.stringify(r)}`);
        console.log(`ids are "${this._ids}"`);
        this._items = r;
      }).then(() => {
        for(let i = 0; i < this._items!.length; i ++) {
          let row:dsv.DSVRowString<string> = this._items![i];
          let nR:Record<string,dsv.DSVRowString<string>> = { "row": row }
          console.log(`pushing item ${i} row is ${JSON.stringify(nR)}`);
          super.items.push(nR);
        }
        this.fetchMayorsComplete = true;
        return true;
      }).catch((error) => console.log(error));
    }
  }
  private async initTable() {
    console.log('in the initTable function');

    if((!this.fetchingMayors) && (this._ids.length === 0)){
      console.log('calling getMayors from initTable')
      await this.getMayors();
    }
    if (this._ids.length === 0) {
      console.log('second check, still 0');
      return ;
    }

    console.log(`ids now at length ${this._ids.length}`)

    super.renderItem = (item:Record<string, unknown>, index) => {
      let a:dsv.DSVRowString<string> = (item.row as dsv.DSVRowString<string>);
      let tc:TableCell[] = [];
      for(let i = 0; i < this._ids.length; i++) {

        let content:string = '';
        if (!a[this._ids[i]]) {
          content = '';
        } else {
          content = a[this._ids[i]]!;
        }
        const cell = html`<sp-table-cell style='text-align: center; box-sizing: content-box;'>${content}</sp-table-cell>`;

        tc.push(cell);
      }
      return html`${tc}`;
    }

    super.addEventListener('sorted', (event) => {
      const { sortDirection, sortKey } = (event as CustomEvent).detail;
      let items: dsv.DSVRowString<string>[] = [];
      if (sortDirection === 'asc') {
        items = this._items!.slice()
          .sort((a, b) => {
            return d3.ascending(a[this._ids[sortKey]], b[this._ids[sortKey]]);
          });
      } else {
        items = this._items!.slice()
          .sort((a, b) => {
            return d3.descending(a[this._ids[sortKey]], b[this._ids[sortKey]]);
          });
      }
      super.items = [...items];
    });

    console.log('ready to return table from initTable');

  }

  protected override manageCheckboxes(): void {

  }

  override render() {
    return html`
      
      <sp-table-head >
        <style>
          sp-table-head-cell {
            
            writing-mode: vertical-lr;
          }
          sp-table-head {
            box-sizing: content-box;
            flex: 0 1 auto;
            background-color: var(--spectrum-green-800);
            --spectrum-table-regular-header-padding-left: var(--spectrum-global-dimension-static-size-10);
            --spectrum-table-regular-header-padding-right: var(--spectrum-global-dimension-static-size-10);
            --spectrum-table-compact-header-padding-left: var(--spectrum-global-dimension-static-size-10);
            --spectrum-table-compact-header-padding-right: var(--spectrum-global-dimension-static-size-10);
            --spectrum-table-compact-header-border-radius: var(--my-small-size, 1px);
            --spectrum-table-regular-header-border-radius: var(--my-small-size, 1px);

          }
        </style>
        ${this._ids.map((id) =>
          html`
            <sp-table-head-cell sortable sort-direction="desc" sort-key="${id}" >
              ${id}
            </sp-table-head-cell>
          `
        )}
        </sp-table-head>
        <slot @change=${super.handleChange}></slot>
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "sp-table": MayorTable;
  }
}


// vi: sw=2:ts=2:expandtab:

