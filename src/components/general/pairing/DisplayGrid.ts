import {
  GridApi,
  type GridOptions,
  createGrid,
  type ValueGetterParams,
} from 'ag-grid-community';
import BaseAGCSSImport from "ag-grid-community/styles/ag-grid.css?inline";
import AlpineImport from "ag-grid-community/styles/ag-theme-alpine.css?inline";


import {delay} from 'nanodelay'

const DEBUG = true

import {customElement, property, state} from "lit/decorators.js"
import {repeat} from 'lit/directives/repeat.js';
import {asyncAppend} from 'lit/directives/async-append.js';
import {ref} from "lit/directives/ref.js"

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

import {GridGeneral} from './GridGeneral';

interface DisplayPair {
  primary: GridGeneral
  secondary: GridGeneral
  EvAnsRanking: number
  AttackRanking: number
  ToughnessRanking: number
}

@customElement('display-grid')
export class DisplayGrid extends SizedMixin(SpectrumElement, {
  noDefaultSize: true
}) {

  @property({type: String})
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

  private gridGetPrimaryName = (params: ValueGetterParams) => {
    if (params !== null && params !== undefined) {
      if (params.data !== null && params.data !== undefined) {
        if (params.data.primary !== null && params.data.primary !== undefined) {
          if (params.data.primary.general !== null && params.data.primary.general !== undefined) {
            if (params.data.primary.general.name !== null && params.data.primary.general.name !== undefined) {
              return params.data.primary.general.name
            } else {
              return '1'
            }
          } else {
            return '2'
          }
        } else {
          return '3'
        }
      } else {
        return '4'
      }
    } else {
      return '5'
    }
  }

  private gridGetSecondaryName = (params: ValueGetterParams) => {
    if (params !== null && params !== undefined) {
      if (params.data !== null && params.data !== undefined) {
        if (params.data.secondary !== null && params.data.secondary !== undefined) {
          if (params.data.secondary.general !== null && params.data.secondary.general !== undefined) {
            if (params.data.secondary.general.name !== null && params.data.secondary.general.name !== undefined) {
              return params.data.secondary.general.name
            } else {
              return '1'
            }
          } else if (
            params.data.secondary.generalId !== null &&
            params.data.secondary.generalId !== undefined
          ) {
            return params.data.secondary.generalId
          } else {
            return '2'
          }
        } else {
          return '3'
        }
      } else {
        return '4'
      }
    } else {
      return '5'
    }
  }

  constructor() {
    super();

    this.MutationObserver = new MutationObserver(() => {
      this.handleMutation()

    })

    this.gridOptions = {
      // Data to be displayed
      rowData: [],
      // Columns to be displayed (Should match rowData properties)
      columnDefs: [
        {
          valueGetter: this.gridGetPrimaryName,
          headerName: "Primary",
          filter: true
        },
        {
          valueGetter: this.gridGetSecondaryName,
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
    if (Array.isArray(this._DisplayPairs) && this._DisplayPairs.length > 0) {
      if (this.grid !== null && this.grid !== undefined) {
        this.grid.setGridOption('rowData', this._DisplayPairs)
      } else {
        if (DEBUG) {
          console.log(`firstUpdated: yes _DisplayPairs, no grid`)
        }
      }
    } else {
      if (DEBUG) {
        console.log(`firstUpdated _DisplayPairs is not populated`)
      }
    }
  }

  protected async willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.willUpdate(_changedProperties)
    if (_changedProperties.has('RawPairs')) {
      if (DEBUG) {
        console.log(`willUpdate called for RawPairs`)
      }
      if (Array.isArray(this.RawPairs) && this.RawPairs.length > 0) {

        this.requestUpdate('_DisplayPairs');
        if (this.grid !== null && this.grid !== undefined) {
          if (DEBUG) {
            console.log(`setting rowdata from willUpdate on RawPairs`)
            console.log(`${this._DisplayPairs.length} pairs ready`)
          }
          this.grid.setGridOption('rowData', this._DisplayPairs)
          this.requestUpdate('grid');
        } else {
          if (DEBUG) {
            console.log(`willUpdate for RawPairs, grid was null`)
          }
        }
      } else {
        console.log(`DisplayGrid willupdate called for RawPairs but no data`)
      }
    }
    if (_changedProperties.has('_DisplayPairs')) {
      if (this.grid !== null && this.grid !== undefined) {
        if (DEBUG) {
          console.log(`setting rowdata from willUpdate on _DisplayPairs`)
          console.log(`${this._DisplayPairs.length} pairs ready`)
        }
        this._DisplayPairs.forEach((dp) => {
          const pEvAnsRanking = dp.primary
        })
        this.grid.setGridOption('rowData', this._DisplayPairs)
      } else {
        if (DEBUG) {
          console.log(`willUpdate for _DisplayPairs, grid was null`)
        }
      }
    }
  }

  private registerDP = (dp?: GridElement) => {
    if (dp !== null && dp !== undefined) {
      const present = this._DisplayPairs.some((test) => {
        if (!test.primary.generalId.localeCompare(dp.primary.generalId)) {
          if (!test.secondary.generalId.localeCompare(dp.secondary.generalId)) {
            return true;
          }
        }
        return false;
      })
      if (!present) {
        this._DisplayPairs.push(dp)
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
      
      .hidden {
        display: none;
      }
    `;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
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
    if (gridDiv !== null && gridDiv !== undefined) {
      console.log(`gridDiv is ${gridDiv.localName}`)
      this.grid = createGrid((gridDiv as HTMLElement), this.gridOptions,)
      if (Array.isArray(this._DisplayPairs) && this._DisplayPairs.length > 0) {
        this.grid.setGridOption('rowData', this._DisplayPairs);
      } else {
        if (DEBUG) {
          console.log(`renderGrid _DisplayPairs is not populated`)
        }
      }
    }
  }


  private rawPairIndex = 0;
  private async* renderRawPairs(count: number) {
    for (let i = 0; i < count; i++) {
      const rp = this.RawPairs[this.rawPairIndex];
      this.rawPairIndex++
      yield html`
        p:
        <grid-general 
          generalId=${rp.primary.name} 
          InvestmentLevel=${this.InvestmentLevel}
          ${ref(this.regiserDP)}></grid-general>
        s:
        <grid-general 
          generalId=${rp.secondary.name}
          InvestmentLevel=${this.sInvestment}
          ${ref(this.regiserDP)}></grid-general>
      `
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  protected override render() {
    if (DEBUG) {
      console.log(`DisplayGrid render called`)
      console.log(`${this._DisplayPairs.length} pairs ready`)
    }

    const gridItems = [];
    for (let i = 0; i < this.RawPairs.length; i += 10) {
      gridItems.push(html`
        ${asyncAppend(this.renderRawPairs(10), (v) => html`${v}`)}
      `)
    }

    return html`
      <div class="hidden non-content">
        ${gridItems}
      </div>
      <div
        id='agdiv'
        class="ag-theme-alpine" style="height: 500px;"
        ${ref(this.renderGrid)}
      ></div>

    `
  }

}
