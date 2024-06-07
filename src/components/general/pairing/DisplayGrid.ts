
import {
  GridApi,
  type GridOptions,
  createGrid,
  type RowNodeTransaction,
  ModuleRegistry,
} from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import BaseAGCSSImport from 'ag-grid-community/styles/ag-grid.css?inline';
import BalhamImport from 'ag-grid-community/styles/ag-theme-balham.css?inline';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { delay } from 'nanodelay';

const DEBUG = false;

import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';

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
  generalRole,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

import { type GeneralPairType } from '@schemas/ExtendedGeneral';

import {PairInvestment} from './PairInvestment.ts';

import { GridPair } from './GridPair';

@customElement('display-grid')
export class DisplayGrid extends SizedMixin(SpectrumElement, {
  noDefaultSize: true,
}) {
  @property({ type: String })
  public tableName = '';

  @property({
    type: Object,
    reflect: true
  })
  public InvestmentLevel: BuffParamsType;

  @property({
    type: Object,
    reflect: true
  })
  public SecondaryInvestmentLevel: BuffParamsType;

  @property({
    type: String,
    reflect: true
  })
  public useCase: generalUseCaseType = generalUseCase.enum.all;

  @property({ type: Object })
  public RawPairs: GeneralPairType[] = new Array<GeneralPairType>();

  //private tableDivRef: Ref<HTMLElement> = createRef()
  private InvestmentSelectorRef: Ref<PairInvestment> = createRef();


  private MutationObserver: MutationObserver;

  @state()
  private _DisplayPairs: GridPair[] = new Array<GridPair>();

  private gridOptions: GridOptions<GridPair> = {};

  // @ts-expect-error
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
      if (i !== 0 && i % batchLimit !== 0) {
        continue;
      } else {
        await Promise.all(
          batch.map(async (pair) => {
            const delayValue = Math.floor(Math.random() * batch.length);
            await delay(delayValue).then( () => {
              if (DEBUG) {
                console.log(
                  `DisplayGrid getData RawPairs index ${i}, ${delayValue} ${pair.primary.name} ${pair.secondary.name}`
                );
              }
            });
            const dp = new GridPair(pair.primary, pair.secondary, currentPage);
            dp.useCase = this.useCase;
            dp.index = i;
            if (!pair.primary.name.localeCompare(dp.primaryId)) {
              //if that works, the set appears to have worked
              await dp.getSkillBooks(generalRole.enum.primary);
              await dp.getSkillBooks(generalRole.enum.secondary);
              newRows.push(dp);
            }
          })
        );
        if (
          newRows.length > 0 &&
          this.grid !== null &&
          this.grid !== undefined
        ) {
          if (DEBUG) {
            console.log(`getData: index ${i} newRows: ${newRows.length} `);
          }
          newRows.forEach((dp) => {
            dp.BuffsForInvestment(this.InvestmentLevel, this.SecondaryInvestmentLevel);
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
          headerName: 'Index',
          flex: 1,
          valueGetter: "node.rowIndex + 1",
          filter: false,
          sortable: false,
        },
        {
          valueGetter: (p) => p.data!.primaryId,
          headerName: 'Primary',
          filter: true,
          flex: 4,
        },
        {
          valueGetter: (p) => p.data!.secondaryId,
          headerName: 'Secondary',
          filter: true,
          flex: 4,
        },
        {
          valueGetter: (p) => p.data!.EvAnsRanking,
          headerName: 'EvAns Estimate',
          flex: 2,
          colId: 'EvAnsEstimate',
        },
        {
          valueGetter: (p) => p.data!.AttackRanking,
          headerName: 'Adjusted Attack Score',
          flex: 2,
        },
        {
          valueGetter: (p) => p.data!.ToughnessRanking,
          headerName: 'Adjusted Toughness Score',
          flex: 2,
        },
      ],
      defaultColDef: {
        flex: 1,
        wrapHeaderText: true,
        autoHeaderHeight: true,
      },
      suppressModelUpdateAfterUpdateTransaction: false,
      onGridReady: (params) => {
        this.getData();
        params.api.setGridOption('rowData', this._DisplayPairs);
      },
    };

    this.addEventListener('InvestmentLevelUpdate', this.UpdateInvestmentAndGridData);

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

    this.SecondaryInvestmentLevel = {
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

  private printResult(res: RowNodeTransaction) {
    console.log("---------------------------------------");
    if (res.add) {
      res.add.forEach((rowNode) => {
        console.log("Added Row Node", rowNode);
      });
    }
    if (res.remove) {
      res.remove.forEach((rowNode) => {
        console.log("Removed Row Node", rowNode);
      });
    }
    if (res.update) {
      res.update.forEach((rowNode) => {
        console.log("Updated Row Node", rowNode);
      });
    }
  }

  private UpdateInvestmentAndGridData = () => {
    console.log(`UpdateInvestmentAndGridData`)
    if(this.InvestmentSelectorRef.value !== undefined) {
      console.log(`UpdateInvestmentAndGridData with target node`)
      this.InvestmentLevel = this.InvestmentSelectorRef.value.PrimaryInvestmentLevel;
      this.SecondaryInvestmentLevel = this.InvestmentSelectorRef.value.SecondaryInvestmentLevel;
      if(this.grid !== null && this.grid !== undefined) {
        console.log(`UpdateInvestmentAndGridData; with BuffParams & grid`)
        let transaction = new Array<GridPair>();
        this.grid.forEachNode((irgp, index) => {
          if(irgp.data !== undefined && irgp.data !== null) {
            irgp.data.BuffsForInvestment(this.InvestmentLevel, this.SecondaryInvestmentLevel);
            if(!(index % 10)) {
              const res = this.grid.applyTransaction({
                update: transaction
              })
              if(DEBUG && res) {
                console.log(this.printResult(res))
              }
              transaction = new Array<GridPair>();
            }
          }
        })
        this.grid.refreshClientSideRowModel('sort')
      }
    }
    this.requestUpdate('InestmentLevel');
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

  protected override  willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has('RawPairs')) {
      if (DEBUG) {
        console.log(`willUpdate called for RawPairs`);
      }
    }
    if(_changedProperties.has('useCase')){
      if(!this.useCase.localeCompare(generalUseCase.enum.Monsters)){
        if (this.grid !== null && this.grid !== undefined) {
          this.grid.applyColumnState({
            state: [
              {
                colId: 'EvAnsEstimate',
                hide: true,
              }
            ],
            defaultState: {
              // important to say 'null' as undefined means 'do nothing'
              hide: false
            }
          })
        }
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
    const AlpineCSS = unsafeCSS(BalhamImport);
    const localStyle = css`
      .ag-theme-balham,
      .ag-theme-balham-dark {
        --ag-header-height: 120px;
        --ag-grid-size: 5px;
        --ag-list-item-height: 16px;
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
      if (!this.useCase.localeCompare(generalUseCase.enum.Monsters)) {
        // I do not currently *have* EvAns score estimates for useCase Monsters. 
        if (this.grid !== null && this.grid !== undefined) {
          this.grid.applyColumnState({
            state: [
              {
                colId: 'EvAnsEstimate',
                hide: true,
              }
            ],
          })
        }
      } else {
        if (DEBUG) {
          console.log(`use case is ${this.useCase}`)
        }
      }
      if (Array.isArray(this._DisplayPairs) && this._DisplayPairs.length > 0) {
        if(this.grid?.getGridOption('rowData')?.length !== this._DisplayPairs.length) {
          let transaction = new Array<GridPair>();
          this._DisplayPairs.forEach((dp, index) => {
            dp.BuffsForInvestment(this.InvestmentLevel, this.SecondaryInvestmentLevel);
            if (index % 10 === 0) {
              this.grid.applyTransaction({
                add: transaction
              });
              transaction = new Array<GridPair>();
            }else {
              transaction.push(dp)
            }
          });
        }
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
      <pair-investment ${ref(this.InvestmentSelectorRef)} ></pair-investment>
      <div
        id="agdiv"
        class="ag-theme-balham"
        style="height: 500px;"
        ${ref(this.renderGrid)}
      ></div>
    `;
  }
}
