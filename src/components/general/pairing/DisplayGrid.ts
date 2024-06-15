const DEBUG = false;
const DEBUGT = false;

import {
  type ColumnComponent,
  type Sorter,
  TabulatorFull as Tabulator} from 'tabulator-tables';
import TabulatorStyles from 'tabulator-tables/dist/css/tabulator.css?inline';
import TabulatorSimpleUI from 'tabulator-tables/dist/css/tabulator_simple.css?inline'

import { ulid} from 'ulidx';

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
  type BuffParamsType, CovenantAttributeCategory,
  qualityColor,
} from '@schemas/baseSchemas';

import {
  Display,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

import {
  type GeneralPairType,
} from '@schemas/ExtendedGeneral';

import {PairInvestment} from './PairInvestment';
import { PvPBuffDetails, PvPDetail } from '../buffComputers/TKRTipsRanking/PvPDetail';

import {GridData} from './GridPair';

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
  private _DisplayGenerals: GridData[] = new Array<GridData>();

  private grid: Tabulator | null = null;

  private gridRef: Ref<HTMLElement> = createRef();

  handleMutation(): void {
    return;
  }



  private async getData() {
    if(this._DisplayGenerals.length < this.RawPairs.length) {
      if(DEBUG) {
        console.log(`getData populating _DisplayGenerals`)
      }
      this.RawPairs.map( (gp: GeneralPairType ) => {

        const dp: GridData = {
          id: ulid(),
            Primary: {
              Name: gp.primary.name,
              Conflicts: gp.primary.conflicts.length,
              PvPBuffDetails: {
                attackRank: {
                  attackScore:  -10000,
                  marchSizeScore:  -10000,
                  rangeScore:  -10000,
                  rallyScore:  -10000,
                  DeHPScore:  -10000,
                  DeDefenseScore:  -10000,
                },
                toughnessRank: {
                  HPScore:  -10000,
                  defenseScore:  -10000,
                  DeAttackScore:  -10000,
                },
                preservationRank: {
                  PreservationScore:  -10000,
                  DebilitationScore:  -10000,
                },
              },
              Original: gp.primary,
            },
            Secondary: {
              Name: gp.secondary.name,
              Conflicts: gp.secondary.conflicts.length,
              PvPBuffDetails: {
                attackRank: {
                  attackScore:  -10000,
                  marchSizeScore:  -10000,
                  rangeScore:  -10000,
                  rallyScore:  -10000,
                  DeHPScore:  -10000,
                  DeDefenseScore:  -10000,
                },
                toughnessRank: {
                  HPScore:  -10000,
                  defenseScore:  -10000,
                  DeAttackScore:  -10000,
                },
                preservationRank: {
                  PreservationScore:  -10000,
                  DebilitationScore:  -10000,
                },
              },
              Original: gp.secondary,
            },
        };
        this._DisplayGenerals.push(dp);
      })
    }
    if(this.grid !== null && this.grid !== undefined && this._DisplayGenerals.length > 0) {
      if(DEBUG){
        console.log(`getData attempting to set data`)
      }
      await this.grid.setData(this._DisplayGenerals).then(async () => {
        if(DEBUG) {
          console.log(`getData setData then call`)
        }
        await this.UpdateInvestmentAndGridData()
      }).catch((error) => {
        console.error(error);
      })
    }else {
      if(DEBUG) {
        console.log(`getData unable to setData, ${this._DisplayGenerals.length} rows`)
      }
    }
  }

  constructor() {
    super();

    this.MutationObserver = new MutationObserver(() => {
      this.handleMutation();
    });



    this.addEventListener('InvestmentLevelUpdate', () => {
      if(DEBUG){
        console.log(`InvestmentLevelUpdate listener`)
      }
      void this.UpdateInvestmentAndGridData();
    });

    this.InvestmentLevel = {
      special1: qualityColor.enum.Gold,
      special2: qualityColor.enum.Gold,
      special3: qualityColor.enum.Gold,
      special4: qualityColor.enum.Gold,
      special5: qualityColor.enum.Gold,
      stars: AscendingLevels.enum['5red'],
      covenants: CovenantAttributeCategory.enum.Disabled,
      dragon: true,
      beast: true,
    };

    this.SecondaryInvestmentLevel = {
      special1: qualityColor.enum.Gold,
      special2: qualityColor.enum.Gold,
      special3: qualityColor.enum.Gold,
      special4: qualityColor.enum.Gold,
      special5: qualityColor.enum.Gold,
      stars: AscendingLevels.enum['0stars'],
      covenants: CovenantAttributeCategory.enum.Disabled,
      dragon: true,
      beast: true,
    };

  }

  private UpdateInvestmentAndGridData = async () => {
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
      if(this.grid !== null && this.grid !== undefined && this._DisplayGenerals.length > 0) {
        if(DEBUG) {
          console.log(`UpdateInvestmentAndGridData; with BuffParams & grid`)
        }
        let transaction: GridData[] = new Array<GridData>();
        await Promise.all(this._DisplayGenerals.map(async (dg: GridData, index: number) => {
          if(dg !== undefined && dg !== null) {
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData: before call to buffs ${index}`)
            }
            const pDetails: PvPBuffDetails = PvPDetail(
              dg.Primary.Original,
              this.InvestmentLevel,
              this.useCase,
              Display.enum.primary,
            )
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData: ${JSON.stringify(pDetails)} computing buffs`)
            }
            dg.Primary.PvPBuffDetails = pDetails;

            const sDetails: PvPBuffDetails = PvPDetail(
              dg.Secondary.Original,
              this.InvestmentLevel,
              this.useCase,
              Display.enum.secondary,
            );
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData: ${JSON.stringify(sDetails)} computing buffs`)
            }
            dg.Secondary.PvPBuffDetails = sDetails;

            transaction.push(dg)
            const rem = index % 20;
            if((index > 0) && rem < 1) {
              if(DEBUG) {console.log(`rem was ${rem}`, index, index % 20)}
              await this.grid?.updateData(transaction).then(() => {
                if(DEBUG) {
                  console.log(`UpdateInvestmentAndGridData updateData for ${transaction.length} entries in transaction`)
                }
                transaction = new Array<GridData>();
              }).catch((error) => {
                if(DEBUG){
                  console.log(`UpdateInvestmentAndGridData updateData error: ${error}`)
                }
              })
            }
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData ${transaction.length} pending in transaction`)
            }
          }
        }))
        if(transaction.length > 0) {
          if(DEBUG) {
            console.log(`calling final transaction`)
          }
          await this.grid?.updateData(transaction).then(() => {
            if(DEBUG) {
              console.log(`UpdateInvestmentAndGridData updateData for ${transaction.length} entries in transaction`)
            }
            transaction = new Array<GridData>();
          }).catch((error) => {
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData updateData error: ${error}`)
            }
          })
        }else {
          if(DEBUG) {
            console.log(`I seem to have exactly a multiple of 20`)
          }
        }
        const sorters = this.grid.getSorters();
        if(sorters.length > 0) {
          const ns: Sorter[] = sorters.map((s) => {
            return {
              column: s.column.getField(),
              dir: s.dir,
            }
          })
          this.grid.setSort(ns)
        }
      }
      this.requestUpdate('InvestmentLevel');
    }

  }

  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    if(this.grid === null) {
      this.renderGrid()
    }
  }

  protected override  willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);

  }

  public static override get styles(): CSSResultArray {
    const TabulatorCSS = unsafeCSS(TabulatorStyles);
    const TabulatorSimpleUICSS = unsafeCSS(TabulatorSimpleUI);
    const SpectrumTokensCSS = unsafeCSS(SpectrumTokens);
    const SpectrumTypographyCSS = unsafeCSS(SpectrumTypography)
    const localStyle = css`
      
      :host {
        --headerMargin: 2;
        width: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        grid-auto-flow: row;
        justify-items: stretch;
        align-items: stretch;
        justify-content: start;
        align-content: start;
        
      }
      
      .Investment {
        grid-row-start: 1;
        grid-column-start: 1;
        grid-column-end: span 5;
        width: 100%;
      }
      
      .tableContainer {
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: span 5;
        max-height: calc(var(--spectrum-component-height-500) * 5 + 1);
        overflow-x: hidden;
        border-bottom: var(--spectrum-border-width-100) solid var(--sl-color-gray-5);
        border-right: var(--spectrum-border-width-100) solid var(--sl-color-gray-5);
        border-left: var(--spectrum-border-width-100) solid var(--sl-color-gray-5);
        
      }
      
      .tabulator {
        height: calc(var(--spectrum-component-height-500) * 5);
        font-size: var(--spectrum-global-dimension-font-size-25);
        width: 100%;
        
        .tabulator-header {
          .tabulator-header-contents {
            .tabulator-col, .tabulator-col-group {
              max-height: calc(var(--spectrum-table-section-header-row-height-medium) * 4);
              
              .tabulator-col-content {
                .tabulator-col-title-holder {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  
                  .tabulator-col-title {
                    white-space: normal;
                    width: 80%;
                  }
                }
              }
            }
          }
        }
      }
      
      .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
        padding: var(--spectrum-global-dimension-static-size-50)
      }
      .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
        padding-right: var(--spectrum-global-dimension-static-size-25);
      }
      
      
      .hidden {
        display: block;
      }
    `;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [...super.styles, TabulatorCSS, TabulatorSimpleUICSS, SpectrumTokensCSS, SpectrumTypographyCSS, localStyle];
    } else {
      return [TabulatorCSS, TabulatorSimpleUICSS, SpectrumTokensCSS, SpectrumTypographyCSS, localStyle];
    }
  }

  private renderGrid = (): void  => {
    const overallAttack = 'overallAttack';
    const overallToughness = 'overallToughness';
    if (this.gridRef.value !== undefined) {
      if(DEBUG) {
        console.log(`gridDiv is ${this.gridRef.value.tagName}`);
      }
      const div = this.gridRef.value
      if(div !== null && DEBUG) {

        console.log(`local queryselector works`)
      }
      this.grid = new Tabulator(div, {
        placeholder:"No Data Available",
        debugInvalidOptions: DEBUGT,
        debugEventsExternal: DEBUGT,
        minHeight:"var(--spectrum-component-height-500)",
        layout:"fitColumns",
        columnHeaderSortMulti: true,
        columnDefaults: {
          tooltip: true,//show tool tips on cells
          headerHozAlign: "center",
        },
        columns: [
          {
            title: 'Index',
            field: 'index',
            formatter: 'rownum',
            headerSort: false,
            headerVertical: true,
            hozAlign: "center",
            resizable: false,
            frozen: true,
            width: '5em',
          },
          {
            title: 'Generals',
            field: 'General',
            widthGrow: 4,
            columns: [
              {
                title: 'Primary',
                field: 'Primary.Name',
                widthGrow: 2,
              },
              {
                title: 'Conflicts',
                headerVertical: true,
                hozAlign: 'center',
                width: '3em',
                field: 'Primary.Conflicts',
                formatter: 'traffic',
                formatterParams: {
                  color: ['var(--sl-color-green)', 'var(--sl-color-blue)', 'var(--sl-color-yellow)', 'var(--sl-color-red)']
                }
              },
              {
                title: 'Secondary',
                field: 'Secondary.Name',
                widthGrow: 2,
              },
              {
                title: 'Conflicts',
                headerVertical: true,
                hozAlign: 'center',
                width: '3em',
                field: 'Secondary.Conflicts',
                formatter: 'traffic',
                formatterParams: {
                  color: ['var(--sl-color-green)', 'var(--sl-color-blue)', 'var(--sl-color-yellow)', 'var(--sl-color-red)']
                }
              },
              {
                title: 'Primary',
                field: 'Primary',
                columns: [
                  {
                    title: 'Attack Rank',
                    field: 'Primary.attackRank',
                    columns: [
                      {
                        title: 'Attack Score',
                        field: 'Primary.PvPBuffDetails.attackRank.attackScore',
                      },
                      {
                        title: 'March Score',
                        field: 'Primary.PvPBuffDetails.attackRank.marchSizeScore',
                      },
                      {
                        title: 'Range Score',
                        field: 'Primary.PvPBuffDetails.attackRank.rangeScore',
                      },
                      {
                        title: 'Rally Score',
                        field: 'Primary.PvPBuffDetails.attackRank.rallyScore',
                      },
                      {
                        title: 'DeHP Score',
                        field: 'Primary.PvPBuffDetails.attackRank.DeHPScore',
                      },
                      {
                        title: 'DeDefense Score',
                        field: 'Primary.PvPBuffDetails.attackRank.DeDefenseScore',
                      }
                    ]
                  },
                  {
                    title: 'Toughness Rank',
                    field: 'Primary.toughnessRank',
                    columns: [
                      {
                        title: 'HP Score',
                        field: 'Primary.PvPBuffDetails.toughnessRank.HPScore',
                      },
                      {
                        title: 'Defense Score',
                        field: 'Primary.PvPBuffDetails.toughnessRank.defenseScore',
                      },
                      {
                        title: 'DeAttack Score',
                        field: 'Primary.PvPBuffDetails.toughnessRank.DeAttackScore',
                      }
                    ]
                  },
                  {
                    title: 'Preservation Rank',
                    field: 'Primary.PreservationRank',
                    columns: [
                      {
                        title: 'Preservation Score',
                        field: 'Primary.PvPBuffDetails.preservationRank.PreservationScore',
                        formatter: 'plaintext',
                      },
                      {
                        title: 'Destabilization Score',
                        field: 'Primary.PvPBuffDetails.preservationRank.DebilitationScore',
                        formatter: 'plaintext',
                      }
                    ]
                  }
                ]
              },
              {
                title: 'Secondary',
                field: 'Secondary',
                columns: [
                  {
                    title: 'Attack Rank',
                    field: 'Secondary.attackRank',
                    columns: [
                      {
                        title: 'Attack Score',
                        field: 'Secondary.PvPBuffDetails.attackRank.attackScore',
                      },
                      {
                        title: 'March Score',
                        field: 'Secondary.PvPBuffDetails.attackRank.marchSizeScore',
                      },
                      {
                        title: 'Range Score',
                        field: 'Secondary.PvPBuffDetails.attackRank.rangeScore',
                      },
                      {
                        title: 'Rally Score',
                        field: 'Secondary.PvPBuffDetails.attackRank.rallyScore',
                      },
                      {
                        title: 'DeHP Score',
                        field: 'Secondary.PvPBuffDetails.attackRank.DeHPScore',
                      },
                      {
                        title: 'DeDefense Score',
                        field: 'Secondary.PvPBuffDetails.attackRank.DeDefenseScore',
                      }
                    ]
                  },
                  {
                    title: 'Toughness Rank',
                    field: 'Secondary.toughnessRank',
                    columns: [
                      {
                        title: 'HP Score',
                        field: 'Secondary.PvPBuffDetails.toughnessRank.HPScore',
                      },
                      {
                        title: 'Defense Score',
                        field: 'Secondary.PvPBuffDetails.toughnessRank.defenseScore',
                      },
                      {
                        title: 'DeAttack Score',
                        field: 'Secondary.PvPBuffDetails.toughnessRank.DeAttackScore',
                      }
                    ]
                  },
                  {
                    title: 'Preservation Rank',
                    field: 'Secondary.PreservationRank',
                    columns: [
                      {
                        title: 'Preservation Score',
                        field: 'Secondary.PvPBuffDetails.preservationRank.PreservationScore',
                        formatter: 'plaintext',
                      },
                      {
                        title: 'Destabilization Score',
                        field: 'Secondary.PvPBuffDetails.preservationRank.DebilitationScore',
                        formatter: 'plaintext',
                      }
                    ]
                  }
                ]
              },
            ]
          },

        ],
      })
      this.addEventListener('resize', () => {
        this.grid?.redraw();
      })
      this.grid.on('tableBuilt', () => {
        void this.getData()
        const all = this.grid?.getColumns(true);
        if(all) {
          const attack = all.find((column) => {
            const f = column.getField();
            return !f.localeCompare(overallAttack)
          })
          if(attack) {
            this.colGroupToggle(null, attack);
          }
          const toughness = all.find((column) => {
            const f = column.getField();
            return !f.localeCompare(overallToughness)
          })
          if(toughness) {
            this.colGroupToggle(null, toughness);
          }
        }
      });
      this.grid.on('headerDblClick', (e, column) => {this.colGroupToggle(e, column)})
    }
  }
  private colGroupToggle(e: UIEvent | null, c: ColumnComponent) {
      const all = this.grid?.getColumns(true)
      if (c !== null && c !== undefined && all !== undefined) {
        const field = c.getField();
        if (field.startsWith('overall')) {
          c.toggle();
          if(field.includes('Total')) {
            //then this is the non-group version that defaults to hidden.
            const groupName = field.replace('Total', '');
            const group = all.find((column) => {
              const f = column.getField();
              return !f.localeCompare(groupName);
            })
            if(group !== undefined) {
              group.show();
              const children = group.getSubColumns();
              if(DEBUG) {
                console.log(`found ${children.length} columns for ${groupName}`);
              }
              
            } else {
              if(DEBUG) {
                console.log(`failed to find group to unhide`)
              }
            }
          } else {
            //then this is the group version
            const singleName = `${field}Total`;
            const single = all.find((column) => {
              const f = column.getField();
              return !f.localeCompare(singleName);
            })
            if(single !== undefined) {
              single.toggle();
            }
          }
        }
      }
      this.grid?.redraw();
  }

  protected override render() {
    if (DEBUG) {
      console.log(`DisplayGrid render called`);
      console.log(`${this._DisplayGenerals.length} pairs ready`);
    }
    if (Array.isArray(this._DisplayGenerals) && this._DisplayGenerals.length > 0) {
      //set data here
    }
    return html`
      <pair-investment class="Investment" ${ref(this.InvestmentSelectorRef)} ></pair-investment>
      <div class="tableContainer">
        <div id="tableDiv" ${ref(this.gridRef)} ></div>
      </div>
    `;
  }
}
