import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

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
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';


import {
  generalSchema,
  type General,
  generalObjectSchema,
  type generalObject,
  levelSchema,
    type levelSchemaType,
  qualitySchema,
    type qualitySchemaType,
  troopClass,
    type troopClassType,
} from "@schemas/evonySchemas.ts";

import {attack_buff} from "@components/general/buff.ts";

const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

const tableGeneral = z.object({
  name: z.string(),
  attack: z.number(),
  attackBuff: z.number(),
  unitClass: troopClass.nullish(),
})
type tableGeneralType = z.infer<typeof tableGeneral>;

type generalRecord = Record<string, tableGeneralType>;

@customElement('comparing-table')
export class ComparingTable extends SpectrumElement {
  
  private tableRef: Ref<Table> = createRef();
  
  @property({type: String})
  public dataUrl: string;
  
  @state()
  private _dataUrl: URL;
  
  @state()
  private allGenerals: generalArrayType;
  
  @state()
  private generalRecords: generalRecord[]
  
  @state()
  private table: Table | undefined;

  @state()
  protected ascending: levelSchemaType = '10';

  @state()
  protected Speciality1: qualitySchemaType = "Gold";

  @state()
  protected Speciality2: qualitySchemaType = "Gold";

  @state()
  protected Speciality3: qualitySchemaType = "Gold";

  @state()
  protected Speciality4: qualitySchemaType = "Gold";

  @state()
  protected unitClass: troopClassType = 'all';

  constructor() {
    super();
    
    this.dataUrl = 'http://localhost';
    this._dataUrl = new URL(this.dataUrl)
    this.generalRecords = new Array<Record<string,General>>();
    
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
    
  }
  
  firstUpdated() {
    if (this.renderRoot) {
      this.table = this.tableRef.value
      if (this.table !== undefined && this.table !== null) {
        console.log(`firstUpdated; found table`)
        
        this.table.renderItem = (item, index) => {
          const general: tableGeneralType = (item['general'] as tableGeneralType);
          console.log(`renderItem; ${general.name}`)
          return html`
              <sp-table-cell id='name' dir='ltr' role='gridcell' >${general.name}</sp-table-cell>
              <sp-table-cell id='attack' dir='ltr' role='gridcell'>${general.attack}</sp-table-cell>
              <sp-table-cell id='attackBuff' dir='ltr' role='gridcell'>${general.attackBuff}</sp-table-cell>
          `;
        };


        
        this.table.addEventListener('sorted', (event) => {
          const {sortDirection, sortKey} = (event as CustomEvent).detail;
          let items = (this.table!.items as generalRecord[]).sort((a, b) => {
            const ga: tableGeneralType = (a['general'] as tableGeneralType);
            const gb: tableGeneralType = (b['general'] as tableGeneralType);
            switch (sortKey) {
              case 'attack':
                if(ga.attack === gb.attack) {
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                    (ga.attack < gb.attack ? -1 : 1) :
                    (ga.attack < gb.attack ? 1 : -1);
                }
              case 'attackBuff':
                if(ga.attackBuff === gb.attackBuff){
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                      (ga.attackBuff < gb.attackBuff ? -1 : 1) :
                      (ga.attackBuff < gb.attackBuff ? 1 : -1);
                }
              case 'name':
                return (sortDirection === 'asc') ?
                  (ga.name.localeCompare(gb.name,undefined,{sensitivity: "base"})) :
                  (gb.name.localeCompare(ga.name,undefined,{sensitivity: "base"}));
              default:
                return 0;
            }
            return 0;
          });
          this.table!.items = [...items];
        });
      }
    }
  }
  
