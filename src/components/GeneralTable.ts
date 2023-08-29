import {LitElement, css, html} from 'lit';
import type { PropertyValues } from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {createRef, ref} from 'lit/directives/ref.js';
import type { Ref }  from 'lit/directives/ref.js';

import '@spectrum-web-components/table/elements.js';

import type {
    Table,
    TableBody,
    TableCell,
    TableCheckboxCell,
    TableHead,
    TableHeadCell,
    TableRow
} from '@spectrum-web-components/table';

@customElement('general-table')
export class GeneralTable extends LitElement {

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

    private tableDivRef: Ref<HTMLElement> = createRef();

    @property({type: String})
    public name: string;

    private initItems(count: number) {
        const total = count;
        const items = [];
        while (count) {
            count--;
            items.push({
                name: String(total-count),
                date: count,
            });
        }
        return items;
    }

    private initTable() {
        const tableDiv= this.tableDivRef.value;
        if(tableDiv) {
            let table: Table|null = tableDiv.querySelector('#'+this.name);
            if(table) {
                console.log(`found table`);
                table.items = this.initItems(50);

                table.renderItem = (item, index) => {
                    return html`
                        <sp-table-cell>Row Item Alpha ${item.name}</sp-table-cell>
                        <sp-table-cell>Cell 2: ${index}</sp-table-cell>
                        <sp-table-cell>Last Thing</sp-table-cell>
                    `
                }

            }
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.initTable();
    }

    render(){
        return html`
            <div class="table-container" ${ref(this.tableDivRef)}>
                <sp-table id=${this.name}
                          size="m"
                          scroller="true"
                          >
                    <sp-table-head>
                        <sp-table-head-cell>Column 1</sp-table-head-cell>
                        <sp-table-head-cell>Column 2</sp-table-head-cell>
                        <sp-table-head-cell>Column 3</sp-table-head-cell>    
                    </sp-table-head>
                    
                </sp-table>
            </div>
        `

    }

}