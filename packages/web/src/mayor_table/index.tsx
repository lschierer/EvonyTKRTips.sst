import { html} from 'lit';
import {customElement, property,  state} from 'lit/decorators.js';

import {csv} from 'd3';

import '@spectrum-web-components/table/elements.js';
import {
    Table,

} from '@spectrum-web-components/table';

export interface Mayor {
    name: string|undefined,
    free: string|undefined,
    mrank: string|undefined,
    mgrade: string|undefined,
    mps: string|undefined,
    mns: string|undefined,
    yrank: string|undefined,
    ygrade: string|undefined,
    yps: string|undefined,
    yns: string|undefined,
    orank: string|undefined,
    ograde: string|undefined,
    ops: string|undefined,
    ons: string|undefined,
    prank: string|undefined,
    pgrade: string|undefined,
    pps: string|undefined,
    pns: string|undefined,
  }

// @ts-ignore
@customElement('sp-table')
export class MayorTable extends Table {

  // @ts-ignore
    @property({type: String, reflect: true})
  public CsvUrl: string;
  
  @state()
  protected _headings: string[];

  @state()
  protected _ids: string[];

  @state()
  private _items?: Mayor[];

    constructor() {
    super();

    this.CsvUrl = '';

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
      "3 Purple Score",
    ];

    this._ids = [
      "name",
      "free",
      "mrank",
      "mgrade",
      "mps",
      "mns",
      "yrank",
      "ygrade",
      "yps",
      "yns",
      "orank",
      "ograde",
      "ops",
      "ons",
      "prank",
      "ograde",
      "ops",
      "ons",
      "prank",
      "pgrade",
      "pps",
      "pns"
    ];
     
  }

  public connectedCallback() {
    super.connectedCallback();
    this.getMayors();
  }

  public disconnectedCallback() {
    console.log('disconnected callback');
    super.disconnectedCallback();
  }

  protected getMayors() {
    csv(this.CsvUrl).then((data) => {
      for(let i = 0; i < data.length; i++) {
        if (this._items === undefined) {
          this._items = new Array<Mayor>;
        }
        this._items = this._items.concat([{
            name: data[i].name,
            free: data[i].free,
            mrank: data[i].mrank,
            mgrade: data[i].mgrade,
            mps: data[i].mps,
            mns: data[i].mns,
            yrank: data[i].yrank,
            ygrade: data[i].ygrade,
            yps: data[i].yps,
            yns: data[i].yns,
            orank: data[i].orank,
            ograde: data[i].ograde,
            ops: data[i].ops,
            ons: data[i].ons,
            prank: data[i].prank,
            pgrade: data[i].pgrade,
            pps: data[i].pps,
            pns: data[i].pns
        }]);
      }
      this.requestUpdate();
    });
  }

  render() {
      const headerTemplates = [];
      for(let i =0; i < this._headings.length; i++){
          headerTemplates.push(html`<sp-table-head-cell>${this._headings[i]}</sp-table-head-cell>`);
      }
    const itemTemplates = [];
    for (let i = 0; i < this._headings.length; i++) {
      itemTemplates.push(html`<vaadin-grid-sort-column header="${this._headings[i]}" path="${this._ids[i]}" direction="asc"></vaadin-grid-sort-column>` );
    }
    /*return html`
      <vaadin-grid .items="${this.items}" theme="wrap-cell-content" >
        ${itemTemplates}
       </vaadin-grid>
    `;*/
      return html`
          <sp-table size="l" items={${this._items}}>
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