  async willUpdate(changedProperties: PropertyValues<this>) {
    console.log(`willUpdate; start`);
    if(changedProperties.has('dataUrl')) {
      console.log(`setting dataUrl`)
      this._dataUrl = new URL(this.dataUrl);
      
      const result = await fetch(this._dataUrl).then((response) => {
        if (response.ok) {
          console.log(`response ok`)
          return response.text();
        }
        else throw new Error('Status code error: ' + response.status);
      }).then((text) => {
        const jsonResult = JSON.parse(text);
        console.log(JSON.stringify(jsonResult))
        const result: { success: true; data: generalArrayType; } | { success: false; error: ZodError; } = generalArray.safeParse(jsonResult);
        if(result.success) {
          console.log(`result success`)
          this.allGenerals = result.data;
          return true;
        }else {
          console.log(`zod failed validation`);
          result.error;
        }
        return false;
      }).catch((error) =>{
        console.log(error)
        return false;
      });
      if(result){
        console.log(`successful fetch`);
      }
    }
    if(this.allGenerals !== undefined && this.allGenerals !== null) {
      console.log(`willUpdate; I have generals`);
      if(this.table !== undefined && this.table !== null) {
        console.log(`willUpdate; I have a table`);
        if(this.table.items !== undefined && this.table.items !== null && this.table.items.length === 0) {
          console.log(`willUpdate; I need records`);
          this.processGenerals();

        }
      }
    }
    this.table.items = this.generalRecords;
    this.table!.requestUpdate();
  }
  
  private processGenerals() {
    const props = {
      ascending: this.ascending,
      Speciality1: this.Speciality1,
      Speciality2: this.Speciality2,
      Speciality3: this.Speciality3,
      Speciality4: this.Speciality4,
    };
    if(this.allGenerals !== undefined && this.allGenerals !== null && this.allGenerals.length > 0) {
      if(this.table !== undefined && this.table !== null) {
        let items = new Array<Record<string,tableGeneralType>>()
        this.allGenerals.forEach((g) => {
          const valid = generalObjectSchema.safeParse(g);
          if(valid.success) {
            console.log(`pushing ${JSON.stringify(valid.data.general.name)}`)
            const go: generalObject = valid.data;
            const name = go.general.name;
            const attack = go.general.attack;
            const attackBuff = attack_buff(go.general,[
              'Attacking',
              'Marching',
              'When Rallying',
              'leading the army to attack',
              'Reinforcing',
              'Defending',
            ], props);
            items.push({'general': {
              name: name,
              attack: attack,
              attackBuff: attackBuff,
              unitClass: go.general.score_as ? go.general.score_as : 'all',
            }});
          }
        })
        this.generalRecords = items.filter((g) => {
          if(g !== null && g !== undefined ) {
            if(this.unitClass.localeCompare('all')) {
              if(g['general'].unitClass !== undefined && g['general'].unitClass !== null) {
                return(!this.unitClass.localeCompare(g['general'].unitClass))
              }
            } else {
              return true;
            }
          }
          return false;
        });
      }
    }
  }

  protected changeHandler(e: Event) {
    const picker = e.target as Picker;
    if(!picker.id.localeCompare('ascending')) {
      this.ascending = picker.value;
    }else if (!picker.id.localeCompare('Speciality1')) {
      this.Speciality1 = picker.value;
    } else if (!picker.id.localeCompare('Speciality2')) {
      this.Speciality2 = picker.value;
    } else if (!picker.id.localeCompare('Speciality3')) {
      this.Speciality3 = picker.value;
    } else if (!picker.id.localeCompare('Speciality4')) {
      this.Speciality4 = picker.value;
    } else if (!picker.id.localeCompare('unitClass')) {
      this.unitClass = picker.value;
    } else {
      console.log(`picker id is ${picker.id}`)
    }
    this.processGenerals();
  }
  
  static styles = css`
    .sp-table-container {
      & sp-table {
        background-color: var(--spectrum-indigo-400);
        min-height: var(--spectrum-global-dimension-size-300);
        
        & sp-table-body {
          min-height: var(--spectrum-global-dimension-size-200);
        }
      }
    }
    
    sp-picker#ascending {
      width: 3rem;
    }
    
    sp-picker[id^=Speciality]{
      width: 7rem;
    }
    
    sp-picker#unitClass {
      width: 9rem;
    }
    
  `
  
