import { LitElement, html, type PropertyValues, type PropertyValueMap, nothing } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import { provide, createContext } from "@lit/context";

import {
  ClassEnum,
  GeneralArray,
  generalUseCase,
  levels,
  qualityColor,
  standardSkillBook,
  type ClassEnumType,
  type GeneralArrayType,
  type generalUseCaseType,
  type levelsType,
  type qualityColorType,
  type standardSkillBookType,
} from "@schemas/index";

export interface generalTypeAndUse {
  type: ClassEnumType,
  use: generalUseCaseType,
}

export interface generalInvestment {
  dragon: boolean,
  beast: boolean,
  ascending:  levelsType,
  speciality1: qualityColorType,
  speciality2: qualityColorType,
  speciality3: qualityColorType,
  speciality4: qualityColorType,
  extraBooks: standardSkillBookType[],
}

export const generals = createContext('generals');

export const typeAndUseMap = createContext('typeAndUseMap');

export const primaryInvestmentMap = createContext('primaryInvestmentMap');

export const secondaryInvestmentMap = createContext('secondaryInvestmentMap');

@customElement("table-container")
export class TableContainer extends LitElement {
    
  @state()
  _allGenerals: GeneralArrayType = [];

  @property({attribute: false})
  public allGenerals: string | null = null;

  
  @property({attribute: false})
  primaryInvestment: generalInvestment = {
    dragon: false,
    beast: false,
    ascending: levels.enum[0],
    speciality1: qualityColor.enum.Gold,
    speciality2: qualityColor.enum.Gold,
    speciality3: qualityColor.enum.Gold,
    speciality4: qualityColor.enum.Gold,
    extraBooks: [],
  }

  @property({attribute: false})
  secondaryInvestment: generalInvestment = {
    dragon: false,
    beast: false,
    ascending: levels.enum[0],
    speciality1: qualityColor.enum.Gold,
    speciality2: qualityColor.enum.Gold,
    speciality3: qualityColor.enum.Gold,
    speciality4: qualityColor.enum.Gold,
    extraBooks: [],
  }

  accessor tableName: string = '';

  constructor() {
    super();

  }
  
  protected willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.willUpdate(changedProperties)
    console.log(`tableContainer willUpdate`)
    if(changedProperties.has('allGenerals')){
      console.log(`change to allGenerals detected`)
      if(this.allGenerals !== null) {
        const go = JSON.parse(this.allGenerals);
        const result = GeneralArray.safeParse(go);
        if(result.success) {
          console.log(`success`);
          this._allGenerals = result.data;
        }
      }
    }
  }

  public render() {
    return html`
      ${when(this.allGenerals !== null, 
        () => {
          return html`
            allGenerals has data
          `
      },  () => nothing )}
    `
  }
  
}
