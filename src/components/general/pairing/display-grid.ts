
import { delay } from "nanodelay"

import {
  AscendingLevels,
  type BuffType,
  type BuffParamsType,
  ClassEnum,
  type ClassEnumType,
  Condition,
  type levelsType,
  qualityColor,
  type qualityColorType,
  syslogSeverity,
} from "@schemas/baseSchemas";

import {
  ConflictArray, 
  ConflictDatum,   
  type bookConflictsType,
  type ConflictDatumType,
 } from '@schemas/conflictSchemas'

 import {
  Note,
  Display,
  type NoteType,
  GeneralArray,
  type GeneralClassType,
  GeneralElement,
  type GeneralArrayType,
  type GeneralElementType,
  generalSpecialists,
  type generalUseCaseType,
 } from '@schemas/generalsSchema'

 import { 
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type GeneralPairType as GeneralPairSchemaType,
  } from "@schemas/ExtendedGeneral";

import { 
  type BookType,
  specialSkillBook,
  standardSkillBook,
  type specialSkillBookType,
  type standardSkillBookType,
 } from "@schemas/bookSchemas";

import { 
  type ColDef,
  type ColGroupDef,
  GridApi,
  type GridOptions,
  ModuleRegistry,
  createGrid,
} from 'ag-grid-community';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import BaseAGCSSImport from  "@ag-grid-community/styles/ag-grid.css?inline";
import QuartzImport from "@ag-grid-community/styles/ag-theme-quartz.css?inline";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const DEBUG = true

import { nothing } from 'lit'
import { customElement, property, state } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import {when} from 'lit/directives/when.js'

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

interface GeneralPairType {
  primary: string;
  secondary: string;
  EvAnsRanking: number;
  AttackRanking: number;
  DefenseRanking: number;
}

interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

@customElement('display-grid')
export class DisplayGrid extends SizedMixin(SpectrumElement, {
  noDefaultSize: true
}) {

  @property({ type: String })
  public tableName = ""

  @property({type: Object})
  public InvestmentLevel: BuffParamsType

  @property({type: Object})
  public DisplayPairs: GeneralPairSchemaType[] = new Array<GeneralPairSchemaType>()

  //private tableDivRef: Ref<HTMLElement> = createRef()

  private MutationObserver: MutationObserver

  private gridOptions: GridOptions<IRow> = {};

  private grid: GridApi<IRow> | null = null;
  handleMutation(): void {
    return
  }

  constructor() {
    super()


    this.MutationObserver = new MutationObserver(() => {
      this.handleMutation()

      this.gridOptions = {
        // Data to be displayed
        rowData: [
          { make: "Tesla", model: "Model Y", price: 64950, electric: true },
          { make: "Ford", model: "F-Series", price: 33850, electric: false },
          { make: "Toyota", model: "Corolla", price: 29600, electric: false },
          { make: "Mercedes", model: "EQA", price: 48890, electric: true },
          { make: "Fiat", model: "500", price: 15774, electric: false },
          { make: "Nissan", model: "Juke", price: 20675, electric: false },
        ],
        // Columns to be displayed (Should match rowData properties)
        columnDefs: [
          { field: "make" },
          { field: "model" },
          { field: "price" },
          { field: "electric" },
        ],
        defaultColDef: {
          flex: 1,
        },
      };

    })

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
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    
  }
  
  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(_changedProperties)
    
  }

  public static override get styles(): CSSResultArray {
    const AGBaseCSS = unsafeCSS(BaseAGCSSImport)
    const QuartzCSS = unsafeCSS(QuartzImport)
    const localStyle = css``;
    if(super.styles !== undefined && Array.isArray(super.styles)) {
      return [...super.styles, AGBaseCSS, QuartzCSS,localStyle]
    } else {
      return [AGBaseCSS, QuartzCSS,localStyle]
    }
  }
  
  renderGrid(gridDiv?: Element) {
    if(gridDiv !== null && gridDiv !== undefined) {
      console.log(`gridDiv is ${gridDiv.localName}`)
      this.grid = createGrid((gridDiv as HTMLElement),this.gridOptions,)
      
    }
  }

  protected override render() {
    
    return html`
      <div
        id='agdiv'
        class="ag-theme-quartz" style="height: 500px"
        ${ref(this.renderGrid)}
      ></div>
      <ol>
        ${this.DisplayPairs.map((pair) => html`
        <li><dl>
          <dt><span class="spectrum-Body spectrum-Body--sizeM"><strong>Primary:</strong>${pair.primary}</span></dt>
          <dd><span class="spectrum-Body spectrum-Body--sizeM"><strong>Secondary:</strong>${pair.secondary}</span></dd>
        </dl></li>
        ` 
        )}
      </ol>
    `
  }

}
