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
  type troopClassType,
} from "@schemas/evonySchemas.ts";

import {buff} from "@components/general/buff.ts";
import {tableGeneral} from "@components/general/tableGeneral.ts";

const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

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
  protected filteredGenerals: tableGeneral[];
 
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
          const general: tableGeneral = (item['general'] as tableGeneral);
          console.log(`renderItem; ${general.name}`)

          return html`
              <sp-table-cell role='gridcell' dir='ltr' id='primeName'>${general.name}</sp-table-cell>
          `;
        };
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
      this.filteredGenerals.splice(0,this.filteredGenerals.length);
      filteredGenerals.forEach((fgo) => {
        const tg  = new tableGeneral(fgo.general, this.useCase);
        console.log(`processGenerals; ${fgo.general.name}; ${this.useCase}; ${JSON.stringify(props)}`)
        tg.setAdverbs(this.useCase);
        console.log(`processGenerals; ${JSON.stringify(tg.getBuffs())}`)
        tg.computeBuffs(props);
        this.filteredGenerals.push(tg);
      })
      let items= this.filteredGenerals.filter((fg) => {
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
      }).map((fg)=> {
      
      })
      //this.generalRecords = items;
    }
  }
  
  private changeHandler(e: CustomEvent) {
    this.processGenerals();
    if(this.table !== null && this.table !== undefined) {
      this.table.requestUpdate();
    }
  }
  
  public render() {

    const tableHtml = html`
        <sp-table size="m" scroller="true" ${ref(this.tableRef)}>
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
      test
      <div class="sp-table-container">
        <interest-selector role="primary"></interest-selector>
        <investment-selector role="primary" @PickerChanged=${this.changeHandler} ></investment-selector>
        <investment-selector role="secondary" @PickerChanged=${this.changeHandler}></investment-selector>
        ${tableHtml}
      </div>
    `
  }

}



