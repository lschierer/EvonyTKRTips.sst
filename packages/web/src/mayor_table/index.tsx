import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {ref, createRef} from 'lit/directives/ref.js';

import * as dsv from "d3-dsv";

import "@spectrum-web-components/table/elements.js";
import {
  Table, TableCell

} from "@spectrum-web-components/table";
import { PropertyValues } from "lit/development";

@customElement("mayor-table")
export class MayorTable extends Table {

  // @ts-ignore
  @property({ type: String, reflect: true })
  public CsvName: string;

  @state()
  private CsvUrl: string;

  @state()
  protected _headings: string[];

  @state()
  protected _ids: string[];

  @state()
  private _items;

  private tableRef= createRef();

  constructor() {
    super();
    this.CsvName = "";
    this.CsvUrl = "";
    this._items = [];
    this._ids = [];

    this._headings = [
      "Name",
      "Availability",
      "Maxed Out Rank",
      "Maxed Out Grade",
      "Maxed Out # Grade",
      "Maxed Out Score",
      "4 Yellows Rank",
      "4 Yellows Grade",
      "4 Yellows # Grade",
      "4 Yellows Score",
      "3 Orange Rank",
      "3 Orange Grade",
      "3 Orange # Grade",
      "3 Orange Score",
      "3 Purple Rank",
      "3 Purple Grade",
      "3 Purple # Grade",
      "3 Purple Score"
    ];

  }


  async willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('CsvName')) {
      console.log(`detected Name change, new value: ${this.CsvName}`);
      let f = "../../public/CSVs/".concat(this.CsvName);
      this.CsvUrl = new URL(f, import.meta.url).href;
      console.log(`URL is ${this.CsvUrl}`);
      this.getMayors();
    }
  }


  protected async getMayors() {
    fetch(this.CsvUrl)
      .then((response) => response.text())
      .then((t) => {
        let r = dsv.csvParse(t);
        let c = r.columns;
        this._ids = JSON.parse(JSON.stringify(c));
        console.log(`items are ${JSON.stringify(r)}`);
        console.log(`ids are ${this._ids}`);
        this._items = r;
      })
  }


  private initTable(element: Element | undefined) {
    console.log(`init table called, we have ${this._items.length} rows`);
    const t = (element! as Table);
    t.items = this._items;
    t.renderItem = (item, index) => {
      let cells = [];
      for (let i = 0; i < this._ids.length; i++) {
        let cell = document.createElement("sp-table-cell");
        cell.textContent = `$this._items[i].${this._ids[i]}`;
        console.log(`created context ${cell.textContent}`);
        cells.push(cell);
      }
      return cells;
    };
  }

  render() {
    const headerTemplates = [];
    for (let i = 0; i < this._headings.length; i++) {
      headerTemplates.push(html`
        <sp-table-head-cell>${this._headings[i]}</sp-table-head-cell>`);
    }

    return html`
      <sp-table scroller="true" size="l" ${ref(this.initTable)}>
        <sp-table-head>
          ${headerTemplates}
        </sp-table-head>
        <sp-table-body>

        </sp-table-body>
      </sp-table>
    `;
  }


}

declare global {
  interface HTMLElementTagNameMap {
    "mayor-table": MayorTable;
  }
}


// vi: sw=2:ts=2:expandtab:

