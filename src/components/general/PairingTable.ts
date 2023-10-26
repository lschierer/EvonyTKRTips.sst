import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

import { withStores } from "@nanostores/lit";

import {z,  type ZodError} from 'zod';

import { SpectrumElement } from '@spectrum-web-components/base';

import type {
  Table,
  TableBody,
  TableCell,
  TableCheckboxCell,
  TableHead,
  TableHeadCell,
  TableRow
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
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import {InterestSelector} from './InterestSelector.ts';
import {InvestmentSelector} from './InvestmentSelector.ts';

import {
  type generalInvestment,
  type generalTypeAndUse,
  primaryInvestmentMap,
  secondaryInvestmentMap,
  typeAndUseMap
} from './generalInvestmentStore.ts';

import {
  BuffAdverbs,
  type BuffAdverbsType,
  type BuffAdverbArrayType,
  generalSchema,
  type General,
  generalObjectSchema,
  generalUseCase,
  type generalUseCaseType,
  type generalObject,
  levelSchema,
  type levelSchemaType,
  qualitySchema,
  type qualitySchemaType,
  type standardSkillBookType,
  troopClass,
  type troopClassType, buffSchema,
} from "@schemas/evonySchemas.ts";

import {buff} from "@components/general/buff.ts";
import {tableGeneral} from "@components/general/tableGeneral.ts";

const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

type SortFunctionMap = Record<string, () => number>;

@customElement('pairing-table')
export class PairingTable extends withStores(SpectrumElement, [typeAndUseMap,primaryInvestmentMap, secondaryInvestmentMap]) {

  @state()
  private table: Table | undefined;

  private tableRef: Ref<Table> = createRef();

  @state()
  private allGenerals: generalArrayType;

  @state()
  private generalRecords: [];

  @property({type: String})
  public dataUrl: string;

  @state()
  private _dataUrl: URL;

  @state()
  protected filteredGenerals: generalArrayType;
 
  @state()
  protected unitClass: troopClassType = 'all';

  @state()
  protected useCase: generalUseCaseType = generalUseCase.enum.all;

  constructor() {
    super();

    this.dataUrl = 'http://localhost';
    this._dataUrl = new URL(this.dataUrl);
    this.filteredGenerals = new Array<tableGeneral>();
    this.generalRecords = [];

  }

  private MutationObserverCallback = (mutationList: MutationRecord[] , observer: MutationObserver) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
      } else if (mutation.type === "attributes") {
        console.log(`The ${mutation.attributeName} attribute was modified.`);
      }
    }
  };

  private observer = new MutationObserver(this.MutationObserverCallback);

  connectedCallback() {
    super.connectedCallback();
    typeAndUseMap.subscribe((tau) => {
      this.unitClass = tau.type;
      this.useCase = tau.use;
    })
  }

  firstUpdated() {
    if (this.renderRoot) {
      this.table = this.tableRef.value
      if (this.table !== undefined && this.table !== null) {
        console.log(`firstUpdated; found table`)

        this.table.renderItem = (item, index) => {
          const primary: tableGeneral = (item['primary'] as tableGeneral);
          const secondary: tableGeneral = (item['secondary'] as tableGeneral);
          console.log(`renderItem; ${primary.name}`)
          let ab = primary.attackBuff;
          let db = primary.defenseBuff;
          let hb = primary.hpBuff;

          ab = ab + secondary.attackBuff;
          db = db + secondary.defenseBuff;
          hb = hb + secondary.hpBuff;
          return html`
              <sp-table-cell role='gridcell' dir='ltr' id='primeName'>${primary.name}</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='assistName'>${secondary.name}</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='attackBuff'>${ab}</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='HPBuff'>${hb}</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='defenseBuff'>${db}</sp-table-cell>
          `;
        };

        this.table.addEventListener('sorted', (event) => {
          const {sortDirection, sortKey} = (event as CustomEvent).detail;
          let items = (this.table!.items ).sort((a, b) => {
            let ga: tableGeneral | number = 0;
            let gb: tableGeneral | number = 0;
            const sortFunction: SortFunctionMap = {
              ['primeName']: (a, b) => {
                ga = (a['primary'] as tableGeneral);
                gb = (b['primary'] as tableGeneral);
                console.log(`${ga.name} ${gb.name}`)
                return (sortDirection === 'asc') ?
                    (ga.name.localeCompare(gb.name, undefined, {sensitivity: "base"})) :
                    (gb.name.localeCompare(ga.name, undefined, {sensitivity: "base"}))
              },
              ['assistName']: (a,b) => {
                ga = (a['secondary'] as tableGeneral);
                gb = (b['secondary'] as tableGeneral);
                console.log(`${ga.name} ${gb.name}`)
                return (sortDirection === 'asc') ?
                    (ga.name.localeCompare(gb.name, undefined, {sensitivity: "base"})) :
                    (gb.name.localeCompare(ga.name, undefined, {sensitivity: "base"}))
              },
              ['attackBuff']: (a,b) => {
                ga = (a['primary'] as tableGeneral).attackBuff + (a['secondary'] as tableGeneral).attackBuff;
                gb = (b['primary'] as tableGeneral).attackBuff + (b['secondary'] as tableGeneral).attackBuff;
                if(ga === gb) {
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                      (ga < gb ? -1 : 1) :
                      (ga < gb ? 1 : -1);
                }
              },
              ['defenseBuff']: (a, b) => {
                ga = (a['primary'] as tableGeneral).defenseBuff + (a['secondary'] as tableGeneral).defenseBuff;
                gb = (b['primary'] as tableGeneral).defenseBuff + (b['secondary'] as tableGeneral).defenseBuff;
                if(ga === gb) {
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                      (ga < gb ? -1 : 1) :
                      (ga < gb ? 1 : -1);
                }
              },
              ['HPBuff']: (a, b) => {
                ga = (a['primary'] as tableGeneral).hpBuff + (a['secondary'] as tableGeneral).hpBuff;
                gb = (b['primary'] as tableGeneral).hpBuff + (b['secondary'] as tableGeneral).hpBuff;
                if(ga === gb) {
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                      (ga < gb ? -1 : 1) :
                      (ga < gb ? 1 : -1);
                }
              },
            }

            const result = sortFunction[sortKey](a,b);
            console.log(`sort returning ${result}`)
            return result
          })
          this.table!.items = [...items];
        });


      }
    }
  }

  async willUpdate(changedProperties: PropertyValues<this>) {
    console.log(`willUpdate; start`);
    if (changedProperties.has('dataUrl')) {
      console.log(`setting dataUrl`)
      this._dataUrl = new URL(this.dataUrl);

      const result = await fetch(this._dataUrl).then((response) => {
        if (response.ok) {
          console.log(`response ok`)
          return response.text();
        } else throw new Error('Status code error: ' + response.status);
      }).then((text) => {
        const jsonResult = JSON.parse(text);
        console.log(JSON.stringify(jsonResult))
        const result: { success: true; data: generalArrayType; } | { success: false; error: ZodError; } = generalArray.safeParse(jsonResult);
        if (result.success) {
          console.log(`result success`)
          this.allGenerals = result.data;
          return true;
        } else {
          console.log(`zod failed validation`);
          result.error;
        }
        return false;
      }).catch((error) => {
        console.log(error)
        return false;
      });
      if (result) {
        console.log(`successful fetch`);
      }
    }
    if (this.allGenerals !== undefined && this.allGenerals !== null) {
      console.log(`willUpdate; I have generals`);
      this.processGenerals();
    }
    if(this.table !== undefined && this.table !== null ) {
      if (this.generalRecords) {
        this.table.items = this.generalRecords;
        this.table.requestUpdate();
      }
    }
  }

  private processGenerals() {
    console.log(`processGenerals; start unitClass ${this.unitClass}`)
    if(this.allGenerals !== null && this.allGenerals !== undefined) {
      const filteredGenerals: generalObject[] = this.allGenerals.filter((g: generalObject) => {
        if(this.unitClass === troopClass.enum.all) {
          return (g !== undefined && g !== null)
        } else {
          const general = g.general;
          if(general !== null && general !== undefined) {
            if(general.score_as !== null && general.score_as !== undefined) {
              return (! this.unitClass.localeCompare(general.score_as))
            }
          }
        }
        return false;
      })
      const props = {
        ascending: primaryInvestmentMap.get().ascending,
        Speciality1: primaryInvestmentMap.get().speciality1,
        Speciality2: primaryInvestmentMap.get().speciality2,
        Speciality3: primaryInvestmentMap.get().speciality3,
        Speciality4: primaryInvestmentMap.get().speciality4,
      };
      const Assistprops = {
        ascending: '0',
        Speciality1: secondaryInvestmentMap.get().speciality1,
        Speciality2: secondaryInvestmentMap.get().speciality2,
        Speciality3: secondaryInvestmentMap.get().speciality3,
        Speciality4: secondaryInvestmentMap.get().speciality4,
      };
      console.log(`processGenerals; props is ${JSON.stringify(props)}`)
      this.filteredGenerals = filteredGenerals;
      let items:Record<string,tableGeneral>[] = this.filteredGenerals.filter((fg) => {
        if(this.unitClass !== null && this.unitClass !== undefined) {
          if(this.unitClass !== troopClass.enum.all) {
            if(fg.general !== null && fg.general !== undefined) {
              if(fg.general.score_as !== null && fg.general.score_as !== undefined) {
                if(fg.general.score_as === this.unitClass) {
                  return true;
                }
              }
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
        return false;
      }).map((g) => {
        let tg1 = new tableGeneral(g.general, this.useCase)
        tg1.setAdverbs(this.useCase);
        tg1.computeBuffs(props);
        let assistants = new Array<Record<string,tableGeneral>>();
        this.filteredGenerals.forEach((pa) => {
          if(tg1.name.localeCompare(pa.general.name)){
            const ta = new tableGeneral(pa.general, this.useCase);
            ta.setAdverbs(this.useCase);
            ta.computeBuffs(Assistprops);
            assistants.push({'primary':tg1,'secondary':ta})
          }
        })
        return assistants;
      }).flat();
      if(items !== null && items !== undefined && items.length > 0) {
        this.generalRecords = items;
      }
    }
  }
  
  private changeHandler(e: CustomEvent) {
    this.processGenerals();
    if(this.table !== null && this.table !== undefined) {
      this.table.requestUpdate();
    }
  }

  static styles = css`
    .sp-table-container {
      display: block;
      flex: 2 0 auto;
      min-height: calc(var(--spectrum-global-dimension-size-6000)*2);
      & sp-table {
        background-color: var(--spectrum-cyan-600);
        
        & sp-table-body {
          min-height: var(--spectrum-global-dimension-size-900);
        }
      }
    }
    
  `

  public render() {

    const tableHtml = html`
        <sp-table size="m" style="height: calc(var(--spectrum-global-dimension-size-3600)*2)"scroller="true" ${ref(this.tableRef)}>
            <sp-table-head>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="primeName">
                    Primary General
                </sp-table-head-cell>
                <sp-table-head-cell sortable sort-direction="desc" sort-key="assistName">
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
            </sp-table-head>
        </sp-table>
    `;

    return html`
      
      <div class="sp-table-container">
        <interest-selector role="primary"></interest-selector>
        <investment-selector role="primary" @PickerChanged=${this.changeHandler} ></investment-selector>
        <investment-selector role="secondary" @PickerChanged=${this.changeHandler}></investment-selector>
        ${tableHtml}
      </div>
    `
  }

}



