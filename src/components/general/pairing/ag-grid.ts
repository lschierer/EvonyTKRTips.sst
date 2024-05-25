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

import { type GridOptions, createGrid, GridApi } from "ag-grid-community"

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


@customElement('ag-grid')
export class AgGrid extends SizedMixin(SpectrumElement, {
  noDefaultSize: true
}) {

  @property({ type: String })
  public tableName = ""

  @property({type: Object})
  public InvestmentLevel: BuffParamsType

  @property({type: Object})
  public DisplayPairs: GeneralPairType[] = new Array<GeneralPairType>()

  @state()
  private gridOptions: GridOptions<GeneralPairType> = {}

  @state()
  private gridElement:  HTMLElement | null | undefined = null

  private tableDivRef: Ref<HTMLElement> = createRef()

  private MutationObserver: MutationObserver
 
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

  
  
  
}
