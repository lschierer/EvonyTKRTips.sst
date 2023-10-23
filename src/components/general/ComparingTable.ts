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
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import {
  BuffAdverbs,
  type BuffAdverbsType,
  type BuffAdverbArrayType,
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

import {buff} from "@components/general/buff.ts";

const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

const tableGeneral = z.object({
  name: z.string(),
  attack: z.number(),
  defense: z.number(),
  hp: z.number(),
  attackBuff: z.number(),
  hpBuff: z.number(),
  defenseBuff: z.number(),
  unitClass: troopClass.nullish(),
})

type tableGeneralType = z.infer<typeof tableGeneral>;

type generalRecord = Record<string, tableGeneralType>;

export const generalUseCase = z.enum([
  "Monsters",
  "Attack",
  "Defense",
  "Overall",
  "Wall",
  "Mayors"
]);
export type generalUseCaseType = z.infer<typeof generalUseCase>;

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
  protected buffAdverbs: BuffAdverbArrayType;
  
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
  
  @state()
  protected useCase: generalUseCaseType | string = 'all';

  constructor() {
    super();
    
    this.buffAdverbs = [
      BuffAdverbs.enum.Attacking,
      BuffAdverbs.enum.Marching,
      BuffAdverbs.enum.When_Rallying,
      BuffAdverbs.enum.leading_the_army_to_attack,
      BuffAdverbs.enum.dragon_to_the_attack,
      BuffAdverbs.enum.Reinforcing,
      BuffAdverbs.enum.Defending,
    ];
    this.dataUrl = 'http://localhost';
    this._dataUrl = new URL(this.dataUrl)
    this.generalRecords = new Array<Record<string,tableGeneralType>>();
    
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
              <sp-table-cell role='gridcell' dir='ltr' id='name'  >${general.name}</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='attack' >${general.attack.toFixed(2)}</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='hp' >${general.hp.toFixed(2)}</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='defense' >${general.defense.toFixed(2)}</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='attackBuff' >${general.attackBuff.toFixed(1)}%</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='HPBuff' >${general.hpBuff.toFixed(1)}%</sp-table-cell>
              <sp-table-cell role='gridcell' dir='ltr' id='defenseBuff' >${general.defenseBuff.toFixed(1)}%</sp-table-cell>
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
              case 'hp':
                if(ga.hp === gb.hp) {
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                    (ga.hp < gb.hp ? -1 : 1) :
                    (ga.hp < gb.hp ? 1 : -1);
                }
              case 'defense':
                if(ga.defense === gb.defense) {
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                    (ga.defense < gb.defense ? -1 : 1) :
                    (ga.defense < gb.defense ? 1 : -1);
                }
              case 'attackBuff':
                if(ga.attackBuff === gb.attackBuff){
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                      (ga.attackBuff < gb.attackBuff ? -1 : 1) :
                      (ga.attackBuff < gb.attackBuff ? 1 : -1);
                }
              case 'HPBuff':
                if(ga.hpBuff === gb.hpBuff){
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                    (ga.hpBuff < gb.hpBuff ? -1 : 1) :
                    (ga.hpBuff < gb.hpBuff ? 1 : -1);
                }
              case 'defenseBuff':
                if(ga.hpBuff === gb.defenseBuff){
                  return 0;
                } else {
                  return sortDirection === 'asc' ?
                    (ga.defenseBuff < gb.defenseBuff ? -1 : 1) :
                    (ga.defenseBuff < gb.defenseBuff ? 1 : -1);
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
    if(this.table !== undefined && this.table !== null ) {
      this.table.items = this.generalRecords;
      this.table.requestUpdate();
    }
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
            console.log(`processGenerals; buffAdverbs: ${JSON.stringify(this.buffAdverbs)}`)
            const {attackBuff, defenseBuff, hpBuff} = buff(go.general,this.buffAdverbs, props);
            items.push({'general': {
              name: go.general.name,
              attack: (go.general.attack + go.general.attack_increment * 45),
              defense: (go.general.defense + go.general.defense_increment * 45),
              hp: (go.general.leadership + go.general.leadership_increment * 45),
              attackBuff: attackBuff,
              hpBuff: hpBuff,
              defenseBuff: defenseBuff,
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
      const validation = levelSchema.safeParse(picker.value);
      if(validation.success) {
        this.ascending = validation.data;
      }
    }else if (!picker.id.localeCompare('Speciality1')) {
      const validation = qualitySchema.safeParse(picker.value);
      if(validation.success) {
        console.log(`changeHandler; Speciality1; success: ${validation.data}`)
        this.Speciality1 = validation.data;
      } else {
        console.log(`changeHandler; Speciality1; error: ${validation.error}`)
      }
    } else if (!picker.id.localeCompare('Speciality2')) {
      const validation = qualitySchema.safeParse(picker.value);
      if(validation.success) {
        this.Speciality2 = validation.data;
      }
    } else if (!picker.id.localeCompare('Speciality3')) {
      const validation = qualitySchema.safeParse(picker.value);
      if(validation.success) {
        this.Speciality3 = validation.data;
      }
    } else if (!picker.id.localeCompare('Speciality4')) {
      const validation = qualitySchema.safeParse(picker.value);
      if(validation.success) {
        this.Speciality4 = validation.data;
      }
    } else if (!picker.id.localeCompare('unitClass')) {
      const validation = troopClass.safeParse(picker.value);
      if(validation.success) {
        this.unitClass = validation.data;
      }
    } else if(!picker.id.localeCompare('generalUse')) {
      const validation = generalUseCase.safeParse(picker.value);
      if(validation.success) {
        this.useCase = validation.data;
      } else {
        this.useCase = 'all';
      }
      switch (this.useCase) {
        case generalUseCase.enum.Monsters:
          this.buffAdverbs = [
            BuffAdverbs.enum.Attacking,
            BuffAdverbs.enum.Marching,
            BuffAdverbs.enum.When_Rallying,
            BuffAdverbs.enum.dragon_to_the_attack,
            BuffAdverbs.enum.leading_the_army_to_attack,
            BuffAdverbs.enum.Against_Monsters,
            BuffAdverbs.enum.Reduces_Monster,
          ]
          break;
        case generalUseCase.enum.Attack:
          this.buffAdverbs = [
            BuffAdverbs.enum.Attacking,
            BuffAdverbs.enum.Marching,
            BuffAdverbs.enum.dragon_to_the_attack,
            BuffAdverbs.enum.leading_the_army_to_attack,
            BuffAdverbs.enum.Reduces_Enemy,
            BuffAdverbs.enum.Enemy,
          ];
          break;
        case generalUseCase.enum.Defense:
          this.buffAdverbs = [
            BuffAdverbs.enum.Reinforcing,
            BuffAdverbs.enum.Defending,
            BuffAdverbs.enum.Reduces_Enemy,
            BuffAdverbs.enum.Enemy,
          ];
          break;
        case generalUseCase.enum.Overall:
          this.buffAdverbs = [
            BuffAdverbs.enum.Reduces_Enemy,
            BuffAdverbs.enum.Enemy,
          ];
          break;
        case generalUseCase.enum.Wall:
          this.buffAdverbs = [
            BuffAdverbs.enum.Reduces_Enemy,
            BuffAdverbs.enum.Enemy,
            BuffAdverbs.enum.Defending,
            BuffAdverbs.enum.When_The_Main_Defense_General,
            BuffAdverbs.enum.In_City,
          ];
          break;
        case generalUseCase.enum.Mayors:
          this.buffAdverbs = [
            BuffAdverbs.enum.Reduces_Enemy,
            BuffAdverbs.enum.Enemy,
            BuffAdverbs.enum.When_the_City_Mayor,
          ];
          break;
        default:
          this.buffAdverbs = [
            BuffAdverbs.enum.Attacking,
            BuffAdverbs.enum.Marching,
            BuffAdverbs.enum.When_Rallying,
            BuffAdverbs.enum.dragon_to_the_attack,
            BuffAdverbs.enum.leading_the_army_to_attack,
            BuffAdverbs.enum.Reinforcing,
            BuffAdverbs.enum.Defending,
          ];
      }
    } else   {
      console.log(`picker id is ${picker.id}`)
    }
    this.processGenerals();
  }
  
  static styles = css`
    .sp-table-container {
      & sp-table {
        background-color: var(--spectrum-cyan-600);
        min-height: var(--spectrum-global-dimension-size-300);
        
        & sp-table-body {
          min-height: var(--spectrum-global-dimension-size-200);
        }
      }
    }
    div.fieldGroup {
      border: 1px solid var(--spectrum-cyan-600);
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
    let tableHtml = html``;
    switch (this.useCase) {
      case generalUseCase.enum.Wall:
        tableHtml = html`${tableHtml}
        <sp-table size="m" scroller="true" ${ref(this.tableRef)}>
          <sp-table-head>
            <sp-table-head-cell sortable sort-direction="desc" sort-key="name">
              Name
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="AD">
              Generic Attack Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="DD">
              Generic Defense Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="HD">
              Generic HP Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="GAD">
              Ground Attack Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="GDD">
              Ground Defense Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="GHD">
              Ground HP Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="MAD">
              Mounted Attack Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="MDD">
              Mounted Defense Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="MHD">
              Mounted HP Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="AAD">
              Archer Attack Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="ADD">
              Archer Defense Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="AHD">
              Archer HP Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="SAD">
              Siege Attack Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="SDD">
              Siege Defense Debuff
            </sp-table-head-cell>
            <sp-table-head-cell sortable-sort-direction="desc" sort-key="SHD">
              Siege HP Debuff
            </sp-table-head-cell>
          </sp-table-head>
        </sp-table>
        `;
        if(this.table !== undefined && this.table !== null) {
          this.table.requestUpdate();
        }
        break;
      default:
        tableHtml = html`${tableHtml}
        <sp-table size="m" scroller="true" ${ref(this.tableRef)}>
          <sp-table-head>
            <sp-table-head-cell sortable sort-direction="desc" sort-key="name">
              Name
            </sp-table-head-cell>
            <sp-table-head-cell sortable sort-direction="desc" sort-key="attack">
              Attack
            </sp-table-head-cell>
            <sp-table-head-cell sortable sort-direction="desc" sort-key="hp">
              HP
            </sp-table-head-cell>
            <sp-table-head-cell sortable sort-direction="desc" sort-key="defense">
              Defense
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
        if(this.table !== undefined && this.table !== null) {
          this.table.requestUpdate();
        }
    }


    return html`
      <div class="sp-table-container">
        <div class="fieldGroup">
          <sp-field-group horizontal>
            <sp-help-text slot="help-text">Which generals are you interested in?</sp-help-text>
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
            <div>
              <sp-field-label for="generalUse" size="s">
                General Use Case
                <sp-tooltip placement="right-end" self-managed variant="info">Some buffs apply only in certain
                  use cases. This determines which buffs will be used to determine the general's attributes. Wall
                  Generals and SubCity Mayors are sufficiently different as to require a totally different table.
                </sp-tooltip>
              </sp-field-label>
              <sp-picker id="generalUse" size="s" label="All" value="all" @change=${this.changeHandler}>
                <sp-menu-item value="all">All Generals</sp-menu-item>
                <sp-menu-item value=${generalUseCase.enum.Monsters}>Monster Hunting</sp-menu-item>
                <sp-menu-item value=${generalUseCase.enum.Attack}>Attacking Only</sp-menu-item>
                <sp-menu-item value=${generalUseCase.enum.Defense}>Reinforcing and Defending</sp-menu-item>
                <sp-menu-item value=${generalUseCase.enum.Overall}>All Purpose</sp-menu-item>
                <sp-menu-divider size="s"></sp-menu-divider>
                <sp-menu-item disabled>Wall Generals</sp-menu-item>
                <sp-menu-item disabled>SubCity Mayors</sp-menu-item>

              </sp-picker>
            </div>
          </sp-field-group>
        </div>
        <div class="fieldGroup">
          <sp-field-group horizontal>
            <sp-help-text slot="help-text">Indicate your investment level in the generals.</sp-help-text>
            <div>
              <sp-field-label for="ascending" size="s">Ascending Level</sp-field-label>
              <sp-picker id="ascending" size="s" label="5" value='10' @change=${this.changeHandler}>
                <sp-menu-item value='5'>0</sp-menu-item>
                >
                <sp-menu-item value='6'>1</sp-menu-item>
                <sp-menu-item value='7'>2</sp-menu-item>
                <sp-menu-item value='8'>3</sp-menu-item>
                <sp-menu-item value='9'>4</sp-menu-item>
                <sp-menu-item value='10'>5</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="Speciality1" size="s">1st Speciality</sp-field-label>
              <sp-picker id="Speciality1" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                <sp-menu-item value=${qualitySchema.enum.Disabled}>Not Active</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Green}>Green</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Blue}>Blue</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Purple}>Purple</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Orange}>Orange</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Gold}>Gold</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="Speciality2" size="s">2nd Speciality</sp-field-label>
              <sp-picker id="Speciality2" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                <sp-menu-item value=${qualitySchema.enum.Disabled}>Not Active</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Green}>Green</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Blue}>Blue</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Purple}>Purple</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Orange}>Orange</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Gold}>Gold</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="Speciality3" size="s">3rd Speciality</sp-field-label>
              <sp-picker id="Speciality3" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                <sp-menu-item value=${qualitySchema.enum.Disabled}>Not Active</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Green}>Green</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Blue}>Blue</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Purple}>Purple</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Orange}>Orange</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Gold}>Gold</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="Speciality4" size="s">4th Speciality</sp-field-label>
              <sp-picker id="Speciality4" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                <sp-menu-item value=${qualitySchema.enum.Disabled}>Not Active</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Green}>Green</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Blue}>Blue</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Purple}>Purple</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Orange}>Orange</sp-menu-item>
                <sp-menu-item value=${qualitySchema.enum.Gold}>Gold</sp-menu-item>
              </sp-picker>
            </div>
          </sp-field-group>
        </div>
        ${tableHtml}
      </div>
    `;
  }
}
