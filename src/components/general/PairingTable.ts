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

import {InterestSelector} from './InterestSelector.ts';
import {InvestmentSelector} from './InvestmentSelector.ts';

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
  troopClass,
  type troopClassType,
} from "@schemas/evonySchemas.ts";

const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

@customElement('pairing-table')
export class PairingTable extends SpectrumElement {

  @state()
  private allGenerals: generalArrayType;

  @state()
  protected ascending: levelSchemaType = '10';

  @state()
  protected buffAdverbs: BuffAdverbArrayType;

  @property({type: String})
  public dataUrl: string;
  
  @state()
  private _dataUrl: URL;

  @state()
  protected filteredGenerals: generalArrayType;

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
      if (this.table !== undefined && this.table !== null) {
        console.log(`willUpdate; I have a table`);
        if (this.table.items !== undefined && this.table.items !== null && this.table.items.length === 0) {
          console.log(`willUpdate; I need records`);
          this.processGenerals();
          
        }
      }
    }
  }

  private processGenerals() {
    console.log(`processGenerals; start unitClass ${this.unitClass}`)
    this.filteredGenerals = this.allGenerals.filter((g: generalObject) => {
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
  }

  public changeHandler(e: CustomEvent) {
    console.log(`changeHandler; start`)

    if (e === undefined || e === null) {
      console.log(`event is undefined`)
      return;
    }
    console.log(`changeHandler; event ${JSON.stringify(e.detail)}`)
    const id = e.detail.id;
    const value = e.detail.value;
    let validation;
    switch (id) {
      case 'ascending':
        validation = levelSchema.safeParse(value);
        break;
      case 'unitClass':
        validation = troopClass.safeParse(value);
        break;
      case 'generalUse':
        validation = generalUseCase.safeParse(value);
        break;
      case 'Speciality1':
      case 'Speciality2':
      case 'Speciality3':
      case 'Speciality4':
        validation = qualitySchema.safeParse(value);
        break;
      default:
        console.log(`changeHandler; picker id is ${id}`)
        validation = null;
    }
    if (validation !== null) {
      console.log(`changeHandler; validation not null`)
      if(validation.success) {
        console.log(`changeHandler; validation success`)
        switch (id) {
          case 'ascending':
            this.ascending = validation.data;
            break;
          case 'unitClass':
            this.unitClass = validation.data;
            console.log(`changeHandler; unitClass ${this.unitClass} from ${validation.data}`)
            break;
          case 'generalUse':
            this.useCase = validation.data;
            const adverbs: {[key: generalUseCaseType]: BuffAdverbArrayType} = {
              [generalUseCase.enum.Monsters]: [
                BuffAdverbs.enum.Attacking,
                BuffAdverbs.enum.Marching,
                BuffAdverbs.enum.When_Rallying,
                BuffAdverbs.enum.dragon_to_the_attack,
                BuffAdverbs.enum.leading_the_army_to_attack,
                BuffAdverbs.enum.Against_Monsters,
                BuffAdverbs.enum.Reduces_Monster,
              ],
              [generalUseCase.enum.Attack]: [
                BuffAdverbs.enum.Attacking,
                BuffAdverbs.enum.Marching,
                BuffAdverbs.enum.dragon_to_the_attack,
                BuffAdverbs.enum.leading_the_army_to_attack,
                BuffAdverbs.enum.Reduces_Enemy,
                BuffAdverbs.enum.Enemy,
              ],
              [generalUseCase.enum.Defense]: [
                BuffAdverbs.enum.Reinforcing,
                BuffAdverbs.enum.Defending,
                BuffAdverbs.enum.Reduces_Enemy,
                BuffAdverbs.enum.Enemy,
              ],
              [generalUseCase.enum.Overall]: [
                BuffAdverbs.enum.Reduces_Enemy,
                BuffAdverbs.enum.Enemy,
              ],
              [generalUseCase.enum.Wall]: [
                BuffAdverbs.enum.Reduces_Enemy,
                BuffAdverbs.enum.Enemy,
                BuffAdverbs.enum.Defending,
                BuffAdverbs.enum.When_The_Main_Defense_General,
                BuffAdverbs.enum.In_City,
              ],
              [generalUseCase.enum.Mayors]: [
                BuffAdverbs.enum.Reduces_Enemy,
                BuffAdverbs.enum.Enemy,
                BuffAdverbs.enum.When_the_City_Mayor,
              ],
            }
            this.buffAdverbs = adverbs[this.useCase];

            break;
          case 'Speciality1':
            this.Speciality1 = validation.data;
            break;
          case 'Speciality2':
            this.Speciality2 = validation.data;
            break;
          case 'Speciality3':
            this.Speciality3 = validation.data;
            break;
          case 'Speciality4':
            this.Speciality4 = validation.data;
            break;
          default:
            console.log(`changeHandler; this should not happen;`)
        }
      } else if(!id.localeCompare('generalUse') && (! validation.success)) {
        this.useCase = 'all';
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
    }
    this.processGenerals();
  }

  public render() {
    return html`
      test
      <div class="sp-table-container">
        <interest-selector @PickerChanged=${this.changeHandler}></interest-selector>
        <investment-selector @PickerChanged=${this.changeHandler}></investment-selector>
      </div>
    `
  }

}