  public render() {
    return html`
        <div class="sp-table-container">
          <sp-field-group horizontal >
            <div>
              <sp-field-label for="ascending" size="s">Ascending Level</sp-field-label>
              <sp-picker id="ascending" size="s" label="5" value='10' @change=${this.changeHandler}>
                <sp-menu-item value='5' >0</sp-menu-item>
                <sp-menu-item value='6' >1</sp-menu-item>
                <sp-menu-item value='7' >2</sp-menu-item>
                <sp-menu-item value='8' >3</sp-menu-item>
                <sp-menu-item value='9' >4</sp-menu-item>
                <sp-menu-item value='10' >5</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="unitClass" size="s">Filter by Type</sp-field-label>
              <sp-picker id="unitClass" size="s" label="All" value="all" @change=${this.changeHandler}>
                <sp-menu-item value="all">All Generals</sp-menu-item>
                <sp-menu-item value="Mounted">Mounted Generals</sp-menu-item>
                <sp-menu-item value="Ground">Ground Generals</sp-menu-item>
                <sp-menu-item value="Archers">Archer Generals</sp-menu-item>
                <sp-menu-item value="Siege">Siege Generals</sp-menu-item>
              </sp-picker>
            </div>
          </sp-field-group>
          <sp-field-group horizontal >
            <div>
              <sp-field-label for="Speciality1" size="s">1st Speciality</sp-field-label>
              <sp-picker id="Speciality1" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                <sp-menu-item value="Disable">Not Active</sp-menu-item>
                <sp-menu-item value='Green' >Green</sp-menu-item>
                <sp-menu-item value='Blue' >Blue</sp-menu-item>
                <sp-menu-item value='Purple' >Purple</sp-menu-item>
                <sp-menu-item value='Orange' >Orange</sp-menu-item>
                <sp-menu-item value='Gold' >Gold</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="Speciality2" size="s">2nd Speciality</sp-field-label>
              <sp-picker id="Speciality2" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                <sp-menu-item value="Disable">Not Active</sp-menu-item>
                <sp-menu-item value='Green' >Green</sp-menu-item>
                <sp-menu-item value='Blue' >Blue</sp-menu-item>
                <sp-menu-item value='Purple' >Purple</sp-menu-item>
                <sp-menu-item value='Orange' >Orange</sp-menu-item>
                <sp-menu-item value='Gold' >Gold</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="Speciality3" size="s">3rd Speciality</sp-field-label>
              <sp-picker id="Speciality3" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                <sp-menu-item value="Disable">Not Active</sp-menu-item>
                <sp-menu-item value='Green' >Green</sp-menu-item>
                <sp-menu-item value='Blue' >Blue</sp-menu-item>
                <sp-menu-item value='Purple' >Purple</sp-menu-item>
                <sp-menu-item value='Orange' >Orange</sp-menu-item>
                <sp-menu-item value='Gold' >Gold</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="Speciality4" size="s">4th Speciality</sp-field-label >
              <sp-picker id="Speciality4" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                <sp-menu-item value="Disable">Not Active</sp-menu-item>
                <sp-menu-item value='Green' >Green</sp-menu-item>
                <sp-menu-item value='Blue' >Blue</sp-menu-item>
                <sp-menu-item value='Purple' >Purple</sp-menu-item>
                <sp-menu-item value='Orange' >Orange</sp-menu-item>
                <sp-menu-item value='Gold' >Gold</sp-menu-item>
              </sp-picker>
            </div>
          </sp-field-group>
            <sp-table size="m" scroller="true" ${ref(this.tableRef)} >
                <sp-table-head>
                    <sp-table-head-cell sortable sort-direction="desc" sort-key="name">
                        Name
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable sort-direction="desc" sort-key="attack">
                        Attack
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable sort-direction="desc" sort-key="attackBuff">
                        Attack Buff
                    </sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        </div>
        `;
  }
}
