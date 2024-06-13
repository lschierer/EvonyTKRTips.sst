import {TabulatorFull as Tabulator} from 'tabulator-tables';
import TabulatorStyles from 'tabulator-tables/dist/css/tabulator.css?inline';
import TabulatorMaterialize from 'tabulator-tables/dist/css/tabulator_materialize.css?inline'
import 'tabulator-tables/dist/js/tabulator.js';


import { z } from 'zod';
import { ulid} from 'ulidx';

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
  type BuffParamsType, CovenantAttributeCategory,
  qualityColor,
} from '@schemas/baseSchemas';

import {
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral';

import {MayorInvestment} from './MayorInvestment';

import { GridMayor } from './GridMayor';

//do NOT import this from anywhere else. Use the function in the class to generate one.
const GridData = z.object({
  index: z.string().ulid(),

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
          index: ulid(),

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
      await this.grid.setData(this._DisplayGenerals).then(() => {
        if(DEBUG) {
          console.log(`getData setData then call`)
        }

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



    //this.addEventListener('InvestmentLevelUpdate', this.UpdateInvestmentAndGridData);

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

  private UpdateInvestmentAndGridData = () => {
    if(DEBUG) {
      console.log(`UpdateInvestmentAndGridData`)
    }
    /*if(this.InvestmentSelectorRef.value !== undefined) {
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
        let transaction: GridData[] = new Array<GridData>();
        this.RawGenerals.forEach((rg: ExtendedGeneralType, index: number) => {
          if(rg !== undefined && rg !== null) {
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData: before call to buffs`)
              console.log(`UpdateInvestmentAndGridData: irgp.data versions:`)

            }

            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData: ${buffs} setting buffs`)
              console.log(`UpdateInvestmentAndGridData: irgp.data versions:`)
              console.log(JSON.stringify(irgp.InvestmentLevel));

            }
            transaction.push((irgp))
            if(!(index % 20)) {
              const res = this.grid.applyTransaction({
                update: transaction
              })

              transaction = new Array<GridData>();
            }
            if(DEBUG){
              console.log(`UpdateInvestmentAndGridData ${transaction.length} pending in transaction`)
            }
          }
        })
        //const res = this.grid.applyTransaction({update: transaction})

        //this.grid.refreshClientSideRowModel('sort')
      }
    }
    this.requestUpdate('InestmentLevel');
    */
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
    const TabulatorMaterializeCSS = unsafeCSS(TabulatorMaterialize);
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
      
      .tabulator .tabulator-header .tabulator-header-contents .tabulator-headers   {
        width: 1fr;
        height: 2em;
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
      
      #tableDiv > div.tabulator-header > div > div.tabulator-headers > div.tabulator-col.tabulator-sortable.tabulator-col-sorter-element > div > div,
      #tableDiv > div.tabulator-header > div > div.tabulator-headers > div:nth-child(3) > div.tabulator-col-group-cols > div:nth-child(3) > div > div,
      #tableDiv > div.tabulator-header > div > div.tabulator-headers > div:nth-child(7) > div.tabulator-col-group-cols > div:nth-child(1) > div > div,
      #tableDiv > div.tabulator-header > div > div.tabulator-headers > div:nth-child(7) > div.tabulator-col-group-cols > div:nth-child(3) > div > div
      {
        width: fit-content;
      }
      
      #tableDiv > div.tabulator-header > div > div.tabulator-headers > div.tabulator-col.tabulator-sortable.tabulator-col-sorter-element > div > div > div.tabulator-col-title,
      #tableDiv > div.tabulator-header > div > div.tabulator-headers > div:nth-child(3) > div.tabulator-col-group-cols > div:nth-child(3) > div > div > div.tabulator-col-title,
      #tableDiv > div.tabulator-header > div > div.tabulator-headers > div:nth-child(7) > div.tabulator-col-group-cols > div:nth-child(3) > div > div > div.tabulator-col-title,
      #tableDiv > div.tabulator-header > div > div.tabulator-headers > div:nth-child(7) > div.tabulator-col-group-cols > div:nth-child(1) > div > div > div.tabulator-col-title
      {
        width: fit-content;
        height: 6em;
        writing-mode: vertical-rl;
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
      return [...super.styles, TabulatorCSS, TabulatorMaterializeCSS, SpectrumTokensCSS, SpectrumTypographyCSS, localStyle];
    } else {
      return [TabulatorCSS, TabulatorMaterializeCSS, SpectrumTokensCSS, SpectrumTypographyCSS, localStyle];
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
        debugInvalidOptions: true,
        debugEventsExternal:true,
        minHeight:"var(--spectrum-component-height-500)",
        maxHeight: "100%",
        layout:"fitColumns",
        columns: [
          {
            title: 'Index',
            field: 'index',
            formatter: 'rownum',
            widthGrow: 1,
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
                widthGrow: 1,
              },
              {
                title: 'Adjusted DeHP Score',
                field: 'DeHPScore',
                widthGrow: 1,
              },
              {
                title: 'Adjusted DeDefense Score',
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
                widthGrow: 1,
              },
              {
                title: 'Adjusted DeAttack Score',
                field: 'DeAttackScore',
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
