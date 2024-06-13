const DEBUG = true;

import {type Sorter, TabulatorFull as Tabulator} from 'tabulator-tables';
import TabulatorStyles from 'tabulator-tables/dist/css/tabulator.css?inline';
import TabulatorSimpleUI from 'tabulator-tables/dist/css/tabulator_simple.css?inline'
import 'tabulator-tables/dist/js/tabulator.js';


import { z } from 'zod';
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
  generalSpecialists,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral';

import {MayorInvestment} from './MayorInvestment';
import { type MayorBuffDetails, MayorDetail } from '../buffComputers/TKRTipsRanking/MayorDetail';

//do NOT import this from anywhere else. Use the function in the class to generate one.
const GridData = z.object({
  id: z.string().ulid(),

    Name: z.string(),
    Conflicts: z.number(),


    attackScore: z.number(),
    DeHPScore: z.number(),
    DeDefenseScore: z.number(),


    ToughnessScore: z.number(),
    DeAttackScore: z.number(),

  Original: ExtendedGeneral,
})
type GridData = z.infer<typeof GridData>;

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
  private _DisplayGenerals: GridData[] = new Array<GridData>();

  private grid: Tabulator | null = null;

  private gridRef: Ref<HTMLElement> = createRef();

  handleMutation(): void {
    return;
  }



  private async getData() {
    if(this._DisplayGenerals.length < this.RawGenerals.length) {
      if(DEBUG) {
        console.log(`getData populating _DisplayGenerals`)
      }
      this.RawGenerals.map( (bp, ) => {

        const dp: GridData = {
          id: ulid(),

            Name: bp.name,
            Conflicts: bp.conflicts.length,

            attackScore: 0,
            DeHPScore: 0,
            DeDefenseScore: 0,

            ToughnessScore: 0,
            DeAttackScore: 0,

          Original: bp,
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
            const Details: MayorBuffDetails = MayorDetail(
              dg.Original,
              this.InvestmentLevel,
              generalSpecialists.enum.Mayor,
            )
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData: ${JSON.stringify(Details)} computing buffs`)
            }
            dg.ToughnessScore = Details.HP + Details.Defense;
            dg.attackScore = Details.Attack;
            dg.DeAttackScore = Details.DeAttack;
            dg.DeHPScore = Details.DeHP;
            dg.DeDefenseScore = Details.DeDefense;

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
        height: calc(var(--spectrum-component-height-500) * 10 + 1);
        overflow-x: hidden;
        
        #table-div {
          height: calc(var(--spectrum-component-height-500) * 10);
          
        }
      }
      
      .tabulator {
        font-size: var(--spectrum-global-dimension-font-size-25);
        width: 100%;
      }
      
      .tabulator .tabulator-header .tabulator-header-contents {
        max-height: calc(var(--spectrum-table-section-header-row-height-medium) * 4);
        
        
      }
      
      .tabulator .tabulator-header .tabulator-header-contents .tabulator-headers   {
        width: 1fr;
        height: 2em;
        white-space: normal;
      }
      .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
        padding: var(--spectrum-global-dimension-static-size-50)
      }
      .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
        padding-right: var(--spectrum-global-dimension-static-size-25);
      }
      .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title {
        white-space: normal;
      }
      
            
      .tabulator-col .tabulator-tableholder {
        width: inherit;
        overflow-x: hidden;
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
    if (this.gridRef.value !== undefined) {
      if(DEBUG) {
        console.log(`gridDiv is ${this.gridRef.value.tagName}`);
      }
      const div = this.gridRef.value
      if(div !== null) {
        console.log(`local queryselector works`)
      }
      this.grid = new Tabulator(div, {
        placeholder:"No Data Available",
        debugInvalidOptions: DEBUG,
        debugEventsExternal: DEBUG,
        minHeight:"var(--spectrum-component-height-500)",
        maxHeight: "100%",
        layout:"fitColumns",
        columnDefaults: {
          tooltip: true,         //show tool tips on cells
        },
        columns: [
          {
            title: 'Index',
            field: 'index',
            formatter: 'rownum',

          },
          {
            title: 'General',
            field: 'General',
            widthGrow: 4,
            columns: [
              {
                title: 'Name',
                field: 'Name',
                widthGrow: 3,
              },
              {
                title: 'Conflicts',
                headerVertical: true,
                field: 'Conflicts',
              }
            ]
          },
          {
            title: 'Adjusted Attack Ranking',
            field: 'overallAttack',
            widthGrow: 3,
            columns: [
              {
                title: 'Adjusted Attack Score',
                field: 'attackScore',
                headerVertical: true,
                widthGrow: 1,
              },
              {
                title: 'Adjusted DeHP Score',
                headerVertical: true,
                field: 'DeHPScore',
                widthGrow: 1,
              },
              {
                title: 'Adjusted DeDefense Score',
                headerVertical: true,
                field: 'DeDefenseScore',
                widthGrow: 1,
              }
            ],
          },
          {
            title: 'Adjusted Toughness Ranking',
            field: 'overallToughness',
            widthGrow: 3,
            columns: [
              {
                title: 'Adjusted Toughness Score',
                field: 'ToughnessScore',
                headerVertical: true,
                widthGrow: 1,
              },
              {
                title: 'Adjusted DeAttack Score',
                field: 'DeAttackScore',
                headerVertical: true,
                widthGrow: 1,
              },
            ],
          }
        ],
      })
      this.addEventListener('resize', () => {
        this.grid?.redraw();
      })
      this.grid.on('tableBuilt', () => {void this.getData()})
    }
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
      <mayor-investment class="Investment" ${ref(this.InvestmentSelectorRef)} ></mayor-investment>
      <div class="tableContainer">
        <div id="tableDiv" ${ref(this.gridRef)} ></div>
      </div>
    `;
  }
}
