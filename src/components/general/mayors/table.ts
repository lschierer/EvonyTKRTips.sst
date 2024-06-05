import {
  html,
  css,
  type CSSResultGroup,
  type CSSResultArray,
  nothing,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';

const DEBUG = false;

import { type GeneralArrayType } from '@schemas/generalsSchema';

import { generalsContext } from './contexts';

import { Table } from '@spectrum-web-components/table';
import {
  SpectrumElement,
  type PropertyValueMap,
} from '@spectrum-web-components/base';
import '@spectrum-web-components/table/elements.js';

import { TableGeneral } from './generals';

@customElement('general-table')
export class GeneralTable extends SpectrumElement {
  @consume({ context: generalsContext, subscribe: true })
  @property({ attribute: false })
  public theGenerals?: GeneralArrayType | undefined;

  private tableRef: Ref<Table> = createRef();

  @state()
  private generalRecords: Record<string, TableGeneral>[] = new Array<
    Record<string, TableGeneral>
  >();

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has('theGenerals')) {
      if (DEBUG) {
        console.log(`mayor table willUpdate`);
      }
      if (this.theGenerals !== undefined && this.theGenerals !== null) {
        if (DEBUG) {
          console.log(`and I have generals`);
        }
        const items: Record<string, TableGeneral>[] = this.theGenerals
          .map((datum) => {
            if (datum !== null && datum !== undefined) {
              const name = datum.general.name;
              const tg = new TableGeneral();
              tg.thisGeneral = datum.general;
              const r: Record<string, TableGeneral> = { general: tg };
              return r;
            }
          })
          .filter(this.isTableGeneral);
        this.generalRecords = items;
        if (this.tableRef.value !== undefined && this.tableRef.value !== null) {
          if (DEBUG) {
            console.log(`updating items with ${items.length}`);
          }
          this.tableRef.value.items = items;
        }
      }
    }
  }

  private isTableGeneral(
    g: Record<string, TableGeneral> | undefined
  ): g is Record<string, TableGeneral> {
    return !!g;
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (DEBUG) {
      console.log(`mayor table firstUpdated`);
    }
    if (this.renderRoot !== undefined && this.renderRoot !== null) {
      if (this.tableRef !== undefined && this.tableRef !== null) {
        if (this.tableRef.value !== undefined && this.tableRef.value !== null) {
          const table = this.tableRef.value;

          table.renderItem = (item, index) => {
            const cell1 = document.createElement('sp-table-cell');
            cell1.textContent = index.toString().padStart(3);
            cell1.id = 'index';
            const t = (item.general as TableGeneral).render();
            if (t !== undefined && t !== null) {
              return html`${cell1}${t}`;
            } else {
              return html`${cell1}`;
            }
          };

          if (
            table.items === null ||
            table.items === undefined ||
            (Array.isArray(table.items) && table.items.length === 0)
          ) {
            table.items = this.generalRecords;
          }
        }
      }
    }
  }

  public static override get styles(): CSSResultGroup | undefined {
    const localstyle = css`
      sp-table {
        background-color: var(--spectrum-cyan-600);

        & sp-table-head {
          width: 100%;
          max-height: 120px;

          & sp-table-head-cell {
            writing-mode: vertical-rl;

            text-wrap: wrap;
            word-wrap: break-word;

            font-size: small;
          }

          & #index {
            writing-mode: vertical-rl;
            width: 32px;
            flex-grow: 0;
            flex-shrink: 0;
          }

          & #primeName {
            writing-mode: horizontal-tb;
            flex-grow: 3;
            flex-shrink: 1;
            flex-basis: max-content;
          }
        }

        & sp-table-body {
          min-height: var(--spectrum-global-dimension-size-900);

          & sp-table-cell {
            border-left-style: none;
            border-left-width: 0.1px;
          }

          #index {
            flex-grow: 0;
            flex-shrink: 0;
            width: 32px;
          }

          & .buff {
            flex-grow: 0;
            flex-shrink: 1;
            flex-basis: 55px;
            max-width: 55px;
          }
          & #primeName {
            writing-mode: horizontal-tb;
            flex-grow: 3;
            flex-shrink: 0;
            flex-basis: max-content;

            .celldiv {
              display: flex;
              flex-flow: row wrap;
              justify-content: space-evenly;
              width: 100%;

              & .name {
                flex: 3;
              }

              & .status {
                flex: 1;
              }

              & sp-status-light {
                align-self: center;
                padding: 1px;
              }
            }
          }
        }

        @media screen and (max-width: 960px) {
          .table-container sp-table-cell,
          .table-container sp-table-head-cell {
            font-size: x-small;
          }
        }
      }
    `;
    if (super.styles !== null && super.styles !== undefined) {
      const cra: CSSResultArray = [super.styles].flat() as CSSResultArray;
      cra.push(localstyle);
      return cra as CSSResultGroup;
    } else return [localstyle];
  }

  render() {
    return html`
      ${this.theGenerals !== undefined ? this.theGenerals?.length : nothing}
      <sp-table
        size="m"
        role="grid"
        style="height: calc(var(--spectrum-global-dimension-size-3600)*2)"
        scroller="true"
        ${ref(this.tableRef)}
      >
        <sp-table-head>
          <sp-table-head-cell class="index" id="index"
            >Index</sp-table-head-cell
          >
          <sp-table-head-cell
            sortable
            sort-direction="desc"
            id="primeName"
            sort-key="primeName"
          >
            Mayor Name
          </sp-table-head-cell>
          <sp-table-head-cell
            sortable
            sort-direction="desc"
            id="attackDebuff"
            sort-key="attackDebuff"
          >
            Attack Debuff
          </sp-table-head-cell>
          <sp-table-head-cell
            sortable
            sort-direction="desc"
            id="SDebuff"
            sort-key="SDebuff"
          >
            Survivability Debuff
          </sp-table-head-cell>
          <sp-table-head-cell
            sortable
            sort-direction="desc"
            id="HPDebuff"
            sort-key="HPDebuff"
          >
            HP Debuff
          </sp-table-head-cell>
          <sp-table-head-cell
            sortable
            sort-direction="desc"
            id="defenseDebuff"
            sort-key="defenseDebuff"
          >
            Defense Debuff
          </sp-table-head-cell>
          <sp-table-head-cell
            sortable
            sort-direction="desc"
            id="W2DDebuff"
            sort-key="W2DDebuff"
          >
            Wounded to Death Rate
          </sp-table-head-cell>
          <sp-table-head-cell
            sortable
            sort-direction="desc"
            id="SCTSDebuff"
            sort-key="SCTSDebuff"
          >
            SubCity Training Speed
          </sp-table-head-cell>
          <sp-table-head-cell
            sortable
            sort-direction="desc"
            id="SCTCDebuff"
            sort-key="SCTCDebuff"
          >
            SubCity Training Capacity
          </sp-table-head-cell>
        </sp-table-head>
      </sp-table>
    `;
  }
}
