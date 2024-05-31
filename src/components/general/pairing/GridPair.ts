import { customElement, property, state } from "lit/decorators.js";
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

import {
  SizedMixin,
  html,
  type PropertyValues,
  SpectrumElement
} from "@spectrum-web-components/base";

import {
  AscendingLevels,
  type BuffParamsType,
} from "@schemas/baseSchemas";

import {
  Display,
} from '@schemas/generalsSchema'

const DEBUG = true;

import {GridGeneral} from './GridGeneral';

@customElement("grid-pair")
export class GridPair extends SizedMixin(SpectrumElement, {
  noDefaultSize: true,
}) {

  @property({type: String})
  public primaryId = '';
  private primaryREf: Ref<GridGeneral> = createRef();
  @property({
    type: Object,
    reflect: true
  })
  public primary: GridGeneral | undefined = this.primaryREf.value;

  @property({type: String})
  public secondaryId = '';
  private secondaryRef: Ref<GridGeneral> = createRef();
  @property({
    type: Object,
    reflect: true
  })
  public secondary: GridGeneral | null = null;

  @property({
    type: Number,
    reflect: true
  })
  public EvAnsRanking = 0;

  @property({
    type: Number,
    reflect: true
  })
  public AttackRanking = 0;

  @property({
    type: Number,
    reflect: true
  })
  public ToughnessRanking = 0;

  @property({ type: Object })
  public InvestmentLevel: BuffParamsType | null = null;

  @state()
  private sInvestment: BuffParamsType | null = null;

  protected override firstUpdated(_changedProperties: PropertyValues) {
    this.primary = this.primaryREf.value!;
    this.secondary = this.secondaryRef.value!;

  }

  protected override willUpdate(_changedProperties: PropertyValues) {
    if(_changedProperties.has('InvestmentLevel')) {
      if(this.InvestmentLevel !== null) {
        (this.sInvestment  as BuffParamsType) = {
          special1: this.InvestmentLevel.special1,
          special2: this.InvestmentLevel.special2,
          special3: this.InvestmentLevel.special3,
          special4: this.InvestmentLevel.special4,
          special5: this.InvestmentLevel.special5,
          stars: AscendingLevels.enum['0'],
          dragon: this.InvestmentLevel.dragon,
          beast: this.InvestmentLevel.beast,
        }
      }
    }
  }

  protected override render(): TemplateResult {
    if(this.primaryId.length > 0 && this.secondaryId.length > 0 ) {
      return html`
          <dt>
            <strong>Primary:</strong>
            <grid-general
              generalId=${this.primaryId}
              DisplayPref=${Display.enum.primary}
              InvestmentLevel=${this.InvestmentLevel}
              ${ref(this.primaryREf)}
            ></grid-general>    
          </dt>
          <dd>
            <strong>Secondary:</strong>
            <grid-general
              generalId=${this.secondaryId}
              DisplayPref=${Display.enum.secondary}
              InvestmentLevel=${this.sInvestment}
              ${ref(this.secondaryRef)}
            ></grid-general>
          </dd>
          <dd>
            <strong>EvAns Ranking:</strong> ${this.EvAnsRanking}
          </dd>
          <dd>
            <strong>Attack Ranking:</strong> ${this.AttackRanking}
          </dd>
          <dd>
            <strong>Toughness Ranking:</strong> ${this.ToughnessRanking}
          </dd>
      `
    } else {
      return html` Pending General Ids`
    }
  }

}