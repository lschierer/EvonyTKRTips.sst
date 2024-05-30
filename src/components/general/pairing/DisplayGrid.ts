
import {
  GridApi,
  type GridOptions,
  createGrid,
} from 'ag-grid-community';
import BaseAGCSSImport from  "ag-grid-community/styles/ag-grid.css?inline";
import AlpineImport from "ag-grid-community/styles/ag-theme-alpine.css?inline";


import {delay} from 'nanodelay'

const DEBUG = true

import { customElement, property, state } from "lit/decorators.js"
import { ref } from "lit/directives/ref.js"

import {
  SizedMixin,
  SpectrumElement,
  type CSSResultArray,
  html,
  css,
  unsafeCSS,
  type PropertyValueMap,
} from "@spectrum-web-components/base"

import '@spectrum-css/tokens/dist/index.css';
import '@spectrum-css/typography/dist/index.css'
import '@spectrum-css/icon/dist/index.css';
import '@spectrum-css/table/dist/index.css'


import {
  AscendingLevels,
  type BuffParamsType,
  qualityColor,
} from "@schemas/baseSchemas";

import {
  Display,
  GeneralClass,
  type GeneralClassType,
} from '@schemas/generalsSchema';

import {
  type GeneralPairType as GeneralPairSchemaType,
  } from "@schemas/ExtendedGeneral";

import { GridGeneral } from './GridGeneral';

interface DisplayPair {
  primary: string;
  secondary: string;
  EvAnsRanking: number;
  AttackRanking: number;
  ToughnessRanking: number;
}

interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

@customElement('display-grid')
export class DisplayGrid extends SizedMixin( SpectrumElement, {
  noDefaultSize: true
}) {

  @property({ type: String })
  public tableName = ""

  @property({type: Object})
  public InvestmentLevel: BuffParamsType

  @state()
  private sInvestment: BuffParamsType

  @property({type: Object})
  public RawPairs: GeneralPairSchemaType[] = new Array<GeneralPairSchemaType>()

  @state()
  private _DisplayPairs: Array<DisplayPair> = new Array<DisplayPair>();

  //private tableDivRef: Ref<HTMLElement> = createRef()

  private MutationObserver: MutationObserver

  private gridOptions: GridOptions<DisplayPair> = {};

  private grid: GridApi<DisplayPair> | null = null;

  handleMutation(): void {
    return
  }

  constructor() {
    super()


    this.MutationObserver = new MutationObserver(() => {
      this.handleMutation()

    })

    this.gridOptions = {
      // Data to be displayed
      rowData: [ ],
      // Columns to be displayed (Should match rowData properties)
      columnDefs: [
        { 
          field: "primary",
          headerName: "Primary",
          filter: true
        },
        { 
          field: "secondary",
          headerName: "Secondary",
          filter: true
        },
        { 
          field: "EvAnsRanking",
          headerName: "EvAns Ranking"
        },
        { 
          field: "AttackRanking",
          headerName: "Adjusted Attack Score"
        },
        { 
          field: "ToughnessRanking",
          headerName: "Adjusted Toughness Score"
        },
      ],
      defaultColDef: {
        flex: 1,
      },
    };

    this.InvestmentLevel = {
      special1: qualityColor.enum.Gold,
      special2: qualityColor.enum.Gold,
      special3: qualityColor.enum.Gold,
      special4: qualityColor.enum.Gold,
      special5: qualityColor.enum.Gold,
      stars: AscendingLevels.enum[0],
      dragon: false,
      beast: false,
    }

    this.sInvestment = {
      special1: qualityColor.enum.Gold,
      special2: qualityColor.enum.Gold,
      special3: qualityColor.enum.Gold,
      special4: qualityColor.enum.Gold,
      special5: qualityColor.enum.Gold,
      stars: AscendingLevels.enum[0],
      dragon: false,
      beast: false,
    }
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    if(Array.isArray(this._DisplayPairs) && this._DisplayPairs.length > 0) {
      if(this.grid !== null && this.grid !== undefined) {
        this.grid.setGridOption('rowData', this._DisplayPairs)
      } else {
        if(DEBUG) {
          console.log(`firstUpdated: yes _DisplayPairs, no grid`)
        }
      }
    } else {
      if(DEBUG) {
        console.log(`firstUpdated _DisplayPairs is not populated`)
      }
    }
  }
  
  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.willUpdate(_changedProperties)
    if(_changedProperties.has('RawPairs')){
      if(DEBUG) {
        console.log(`willUpdate called for RawPairs`)
      }
      if(Array.isArray(this.RawPairs) && this.RawPairs.length > 0){
        this.RawPairs.map((rp) => {
          if(rp !== undefined && rp !== null) {
            const pGridG = new GridGeneral();
            pGridG.generalId = rp.primary.name;
            pGridG.InvestmentLevel = this.InvestmentLevel;
            const sGridG = new GridGeneral();
            sGridG.generalId = rp.secondary.name;
            sGridG.InvestmentLevel = this.sInvestment;
            const pushable: DisplayPair = {
              primary: rp.primary.name,
              secondary: rp.secondary.name,
              EvAnsRanking: 0,
              AttackRanking: 0,
              ToughnessRanking: 0,
            }
            this._DisplayPairs.push(pushable)
            if(DEBUG) {
              console.log(`willupdate RawPairs pushed, ${this._DisplayPairs.length}`)
            }
          }
        })
        this.requestUpdate('_DisplayPairs');
        if(this.grid !== null && this.grid !== undefined){
          if(DEBUG) {
            console.log(`setting rowdata from willUpdate on RawPairs`)
            console.log(`${this._DisplayPairs.length} pairs ready`)
          }
          this.grid.setGridOption('rowData', this._DisplayPairs)
          this.requestUpdate('grid');
        }else {
          if(DEBUG) {
            console.log(`willUpdate for RawPairs, grid was null`)
          }
        }
      } else {
        console.log(`DisplayGrid willupdate called for RawPairs but no data`)
      }
    }
    if(_changedProperties.has('_DisplayPairs')) {
      if(this.grid !== null && this.grid !== undefined){
        if(DEBUG) {
          console.log(`setting rowdata from willUpdate on _DisplayPairs`)
          console.log(`${this._DisplayPairs.length} pairs ready`)
        }
        this.grid.setGridOption('rowData', this._DisplayPairs)
        this.requestUpdate('grid');
      }else {
        if(DEBUG) {
          console.log(`willUpdate for _DisplayPairs, grid was null`)
        }
        await delay(10).then(() => {
          this.requestUpdate('_DisplayPairs')
        })
      }
    }
  }

  public static override get styles(): CSSResultArray {
    const AGBaseCSS = unsafeCSS(BaseAGCSSImport)
    const AlpineCSS = unsafeCSS(AlpineImport)
    const localStyle = css`
    .ag-theme-alpine, .ag-theme-alpine-dark {
      --ag-icon-font-family: agGridAlpine;
    }
    `;
    if(super.styles !== undefined && Array.isArray(super.styles)) {
      return [
        ...super.styles, 
        AGBaseCSS, 
        AlpineCSS,
        localStyle]
    } else {
      return [
        AGBaseCSS, 
        AlpineCSS,
        localStyle
      ]
    }
  }
  
  renderGrid(gridDiv?: Element) {
    if(gridDiv !== null && gridDiv !== undefined) {
      console.log(`gridDiv is ${gridDiv.localName}`)
      this.grid = createGrid((gridDiv as HTMLElement),this.gridOptions,)
      if(Array.isArray(this._DisplayPairs) && this._DisplayPairs.length > 0) {
        this.grid.setGridOption('rowData', this._DisplayPairs)
      } else {
        if(DEBUG) {
          console.log(`renderGrid _DisplayPairs is not populated`)
        }
      }
    }
  }

  protected override render() {
    if(DEBUG){
      console.log(`DisplayGrid render called`)
      console.log(`${this._DisplayPairs.length} pairs ready`)
    }
    return html`
      DisplayGrid
      <div
        id='agdiv'
        class="ag-theme-alpine" style="height: 500px;"
        ${ref(this.renderGrid)}
      ></div>
      
    `
  }

}
