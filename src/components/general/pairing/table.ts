import { html, css, type PropertyValues, type PropertyValueMap, type TemplateResult, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';

const DEBUG = false;
import { withStores } from "@nanostores/lit";

import { z, type ZodError } from 'zod';

import { type CSSResultArray, SpectrumElement, SpectrumMixin } from '@spectrum-web-components/base';

import {
  Table,
  type TableBody,
  type TableCell,
  type TableCheckboxCell,
  type TableHead,
  type TableHeadCell,
  type TableRow
} from '@spectrum-web-components/table';
import '@spectrum-web-components/table/elements.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';
import '@spectrum-web-components/status-light/sp-status-light.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import { TypeSelector } from './TypeSelector.ts';
import { InvestmentSelector } from './InvestmentSelector.ts';

import { PairingRow } from "./row.ts";

import * as b from '@schemas/baseSchemas.ts';

import {
  type GeneralClassType,
  type GeneralPairType,
  generalUseCase,
  GeneralPair,
  type generalUseCaseType
} from '@schemas/generalsSchema.ts';

import {
  type generalInvestment,
  type generalTypeAndUse,
  primaryInvestmentMap,
  secondaryInvestmentMap,
  typeAndUseMap,
} from './selectionStore.ts';

import { generalPairs } from './generals.ts'

import { buffAdverbs } from './buff.ts';

type tableRecord = Record<string, PairingRow | HTMLElement>;

@customElement('pairing-table')
export class PairingTable extends withStores(SpectrumElement, [generalPairs, primaryInvestmentMap, secondaryInvestmentMap]) {

  @state()
  private records: tableRecord[] = new Array<tableRecord>();

  @state()
  private table: Table | undefined;

  @state()
  private type: b.ClassEnumType | null = null;

  @state()
  private use: generalUseCaseType | null = null;

  private tableRef: Ref<Table> = createRef();


  constructor() {
    super();

    typeAndUseMap.subscribe(tam => {
      if (DEBUG) { console.log(`table tam subscribe start`) }
      if (this.table !== null && this.table !== undefined) {

        if (this.records.length >= 1) {
          const type = tam.type;
          const use = tam.use;

          if (tam.type !== undefined && tam.type !== null) {
            this.requestUpdate('type', this.type);
            this.type = tam.type;
          }
          if (tam.use !== undefined && tam.type !== null) {
            this.requestUpdate('use', this.use);
            this.use = tam.use;
          }


          const old = this.table.items
          this.table.requestUpdate('items', old)
          this.requestUpdate();
        } else {
          this.type = tam.type;
          this.use = tam.use;
          const gp = generalPairs.get();
          if (gp != undefined && gp != null) {
            this.rowCreator(gp, b.ClassEnum.enum.all, generalUseCase.enum.all)
          }
        }
      } else {
        this.type = tam.type;
        this.use = tam.use;
      }
    })

    generalPairs.subscribe(gp => {
      if (DEBUG) { console.log(`table generalPairs subscribe start`) }
      if (gp !== undefined && gp !== null) {
        this.records = new Array<tableRecord>();
        if (this.type !== null && this.use !== null) {
          this.rowCreator(gp, this.type, this.use);
        } else {
          this.rowCreator(gp, b.ClassEnum.enum.all, generalUseCase.enum.all)
        }
      }
    })
  }

  private rowCreator(gp: Map<string, GeneralPairType[]>, type: b.ClassEnumType, use: generalUseCaseType) {
    if (DEBUG) { console.log(`rowCreator start`) }
    if (gp !== undefined && gp !== null) {
      gp.forEach((primary, index) => {
        if (DEBUG) { console.log(`general pairs subscribe foreach`) }
        primary.forEach((pair, index2) => {
          const label = `${index}.${index2}`
          if (DEBUG) { console.log(` label is ${label}\n`) }
          const one = pair['primary' as keyof typeof pair];
          const two = pair['secondary' as keyof typeof pair];
          if (DEBUG) { console.log(`rowCreator: ${one.name}:${two.name} types: ${one.score_as}:${two.score_as}`) }
          if (one !== null && one !== undefined && two !== null && two !== undefined) {
            const newRowItem = new PairingRow();
            (newRowItem as PairingRow).one = one;
            (newRowItem as PairingRow).two = two;
            newRowItem.adverbs = buffAdverbs[use];
            newRowItem.addEventListener('GeneralPairUpdate', this.PairUpdateListener);
            newRowItem.computeBuffs();
            this.rowMapper(newRowItem, label)
          }
        })
      })
    }
  }

  private rowMapper(pair: PairingRow | HTMLElement, index: string) {

    const newRecord: tableRecord = { index: pair }
    this.records.push(newRecord);
  }

  private PairUpdateListener(event: Event) {
    //if (DEBUG) {console.log(`PairUpdateListener called`)}
    if (this.table !== null && this.table !== undefined) {
      this.table.requestUpdate();
    }
    this.requestUpdate();
  }

  public pairSorter(direction: string, key: string, a: PairingRow, b: PairingRow) {
    let ga: string | number = 0;
    let gb: string | number = 0;
    const sortFunction: Record<string, (a: PairingRow, b: PairingRow) => number> = {
      ['primeName']: (a, b) => {
        let ga = a.one!.name
        let gb = b.one!.name
        return (direction === 'asc') ?
          (ga.localeCompare(gb, undefined, { sensitivity: "base" })) :
          (gb.localeCompare(ga, undefined, { sensitivity: "base" }))
      },
      ['assistName']: (a, b) => {
        let ga = a.two!.name;
        let gb = b.two!.name;
        return (direction === 'asc') ?
          (ga.localeCompare(gb, undefined, { sensitivity: "base" })) :
          (gb.localeCompare(ga, undefined, { sensitivity: "base" }))
      },
      ['attackBuff']: (a, b) => {
        let ga = a.getAttackBuff();
        let gb = b.getAttackBuff();
        if (ga === gb) {
          return 0;
        } else {
          return direction === 'asc' ?
            (ga < gb ? -1 : 1) :
            (ga < gb ? 1 : -1);
        }
      },
      ['defenseBuff']: (a, b) => {
        let ga = a.getDefenseBuff();
        let gb = b.getDefenseBuff();
        if (ga === gb) {
          return 0;
        } else {
          return direction === 'asc' ?
            (ga < gb ? -1 : 1) :
            (ga < gb ? 1 : -1);
        }
      },
      ['HPBuff']: (a, b) => {
        let ga = a.getHPBuff();
        let gb = b.getHPBuff();
        if (ga === gb) {
          return 0;
        } else {
          return direction === 'asc' ?
            (ga < gb ? -1 : 1) :
            (ga < gb ? 1 : -1);
        }
      },
      ['marchBuff']: (a, b) => {
        let ga = a.getMarchBuff();
        let gb = b.getMarchBuff();
        if (ga === gb) {
          return 0;
        } else {
          return direction === 'asc' ?
            (ga < gb ? -1 : 1) :
            (ga < gb ? 1 : -1);
        }
      },
    }

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

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties);
    if (this.renderRoot) {
      this.table = this.tableRef.value;
      if (this.table !== undefined && this.table !== null) {
        this.table.renderItem = (item, index) => {
          const myItem = (Object.values(item as tableRecord)[0] as PairingRow);

          myItem.triggerUpdate();
          return html`${myItem.render()}`
        };

        this.table.addEventListener('sorted', (event) => {
          const { sortDirection, sortKey } = (event as CustomEvent).detail;

          let items = (this.table!.items).sort((a, b) => {
            const itemA = Object.values(a)[0];
            const itemB = Object.values(b)[0]
            return this.pairSorter(sortDirection, sortKey, (itemA as PairingRow), (itemB as PairingRow));

          })
          this.table!.items = [...items];
        });
      }
    }
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(_changedProperties);
    if (DEBUG) { console.log(`table willUpdate start`) }
    if (this.renderRoot) {
      if (this.table !== null && this.table !== undefined) {
        if (this.records !== null && this.records.length >= 1) {
          if (DEBUG) { console.log(`table willUpdate sending items to table`) }
          this.table.items = this.records;
          this.table.requestUpdate();
        }
      }
    }
  }



  public static override get styles(): CSSResultArray {
    const localstyle = css`
      sp-table {
        background-color: var(--spectrum-cyan-600);
        
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
      `
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];

  }


  render() {
    return html`
    
    <sp-table size="m" style="height: calc(var(--spectrum-global-dimension-size-3600)*2)"scroller="true" ${ref(this.tableRef)}>
            <sp-table-head>
                <sp-table-head-cell id='primeName' sortable sort-direction="desc" sort-key="primeName">
                    Primary General
                </sp-table-head-cell>
                <sp-table-head-cell id='assistName' sortable sort-direction="desc" sort-key="assistName">
                    Secondary General
                </sp-table-head-cell>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="attackBuff">
                    Attack Buff
                </sp-table-head-cell>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="HPBuff">
                    HP Buff
                </sp-table-head-cell>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="defenseBuff">
                    Defense Buff
                </sp-table-head-cell>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="marchBuff">
                    March Size Buff
                </sp-table-head-cell>
            </sp-table-head>
        </sp-table>
    `
  }

}