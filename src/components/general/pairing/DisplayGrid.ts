import { fromFetch } from 'rxjs/fetch';
import { BehaviorSubject, from, map, concatMap, switchMap, throwError } from 'rxjs';
import { z } from 'zod';

import {
  GridApi,
  type GridOptions,
  createGrid,
  type GridReadyEvent,
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
  generalRole,
  type generalRoleType,
} from '@schemas/generalsSchema';

import { type GeneralPairType } from '@schemas/ExtendedGeneral';

import { GridPair } from './GridPair';

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

  // @ts-ignore
  private grid: GridApi<GridPair>;

  handleMutation(): void {
    return;
  }

  private async getData() {
    const currentPage = `${document.location.protocol}//${document.location.host}`;
    const batchLimit = 10;
    let newRows: GridPair[] = new Array<GridPair>();
    let batch: GeneralPairType[] = new Array<GeneralPairType>();
    for (let i = 0; i < this.RawPairs.length; i++) {
      batch.push(this.RawPairs[i]);
      if (i !== 0 && (i % batchLimit !== 0)) {
        continue;
      } else {
        await Promise.all(
          batch.map(async (pair) => {
            const delayValue = Math.floor((Math.random() * batch.length));
            await delay(delayValue).then(async () => {
              if (DEBUG) {
                console.log(`DisplayGrid getData RawPairs index ${i}, ${delayValue} ${pair.primary.name} ${pair.secondary.name}`);
              }
            });
            const dp = new GridPair(pair.primary, pair.secondary, currentPage);
            dp.index = i;
            if (!pair.primary.name.localeCompare(dp.primaryId)) {
              //if that works, the set appears to have worked
              await dp.getSkillBooks(generalRole.enum.primary);
              await dp.getSkillBooks(generalRole.enum.secondary);
              newRows.push(dp);
            }
          }),
        );
        if (newRows.length > 0 && this.grid !== null && this.grid !== undefined) {
          if (DEBUG) {
            console.log(`getData: index ${i} newRows: ${newRows.length} `);
          }
          newRows.forEach((dp) => {
            dp.BuffsForInvestment(this.InvestmentLevel);
          });
          this._DisplayPairs.push(...newRows);
          if (this.grid !== null && this.grid !== undefined) {
            this.grid.setGridOption('rowData', this._DisplayPairs);
            this.requestUpdate('grid');
          }
        } else {
          if (DEBUG) {
            console.log(`getData for RawPairs, grid was null`);
          }
        }
        newRows = new Array<GridPair>();
        batch = new Array<GeneralPairType>();
      }
    }
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
          valueGetter: p => p.data!.primaryId,
          headerName: 'Primary',
          filter: true,
        },
        {
          valueGetter: p => p.data!.secondaryId,
          headerName: 'Secondary',
          filter: true,
        },
        {
          valueGetter: p => p.data!.EvAnsRanking,
          headerName: 'EvAns Ranking',
        },
        {
          valueGetter: p => p.data!.AttackRanking,
          headerName: 'Adjusted Attack Score',
        },
        {
          valueGetter: p => p.data!.ToughnessRanking,
          headerName: 'Adjusted Toughness Score',
        },
      ],
      defaultColDef: {
        flex: 1,
      },
      onGridReady: (params) => {
        this.getData();
        params.api.setGridOption('rowData', this._DisplayPairs);
      },
    };

    this.InvestmentLevel = {
      special1: qualityColor.enum.Gold,
      special2: qualityColor.enum.Gold,
      special3: qualityColor.enum.Gold,
      special4: qualityColor.enum.Gold,
      special5: qualityColor.enum.Gold,
      stars: AscendingLevels.enum[10],
      dragon: true,
      beast: true,
    };

    this.sInvestment = {
      special1: qualityColor.enum.Gold,
      special2: qualityColor.enum.Gold,
      special3: qualityColor.enum.Gold,
      special4: qualityColor.enum.Gold,
      special5: qualityColor.enum.Gold,
      stars: AscendingLevels.enum[0],
      dragon: true,
      beast: true,
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
        this._DisplayPairs.forEach((dp, index) => {
          dp.BuffsForInvestment(this.InvestmentLevel);
          if ((index % 10) === 0) {
            this.grid.setGridOption('rowData', this._DisplayPairs);
          }
        });
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
    if (Array.isArray(this._DisplayPairs) && this._DisplayPairs.length > 0) {
      this.grid.setGridOption('rowData', this._DisplayPairs);
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
