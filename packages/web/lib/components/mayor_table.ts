import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {ref, Ref, createRef} from 'lit/directives/ref.js';

import path from 'path';

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

  private tableRef: Ref<HTMLTableElement> = createRef();

  @state()
  private tableRendered: boolean;

  @state()
  private fetchingMayors: boolean;

  @state()
  protected fetchMayorsComplete: boolean

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


  willUpdate(changedProperties: PropertyValues<this>) {
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
    const data = this._items!;
    const columns = this._ids;
    const t = this.tableRef.value;
    if(t === undefined) {
      console.log('cannot find my table ref');
      return;
    }
    let table= d3.select(t).selectAll('sp-table');
    if((table === undefined) || (table.empty())) {
      console.log('div has no sp-table')
      t.append((d3.create('sp-table').node() as Table));
      table= d3.select(t).selectAll('sp-table');
    }

    //first remove old entries
    table.selectAll('sp-table-head').remove();
    table.selectAll('sp-table-body').remove();

    const thead = table.append('sp-table-head')
    const tbody = table.append('sp-table-body')


    table.attr("scroller", true);

    table.classed("mayor-table", true);
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

    table.style("height", "450px")
      .style('overflow-x', "auto")
      .style('overflow-y', "auto")
      .style('scrollbar-gutter', 'stable both-edges')
      .style("max-width", "80vw")
      .style('font-size','var(--spectrum-font-size-75)')

    thead.classed("mayor-row", true)
    thead.style('overflow-x', 'auto')
      .style('overflow-y', 'auto')
      .style("max-width", "80vw")
      .style("flex", '1 1 auto')
      .style('flex-direction', 'row')
      .style('border-radius', 'var(--spectrum-table-regular-border-radius)')
      .style('border-width', 'var(--spectrum-table-regular-border-size)')
      .style('display', 'block')


    tbody.style('overflow-x', 'auto')
      .style("max-width", "80vw")

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
      });

    const rows = tbody.selectAll('sp-table-row')
        .data(data)
        .enter()
        .append('sp-table-row');

    rows.selectAll('sp-table-cell')
      .data(function (row) {
        return columns.map(function (column) {
          return {column: column, value: row[column]}
        })
      })
      .classed("mayor-row", true)
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
        <div id='${this._id}' ${ref(this.tableRef)}>

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

