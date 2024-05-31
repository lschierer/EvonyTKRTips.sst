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

import { type GeneralPairType as GeneralPairSchemaType } from '@schemas/ExtendedGeneral';

import { GridPair } from './GridPair';
import type { GridGeneral } from '@components/general/pairing/GridGeneral.ts';

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
  public RawPairs: GeneralPairSchemaType[] = new Array<GeneralPairSchemaType>();

  @state()
  private _DisplayPairs: Array<DisplayPair> = new Array<DisplayPair>();

  //private tableDivRef: Ref<HTMLElement> = createRef()

  private MutationObserver: MutationObserver;

  private gridOptions: GridOptions<GridPair> = {};

  private grid: GridApi<GridPair> | null = null;

  handleMutation(): void {
    return;
  }

  private getPrimaryName: string = (params: ValueGetterParams) => {
    const gg: GridGeneral = params.data.primary;
    if (gg !== null && gg !== undefined) {
      const gc: GeneralClassType = gg.general;
      if (gc !== null && gc !== undefined) {
        return gc.name;
      } else if (gg.generalId !== null && gg.generalId !== undefined) {
        return gg.generalId;
      } else {
        return 'Unset Name';
      }
    } else {
      return 'Uninitialized General';
    }
  };

  private getSecondaryName: string = (params: ValueGetterParams) => {
    const gg: GridGeneral = params.data.secondary;
    if (gg !== null && gg !== undefined) {
      const gc: GeneralClassType = gg.general;
      if (gc !== null && gc !== undefined) {
        return gc.name;
      } else if (gg.generalId !== null && gg.generalId !== undefined) {
        return gg.generalId;
      } else {
        return 'Unset Name';
      }
    } else {
      return 'Uninitialized General';
    }
  };

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
          valueGetter: this.getPrimaryName,
          headerName: 'Primary',
          filter: true,
        },
        {
          valueGetter: this.getSecondaryName,
          headerName: 'Secondary',
          filter: true,
        },
        {
          valueGetter: (p) => p.data.EvAnsRanking ?? -11,
          headerName: 'EvAns Ranking',
        },
        {
          valueGetter: (p) => p.data.AttackRanking ?? -11,
          headerName: 'Adjusted Attack Score',
        },
        {
          valueGetter: (p) => p.data.ToughnessRanking ?? -11,
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

  private registerDP = (dp?: GridPair) => {
    if (dp !== null && dp !== undefined) {
      const present = this._DisplayPairs.some((test) => {
        if (!test.primaryId.localeCompare(dp.primaryId)) {
          if (!test.secondaryId.localeCompare(dp.secondaryId)) {
            return true;
          }
        }
        return false;
      });
      if (!present) {
        this._DisplayPairs.push(dp);
        if (DEBUG) {
          console.log(`DisplayGrid registerDP `, this._DisplayPairs.length);
        }
      }
    }
  };

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

  private rawPairIndex = 0;
  private async *renderRawPairs(count: number) {
    for (let i = 0; i < count; i++) {
      if (this.rawPairIndex < this.RawPairs.length) {
        const rp = this.RawPairs[this.rawPairIndex];
        this.rawPairIndex++;
        yield html`
          <grid-pair
            primaryId=${rp.primary.name}
            secondaryId=${rp.secondary.name}
            InvestmentLevel=${this.InvestmentLevel}
            ${ref(this.registerDP)}
          ></grid-pair>
        `;
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        break;
      }
    }
  }

  protected override render() {
    if (DEBUG) {
      console.log(`DisplayGrid render called`);
      console.log(`${this._DisplayPairs.length} pairs ready`);
    }

    const gridItems = [];
    for (let i = 0; i < this.RawPairs.length; i += 10) {
      gridItems.push(html`
        ${asyncAppend(this.renderRawPairs(10), (v) => html`${v}`)}
      `);
    }

    return html`
      <div class="hidden non-content">
        <dl>${gridItems}</dl>
      </div>
      <div
        id="agdiv"
        class="ag-theme-alpine"
        style="height: 500px;"
        ${ref(this.renderGrid)}
      ></div>
    `;
  }
}
