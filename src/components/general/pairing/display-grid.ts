import { z } from "astro:content"

import { delay } from "nanodelay"

import {
  AscendingLevels,
  type BuffParamsType,
  GeneralPair,
  type GeneralPairType,
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  qualityColor,
  type qualityColorType,
} from "@schemas/index"

import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

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
  type PropertyValueMap,
} from "@spectrum-web-components/base"

import '@spectrum-css/tokens/dist/index.css';
import '@spectrum-css/typography/dist/index.css'
import '@spectrum-css/icon/dist/index.css';
import '@spectrum-css/table/dist/index.css'



@customElement('display-grid')
export class DisplayGrid extends SizedMixin(SpectrumElement, {
  noDefaultSize: true
}) {

  @property({ type: String })
  public tableName = ""

  @property({type: Object})
  public InvestmentLevel: BuffParamsType

  @property({type: Object})
  public DisplayPairs: GeneralPairType[] = new Array<GeneralPairType>()

  private tableDivRef: Ref<HTMLElement> = createRef()

  private MutationObserver: MutationObserver

  private grid: Grid | null = null; 
 
  handleMutation(): void {
    return
  }

  constructor() {
    super()

    this.MutationObserver = new MutationObserver(() => {
      this.handleMutation()
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
    if(this.tableDivRef.value !== undefined) {
      this.grid = new Grid({
        columns: [{
          name: 'Primary',
          id: 'primary',
        },{
          name: 'Secondary',
          id: 'secondary',
        },{
          name: 'EvAns Ranking',
          id: 'EvAnsRanking',
        
        },{
          name: 'Adjusted Attack Ranking',
          id: 'AttackRanking',
        
        },{
          name: 'Adjusted Defense Ranking',
          id: 'DefenseRanking',
        
        },
      ],
      sort: true,
      data: this.DisplayPairs,
      className: {
        container: 'spectrum spectrum--medium spectrum-Table-scroller',
        table: 'spectrum-Table spectrum-Table--sizeM spectrum-Table--emphasized ',
        thead: 'spectrum-Table-head',
        th: 'spectrum-Table-headCell',
        tbody: 'spectrum-Table-body',
        td: 'spectrum-Table-cell',
        tr: 'spectrum-Table-row',
        sort: 'spectrum-Icon spectrum-UIIcon-ArrowDown100 spectrum-Table-sortedIcon',

      }
      })
      this.requestUpdate();
    }
  }
  
  public static override get styles(): CSSResultArray {
    const localStyle = css``;
    if(super.styles !== undefined && Array.isArray(super.styles)) {
      return [...super.styles,localStyle]
    } else {
      return [localStyle]
    }
  }
  
  protected override render() {
    
    if(this.grid !== null && this.tableDivRef.value !== undefined) {
      this.grid.render(this.tableDivRef.value)
    } else {console.log(`cannot render grid`)}
    return html`
      <div
        id=${this.tableName}
        ${ref(this.tableDivRef)}
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
