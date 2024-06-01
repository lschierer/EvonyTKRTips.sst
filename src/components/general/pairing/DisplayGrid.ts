import { fromFetch } from "rxjs/fetch";
import { from, map, concatMap, switchMap, throwError } from "rxjs";
import { z } from "zod";

import {
  GridApi,
  type GridOptions,
  createGrid,
  type ValueGetterParams,
  ModuleRegistry,
} from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import BaseAGCSSImport from 'ag-grid-community/styles/ag-grid.css?inline';
import AlpineImport from 'ag-grid-community/styles/ag-theme-alpine.css?inline';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { delay } from 'nanodelay';

const DEBUG = true;

import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { asyncAppend } from 'lit/directives/async-append.js';
import { ref } from 'lit/directives/ref.js';

import {
  SizedMixin,
  SpectrumElement,
  type CSSResultArray,
  html,
  css,
  unsafeCSS,
  type PropertyValues,
} from '@spectrum-web-components/base';

import '@spectrum-css/tokens/dist/index.css';
import '@spectrum-css/typography/dist/index.css';
import '@spectrum-css/icon/dist/index.css';
import '@spectrum-css/table/dist/index.css';

import {
  AscendingLevels,
  type BuffParamsType,
  qualityColor,
} from '@schemas/baseSchemas';

import {
  Display,
  GeneralClass,
  type GeneralClassType,
} from '@schemas/generalsSchema';

import { type GeneralPairType  } from '@schemas/ExtendedGeneral';

import {GridPair} from './GridPair';

@customElement('display-grid')
export class DisplayGrid extends SizedMixin(SpectrumElement, {
  noDefaultSize: true,
}) {
  @property({ type: String })
  public tableName = '';

  @property({ type: Object })
  public InvestmentLevel: BuffParamsType;

  @state()
  private sInvestment: BuffParamsType;

  @property({ type: Object })
  public RawPairs: GeneralPairType[] = new Array<GeneralPairType>();


  //private tableDivRef: Ref<HTMLElement> = createRef()

  private MutationObserver: MutationObserver;

  @state()
  private _DisplayPairs: GridPair[] = new Array<GridPair>();

  private gridOptions: GridOptions<GridPair> = {};

  private grid: GridApi<GridPair> | null = null;

  handleMutation(): void {
    return;
  }

  constructor() {
    super();

    this.MutationObserver = new MutationObserver(() => {
      this.handleMutation();
    });

    this.gridOptions = {
      // Data to be displayed
      rowData: [],
      // Columns to be displayed (Should match rowData properties)
      columnDefs: [
        {
          valueGetter: p => p.data.primaryId,
          headerName: 'Primary',
          filter: true,
        },
        {
          valueGetter: p => p.data.secondaryId,
          headerName: 'Secondary',
          filter: true,
        },
        {
          valueGetter: p => p.data.EvAnsRanking,
          headerName: 'EvAns Ranking',
        },
        {
          valueGetter: p => p.data.AttackRanking,
          headerName: 'Adjusted Attack Score',
        },
        {
          valueGetter: p => p.data.ToughnessRanking,
          headerName: 'Adjusted Toughness Score',
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
    };

    this.sInvestment = {
      special1: qualityColor.enum.Gold,
      special2: qualityColor.enum.Gold,
      special3: qualityColor.enum.Gold,
      special4: qualityColor.enum.Gold,
      special5: qualityColor.enum.Gold,
      stars: AscendingLevels.enum[0],
      dragon: false,
      beast: false,
    };
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    if (Array.isArray(this._DisplayPairs) && this._DisplayPairs.length > 0) {
      if (this.grid !== null && this.grid !== undefined) {
        this.grid.setGridOption('rowData', this._DisplayPairs);
      } else {
        if (DEBUG) {
          console.log(`firstUpdated: yes _DisplayPairs, no grid`);
        }
      }
    } else {
      if (DEBUG) {
        console.log(`firstUpdated _DisplayPairs is not populated`);
      }
    }
  }

  protected override async willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has('RawPairs')) {
      if (DEBUG) {
        console.log(`willUpdate called for RawPairs`);
      }
      if (Array.isArray(this.RawPairs) && this.RawPairs.length > 0) {
        this.RawPairs.forEach((pair) => {
          const dp = new GridPair(pair.primary, pair.secondary);
          if(dp !== null && dp !== undefined) {
            if(!dp.primaryId.localeCompare((pair.primary.name))){
              //if that works, the set appears to have worked
              this._DisplayPairs.push(dp);
            }
          }
        })
        this.requestUpdate('_DisplayPairs');
        if (this.grid !== null && this.grid !== undefined) {
          if (DEBUG) {
            console.log(`setting rowData from willUpdate on RawPairs`);
            console.log(`${this._DisplayPairs.length} pairs ready`);
          }
          this.grid.setGridOption('rowData', this._DisplayPairs);
          this.requestUpdate('grid');
        } else {
          if (DEBUG) {
            console.log(`willUpdate for RawPairs, grid was null`);
          }
        }
      } else {
        console.log(`DisplayGrid willUpdate called for RawPairs but no data`);
      }
    }
    if (_changedProperties.has('_DisplayPairs')) {
      if (this.grid !== null && this.grid !== undefined) {
        if (DEBUG) {
          console.log(`setting rowData from willUpdate on _DisplayPairs`);
          console.log(`${this._DisplayPairs.length} pairs ready`);
        }
        this.grid.setGridOption('rowData', this._DisplayPairs);
      } else {
        if (DEBUG) {
          console.log(`willUpdate for _DisplayPairs, grid was null`);
        }
      }
    }
  }

  public static override get styles(): CSSResultArray {
    const AGBaseCSS = unsafeCSS(BaseAGCSSImport);
    const AlpineCSS = unsafeCSS(AlpineImport);
    const localStyle = css`
      .ag-theme-alpine,
      .ag-theme-alpine-dark {
        --ag-icon-font-family: agGridAlpine;
      }

      .hidden {
        display: block;
      }
    `;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [...super.styles, AGBaseCSS, AlpineCSS, localStyle];
    } else {
      return [AGBaseCSS, AlpineCSS, localStyle];
    }
  }

  renderGrid(gridDiv?: Element) {
    if (gridDiv !== null && gridDiv !== undefined) {
      console.log(`gridDiv is ${gridDiv.localName}`);
      this.grid = createGrid(gridDiv as HTMLElement, this.gridOptions);
      if (Array.isArray(this._DisplayPairs) && this._DisplayPairs.length > 0) {
        this.grid.setGridOption('rowData', this._DisplayPairs);
      } else {
        if (DEBUG) {
          console.log(`renderGrid _DisplayPairs is not populated`);
        }
      }
    }
  }


  protected override render() {
    if (DEBUG) {
      console.log(`DisplayGrid render called`);
      console.log(`${this._DisplayPairs.length} pairs ready`);
    }

    return html`
      
      <div
        id="agdiv"
        class="ag-theme-alpine"
        style="height: 500px;"
        ${ref(this.renderGrid)}
      ></div>
    `;
  }
}
