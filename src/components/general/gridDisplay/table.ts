import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";

import { ContextConsumer, consume } from "@lit/context";

import { z } from "zod";

import {
  type CSSResultArray,
  css,
  CSSResult,
  SpectrumElement,
  SizedMixin,
  type PropertyValueMap,
} from "@spectrum-web-components/base";

import {
  Table,
  type TableBody,
  type TableCell,
  type TableCheckboxCell,
  type TableHead,
  type TableHeadCell,
  type TableRow,
} from "@spectrum-web-components/table";
import "@spectrum-web-components/table/elements.js";

import {
  ConflictArray,
  type ConflictArrayType,
  ConflictDatum,
  type ConflictDatumType,
  GeneralElement,
  type GeneralElementType,
} from "@schemas/index";

import { arrayUniqueFilter } from "@lib/util";

import { generalPair } from "./pair";

import { type GeneralStore, GeneralStoreContext } from "./GeneralContext";

const DEBUG = true;

const TableRowData = z.object({
  primary: z.string(),
  secondary: z.string(),
});
type TableRowDataType = z.infer<typeof TableRowData>;

type TableRecord = Record<string, TableRowDataType>;

@customElement("general-table")
export class GeneralTable extends SizedMixin(SpectrumElement, {
  validSizes: ["s", "m", "l", "xl"],
  defaultSize: "m",
  noDefaultSize: false,
}) {

  @state()
  private generalStore = new ContextConsumer(this, {
    context: GeneralStoreContext,
    subscribe: true,
  });

  @state()
  private table: Table | undefined;

  private tableRef: Ref<Table> = createRef();

  private pairFinder() {
    if (DEBUG) console.log(`gridDisplay table pairFinder; start`);
    const TableData = new Array<TableRecord>();
    if (this.generalStore !== undefined && this.generalStore !== null) {
      if (
        this.generalStore.value !== undefined &&
        this.generalStore.value !== null
      ) {
        if (DEBUG)
          console.log(`gridDisplay table pairFinder; with general store`);
        const allGenerals = this.generalStore.value.allGenerals;
        if (
          allGenerals !== undefined &&
          allGenerals !== null &&
          allGenerals.length > 0
        ) {
          if (DEBUG)
            console.log(`gridDisplay table pairFinder; with generals in store`);
          for (const general of allGenerals) {
            const s = general.general.name;
            let conflictData: ConflictDatumType[] =
              new Array<ConflictDatumType>();
            if (
              this.generalStore.value.conflicts !== undefined &&
              this.generalStore.value.conflicts !== null
            ) {
              conflictData = this.generalStore.value?.conflicts.filter(
                (datum: ConflictDatumType, index) => {
                  const conflicts = Object.values(datum.conflicts);
                  
                  if (Array.isArray(conflicts[0])) {
                    const cA = [...conflicts[0]]
                      .flat()
                      .filter(arrayUniqueFilter);
                    if (cA.includes(s)) {
                      return true;
                    }
                  } else {
                    return false;
                  }
                  return false;
                }
              );
            }
            if (DEBUG) console.log(`${s} has ${conflictData.length} conflict records`);
            for (let i = 0; i < allGenerals.length; i++) {
              const pair = new generalPair(general.general, allGenerals, i);
              let conflict_exclude = false;
              if (pair.secondary !== null) {
                if (conflictData.length > 0) {
                  for (const datum of conflictData) {
                    const conflicts = Object.values(datum.conflicts);
                    if (Array.isArray(conflicts[0])) {
                      let cA = [...conflicts[0]];
                      if(Array.isArray(conflicts[1])){
                        cA = [...cA, ...conflicts[1]].flat();
                      }
                      if (cA.includes(pair.secondary.name)) {
                        conflict_exclude = true;
                      }
                    } else {
                      if (DEBUG)
                        console.log(
                          `conflictData at index 0 ${Object.keys(conflictData)[0]}`
                        );
                    }
                  }
                } else {
                  console.log(`I have no conflict data`)
                }
                if (!conflict_exclude) {
                  TableData.push({
                    s: {
                      primary: pair.primary.name,
                      secondary: pair.secondary.name,
                    },
                  });
                }
              }
            }
          }
        }
      }
    }
    return TableData;
  }

  public pairSorter(
    direction: string,
    key: string,
    a: TableRowDataType,
    b: TableRowDataType
  ) {
    const sortFunction: Record<
      string,
      (a: TableRowDataType, b: TableRowDataType) => number
    > = {
      ["primeName"]: (a, b) => {
        const ga = a.primary;
        const gb = b.primary;
        return direction === "asc"
          ? ga.localeCompare(gb, undefined, { sensitivity: "base" })
          : gb.localeCompare(ga, undefined, { sensitivity: "base" });
      },
      ["assistName"]: (a, b) => {
        const ga = a.secondary;
        const gb = b.secondary;
        return direction === "asc"
          ? ga.localeCompare(gb, undefined, { sensitivity: "base" })
          : gb.localeCompare(ga, undefined, { sensitivity: "base" });
      },
    };

    if (a !== null && a !== undefined) {
      if (b !== null && b !== undefined) {
        return sortFunction[key](a, b);
      } else {
        return 1;
      }
    } else {
      if (b !== null && b !== undefined) {
        return -1;
      } else {
        return 0;
      }
    }
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);

    if (this.renderRoot) {
      this.table = this.tableRef.value;
      if (this.table !== undefined && this.table !== null) {
        if (DEBUG) console.log(`gridDisplay table firstUpdated; table defined`);

        if (
          this.generalStore?.value !== undefined &&
          this.generalStore.value !== null
        ) {
          if (DEBUG)
            console.log(`gridDisplay table firstUpdated; generalstore`);
          const records = this.pairFinder();
          if (records.length > 0) {
            if (DEBUG)
              console.log(
                `gridDisplay table firstUpdated; ${records.length} records`
              );

            this.table.items = [...records];
          } else {
            console.log(`gridDisplay table firstUpdated; no records`);
          }
        }
        this.table.renderItem = (item, index) => {
          const tItem = Object.values(item as TableRecord)[0];
          if (tItem !== undefined && tItem !== null) {
            return html`
              <sp-table-cell class="index">${index}</sp-table-cell>
              <sp-table-cell class="name">${tItem.primary}</sp-table-cell>
              <sp-table-cell class="name">${tItem.secondary}</sp-table-cell>
            `;
          } else {
            console.error(`renderItem called for null or undefined item`);
            return html``;
          }
        };
      }

      this.table?.addEventListener("sorted", (event) => {
        const { sortDirection, sortKey } = (event as CustomEvent).detail;

        const items = this.table!.items.sort((a, b) => {
          const itemA = Object.values(a)[0] as TableRowDataType;
          const itemB = Object.values(b)[0];
          return this.pairSorter(
            sortDirection,
            sortKey,
            itemA,
            itemB as TableRowDataType
          );
        });
        this.table!.items = [...items];
      });
    }
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.willUpdate(_changedProperties);
    if (DEBUG) console.log(`${Object.keys(_changedProperties)}`);
    if (DEBUG) console.log(`gridDisplay table willupdate; called`);
    if (this.renderRoot) {
      if (DEBUG) console.log(`gridDisplay table willupdate; renderRoot`);
      if (this.table !== null && this.table !== undefined) {
        if (DEBUG) console.log(`gridDisplay table willupdate; table defined`);
        if (_changedProperties.has("generalStore")) {
          if (DEBUG) console.log(`gridDisplay table willupdate; generalStore`);
        }
      }
    }
  }
  public static override get styles(): CSSResultArray {
    const localstyle = css`
      sp-table {
        background-color: var(--spectrum-cyan-600);

        & .index {
          flex-grow: 1;
          flex-shrink: 1;
          max-width: var(--spectrum-global-dimension-size-600);
        }

        .cellDiv {
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

        & #primeName {
          flex-grow: 3;
        }

        & #assistName {
          flex-grow: 3;
        }

        & sp-table-body {
          min-height: var(--spectrum-global-dimension-size-900);
        }
      }
    `;
    return [localstyle];
  }

  protected render() {
    let returnString = html``;

    if (this.table !== undefined && this.table !== null) {
      if (DEBUG)
        console.log(`gridDisplay table render called when table exists`);
      if (
        this.generalStore.value?.allGenerals !== undefined &&
        this.generalStore.value.allGenerals !== null &&
        this.generalStore.value.allGenerals.length > 0
      ) {
        console.log(`gridDisplay table render calling pairFinder`);
        const records = this.pairFinder();
        if (records.length > 0) {
          this.table.items = [...records];
        }
      }
      if (DEBUG)
        console.log(
          `gridDisplay table render ${this.table.items.length} items`
        );
    }

    if (this.generalStore !== undefined && this.generalStore !== null) {
      if (
        this.generalStore.value?.allGenerals !== undefined &&
        this.generalStore.value.allGenerals !== null &&
        this.generalStore.value.allGenerals.length > 0
      ) {
        const allGenerals = this.generalStore.value.allGenerals;

        returnString = html`${returnString}
                    <sp-table 
                        size="m" 
                        style="height: calc(var(--spectrum-global-dimension-size-3600)*2)"
                        scroller="true" 
                        ${ref(this.tableRef)}
                        >
                        <sp-table-head>
                            <sp-table-head-cell
                              class='index'
                              id='index'
                              >
                              Index
                            </sp-table-head-cell>
                            <sp-table-head-cell 
                                id='primeName'
                                sortable
                                sort-direction='desc'
                                sort-key='primeName'
                                >
                                Primary General
                            </sp-table-head-cell>
                            <sp-table-head-cell 
                                id='assistName'
                                sortable
                                sort-direction='desc'
                                sort-key='assistName'
                                >
                                Secondary General
                            </sp-table-head-cell>
                        </sp-table-head>
                    </sp-table>
                `;
      }
    }
    return returnString;
  }
}
