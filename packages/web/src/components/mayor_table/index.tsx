import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {ref, Ref, createRef} from 'lit/directives/ref.js';

import * as dsv from "d3-dsv";
import type {DSVRowArray} from "d3-dsv";
import * as d3 from 'd3';

import "@spectrum-web-components/table/elements.js";
import {
  Table

} from "@spectrum-web-components/table";
import { PropertyValues } from "lit/development";

@customElement("mayor-table")
export class MayorTable extends Table {

  // @ts-ignore
  @property({type: String, reflect: true})
  public CsvName: string;

  @state()
  private CsvUrl: string;

  @state()
  protected _ids: string[];

  @state()
  private _items: DSVRowArray<string> | undefined;

  @state()
  private _tableTemplate;

  private tableRef: Ref<HTMLTableElement> = createRef();

  @state()
  private tableRendered: Boolean;

  @state()
  private fetchingMayors: Boolean;

  @state()
  protected fetchMayorsComplete: Boolean

  constructor() {
    super();
    this.CsvName = "";
    this.CsvUrl = "";
    this._ids = [];
    this.tableRendered = false;
    this.fetchingMayors = false;
    this.fetchMayorsComplete = false;
  }


  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('CsvName')) {
      console.log(`detected Name change, new value: ${this.CsvName}`);
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
      console.log('already done')
      return;
    } else{
      this.fetchingMayors = true;
      fetch(this.CsvUrl)
          .then((response) => response.text())
          .then((t) => {
            let r = dsv.csvParse(t);
            let c = r.columns;
            this._ids = JSON.parse(JSON.stringify(c));
            console.log(`items are ${JSON.stringify(r)}`);
            console.log(`ids are ${this._ids}`);
            this._items = r;
          }).then(() =>{
            this.fetchMayorsComplete = true;
            return true;
          });
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
    const data = this._items!;
    const columns = this._ids;
    let t = this.tableRef.value;
    if(t === undefined) {
      console.log('cannot find my table ref');
      return;
    }
    let table= d3.select(t!).selectAll('sp-table');
    if((table === undefined) || (table.empty())) {
      console.log('div has no sp-table')
      t.append((d3.create('sp-table').node() as Table));
      table= d3.select(t!).selectAll('sp-table');
    }

    //first remove old entries
    table.selectAll('sp-table-head').remove();
    table.selectAll('sp-table-body').remove();

    let thead = table.append('sp-table-head')
    let tbody = table.append('sp-table-body')

    table.style("flex", "1 1 auto");
    table.style("max-width", "100%");
    table.on('sorted',(event) =>{
      console.log('called sort event');
      const { sortDirection, sortKey } = event.detail;
      if (sortDirection === 'asc') {
        this._items = data.sort((a,b) => d3.ascending(a[sortKey], b[sortKey]));
      } else {
        this._items = data.sort((a,b) => d3.descending(a[sortKey], b[sortKey]));
      }
      this.initTable();
      this.requestUpdate();
    })

    thead.style("flex", "1 1 auto ");
    thead.style("max-width", "100%");


    thead.selectAll('sp-table-head-cell')
        .data(columns)
        .enter()
        .append('sp-table-head-cell')

        .text(function (d) {
          return d
        })
        .attr("sortable", true)
        .attr("sort-key", function(d){
          return d.replace(/\W/g, '');
        })

    let rows = tbody.selectAll('sp-table-row')
        .data(data)
        .enter()
        .append('sp-table-row')

    rows.selectAll('sp-table-cell')
        .data(function (row) {
          return columns.map(function (column) {
            return {column: column, value: row[column]}
          })
        })
        .enter()
        .append('sp-table-cell')
        .text(function (d) {
          if (d.value === undefined) {
            return "";
          } else {
            return d.value;
          }
        })
    console.log('ready to return table from initTable');
    this.tableRendered = true;
    console.log(`table is ${table}`);

  }

  render() {

    if(this.tableRendered) {
      console.log('render thinks the table rendered');
      return html`
        <div ${ref(this.tableRef)}>
          
        </div>
      `;
    } else {
      return html`
        <div ${ref(this.tableRef)}>Loading....</div>
      `
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mayor-table": MayorTable;
  }
}


// vi: sw=2:ts=2:expandtab:

