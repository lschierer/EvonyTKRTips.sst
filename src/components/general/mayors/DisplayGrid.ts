
import {
  GridApi,
  type IRowNode,
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

const DEBUG = true;

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
import SpectrumTokens from '@spectrum-css/tokens/dist/index.css?inline';
import '@spectrum-css/typography/dist/index.css';
import SpectrumTypography from '@spectrum-web-components/styles/typography.css?inline';
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

import { type ExtendedGeneralType } from '@schemas/ExtendedGeneral';

import {MayorInvestment} from './MayorInvestment';

import { GridMayor } from './GridMayor';

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
    type: String,
    reflect: true
  })
  public useCase: generalUseCaseType = generalUseCase.enum.all;

  @property({ type: Object })
  public RawGenerals: ExtendedGeneralType[] = new Array<ExtendedGeneralType>();

  //private tableDivRef: Ref<HTMLElement> = createRef()
  private InvestmentSelectorRef: Ref<MayorInvestment> = createRef();


  private MutationObserver: MutationObserver;

  @state()
  private _DisplayGenerals: GridMayor[] = new Array<GridMayor>();

  private gridOptions: GridOptions<GridMayor> = {};

  // @ts-expect-error
  private grid: GridApi<GridMayor>;

  handleMutation(): void {
    return;
  }

  private async getData() {
    if(DEBUG) {
      console.log(`getData starting with ${this.RawGenerals.length} general data`)
    }
    const currentPage = `${document.location.protocol}//${document.location.host}`;
    const batchLimit = 10;
    let newRows: GridMayor[] = new Array<GridMayor>();
    let batch: ExtendedGeneralType[] = new Array<ExtendedGeneralType>();
    for (let i = 0; i < this.RawGenerals.length; i++) {
      batch.push(this.RawGenerals[i]);
      if (i !== 0 && i % batchLimit !== 0) {
        continue;
      } else {
        await Promise.all(
          batch.map(async (thisG) => {
            const delayValue = Math.floor(Math.random() * batch.length);
            await delay(delayValue).then( () => {
              if (DEBUG) {
                console.log(
                  `DisplayGrid getData RawPairs index ${i}, ${delayValue} ${thisG.name} `
                );
              }
            });
            const dp = new GridMayor(thisG, currentPage);
            dp.useCase = this.useCase;
            dp.index = i;
            if (!thisG.name.localeCompare(dp.primaryId)) {
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
            dp.BuffsForInvestment(this.InvestmentLevel);
          });
          this._DisplayGenerals.push(...newRows);
          if (this.grid !== null && this.grid !== undefined) {
            this.grid.setGridOption('rowData', this._DisplayGenerals);
            this.requestUpdate('grid');
          }
        } else {
          if (DEBUG) {
            console.log(`getData for RawPairs, grid was null`);
          }
        }
        newRows = new Array<GridMayor>();
        batch = new Array<ExtendedGeneralType>();
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
          valueGetter: (p) => p.data!.AttackRanking,
          headerName: 'Adjusted Attack Score',
          flex: 2,
        },
        {
          valueGetter: (p) => p.data!.ArcheryAttackRanking,
          headerName: 'Adjusted Archer Attack Score',
          flex: 2,
        },
        {
          valueGetter: (p) => p.data!.GroundAttackRanking,
          headerName: 'Adjusted Ground Attack Score',
          flex: 2,
        },
        {
          valueGetter: (p) => p.data!.MountedAttackRanking,
          headerName: 'Adjusted Mounted Attack Score',
          flex: 2,
        },
        {
          valueGetter: (p) => p.data!.SiegeAttackRanking,
          headerName: 'Adjusted Siege Attack Score',
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
        params.api.setGridOption('rowData', this._DisplayGenerals);
      },
    };

    this.addEventListener('InvestmentLevelUpdate', this.UpdateInvestmentAndGridData);

    this.InvestmentLevel = {
      special1: qualityColor.enum.Gold,
      special2: qualityColor.enum.Gold,
      special3: qualityColor.enum.Gold,
      special4: qualityColor.enum.Gold,
      special5: qualityColor.enum.Gold,
      stars: AscendingLevels.enum['5red'],
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
    if(DEBUG) {
      console.log(`UpdateInvestmentAndGridData`)
    }
    if(this.InvestmentSelectorRef.value !== undefined) {
      if(DEBUG) {
        console.log(`UpdateInvestmentAndGridData with target node`)
      }
      this.InvestmentLevel = this.InvestmentSelectorRef.value.PrimaryInvestmentLevel;

      if(DEBUG) {
        console.log(`UpdateInvestmentAndGridData: ${JSON.stringify(this.InvestmentLevel)}`);
      }
      if(this.grid !== null && this.grid !== undefined) {
        if(DEBUG) {
          console.log(`UpdateInvestmentAndGridData; with BuffParams & grid`)
        }
        let transaction = new Array<GridMayor>();
        this.grid.forEachNode((irgp, index) => {
          if(irgp.data !== undefined && irgp.data !== null) {
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData: before call to buffs`)
              console.log(`UpdateInvestmentAndGridData: irgp.data versions:`)
              console.log(JSON.stringify(irgp.data.InvestmentLevel));
              console.log(irgp.data.EvAnsRanking);
              console.log(irgp.data.AttackRanking);
              console.log(irgp.data.ToughnessRanking);
            }
            const buffs = irgp.data.BuffsForInvestment(this.InvestmentLevel);
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData: ${buffs} setting buffs`)
              console.log(`UpdateInvestmentAndGridData: irgp.data versions:`)
              console.log(JSON.stringify(irgp.data.InvestmentLevel));
              console.log(irgp.data.EvAnsRanking);
              console.log(irgp.data.AttackRanking);
              console.log(irgp.data.ToughnessRanking);
            }
            transaction.push((irgp.data))
            if(!(index % 20)) {
              const res = this.grid.applyTransaction({
                update: transaction
              })
              if(DEBUG && res) {
                console.log(`UpdateInvestmentAndGridData ${transaction.length} entries in transaction`)
                this.printResult(res)
              }
              transaction = new Array<GridMayor>();
            }
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData ${transaction.length} pending in transaction`)
            }
          }
        })
        const res = this.grid.applyTransaction({update: transaction})
        if(DEBUG && res) {
          console.log(`UpdateInvestmentAndGridData ${transaction.length} entries in transaction`)
          this.printResult(res)
        }
        this.grid.refreshClientSideRowModel('sort')
      }
    }
    this.requestUpdate('InestmentLevel');
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    if (Array.isArray(this._DisplayGenerals) && this._DisplayGenerals.length > 0) {
      if (this.grid !== null && this.grid !== undefined) {
        this.grid.setGridOption('rowData', this._DisplayGenerals);
      } else {
        if (DEBUG) {
          console.log(`firstUpdated: yes _DisplayGenerals, no grid`);
        }
      }
    } else {
      if (DEBUG) {
        console.log(`firstUpdated _DisplayGenerals is not populated`);
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
    if (_changedProperties.has('_DisplayGenerals')) {
      if (this.grid !== null && this.grid !== undefined) {
        if (DEBUG) {
          console.log(`setting rowData from willUpdate on _DisplayGenerals`);
          console.log(`${this._DisplayGenerals.length} pairs ready`);
        }
        this.grid.setGridOption('rowData', this._DisplayGenerals);
      } else {
        if (DEBUG) {
          console.log(`willUpdate for _DisplayGenerals, grid was null`);
        }
      }
    }
  }

  public static override get styles(): CSSResultArray {
    const AGBaseCSS = unsafeCSS(BaseAGCSSImport);
    const AlpineCSS = unsafeCSS(BalhamImport);
    const SpectrumTokensCSS = unsafeCSS(SpectrumTokens);
    const SpectrumTypographyCSS = unsafeCSS(SpectrumTypography)
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
      return [...super.styles, AGBaseCSS, AlpineCSS, SpectrumTokensCSS, SpectrumTypographyCSS, localStyle];
    } else {
      return [AGBaseCSS, AlpineCSS, SpectrumTokensCSS, SpectrumTypographyCSS, localStyle];
    }
  }

  renderGrid(gridDiv?: Element) {
    if (gridDiv !== null && gridDiv !== undefined) {
      if(DEBUG) {
        console.log(`gridDiv is ${gridDiv.localName}`);
      }
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
      if (Array.isArray(this._DisplayGenerals) && this._DisplayGenerals.length > 0) {
        if(this.grid?.getGridOption('rowData')?.length !== this._DisplayGenerals.length) {
          let transaction = new Array<GridMayor>();
          this._DisplayGenerals.forEach((dp, index) => {
            dp.BuffsForInvestment(this.InvestmentLevel);
            if (index % 10 === 0) {
              this.grid.applyTransaction({
                add: transaction
              });
              transaction = new Array<GridMayor>();
            }else {
              transaction.push(dp)
            }
          });
        }
      } else {
        if (DEBUG) {
          console.log(`renderGrid _DisplayGenerals is not populated`);
        }
      }
    }
  }

  protected override render() {
    if (DEBUG) {
      console.log(`DisplayGrid render called`);
      console.log(`${this._DisplayGenerals.length} pairs ready`);
    }
    if (Array.isArray(this._DisplayGenerals) && this._DisplayGenerals.length > 0) {
      this.grid.setGridOption('rowData', this._DisplayGenerals);
    }
    return html`
      <mayor-investment ${ref(this.InvestmentSelectorRef)} ></mayor-investment>
      <div
        id="agdiv"
        class="ag-theme-balham-auto-dark"
        style="height: 500px;"
        ${ref(this.renderGrid)}
      ></div>
    `;
  }
}
