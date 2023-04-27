import { html,  } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {ref, Ref, createRef} from 'lit/directives/ref.js';

import path from 'path';

import * as dsv from "d3-dsv";
import type {DSVRowArray} from "d3-dsv";
import * as d3 from 'd3';

import '@spectrum-web-components/table/sp-table-body.js';
import '@spectrum-web-components/table/sp-table-cell.js';
import '@spectrum-web-components/table/sp-table-checkbox-cell.js';
import '@spectrum-web-components/table/sp-table-head.js';
import '@spectrum-web-components/table/sp-table-head-cell.js';
import '@spectrum-web-components/table/sp-table-row.js';
import * as Table from "@spectrum-web-components/table";
import { PropertyValues } from "lit/development";

@customElement("sp-table")
export class MayorTable extends Table.Table {

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
  private tableRendered: boolean;

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
    this.tableRendered = false;
    this.fetchingMayors = false;
    this.fetchMayorsComplete = false;
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);
    if (changedProperties.has('CsvName')) {
      console.log(`detected Name change, new value: ${this.CsvName}`);
      const re = /\.\w{3}$/;
      this._id = this.CsvName.replace(re,'');
      let f = "../../public/CSVs/".concat(this.CsvName);
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
        console.log(`ids are ${this._ids}`);
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
      let tc:Table.TableCell[] = [];
      for(let i = 0; i < this._ids.length; i++) {
        const cell = document.createElement('sp-table-cell');
        let content:string = '';
        if (!a[this._ids[i]]) {
          content = '';
        } else {
          content = a[this._ids[i]]!;
        }
        cell.textContent = content;
        tc.push(cell);
      }
      return html`${tc}`;
    }

    console.log('ready to return table from initTable');

  }



  protected override manageCheckboxes(): void {
    return;
  }

  override render() {
    return html`
      <sp-table-head>
        ${this._ids.map((id) =>
          html`
            <sp-table-head-cell sortable sort-direction="desc" sort-key="${id.replace(/ /g,"")} ">
              ${id}
            </sp-table-head-cell>
          `
        )}
        </sp-table-head>
        ${super.render()}
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "sp-table": MayorTable;
  }
}


// vi: sw=2:ts=2:expandtab:

