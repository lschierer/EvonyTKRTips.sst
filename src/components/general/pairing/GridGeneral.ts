import { customElement, property } from 'lit/decorators.js';

import { delay } from 'nanodelay';

import {
  SizedMixin,
  type CSSResultArray,
  html,
  css,
  type PropertyValues,
} from '@spectrum-web-components/base';

import { type BuffParamsType } from '@schemas/baseSchemas';

import { Display, type DisplayType } from '@schemas/generalsSchema';

import { ExtendedGeneralStatus } from '@schemas/ExtendedGeneral';

import { BaseGeneral } from '../BaseGeneral';

const DEBUG = true;

@customElement('grid-general')
export class GridGeneral extends SizedMixin(BaseGeneral, {
  noDefaultSize: true,
}) {
  @property({ type: String })
  public DisplayPref: DisplayType = Display.enum.summary;

  @property({
    type: Number,
    reflect: true,
  })
  public EvAnsRanking = 0;

  @property({
    type: Number,
    reflect: true,
  })
  public AttackRanking = 0;

  @property({
    type: Number,
    reflect: true,
  })
  public ToughnessRanking = 0;

  @property({ type: Object })
  public InvestmentLevel: BuffParamsType | null = null;

  constructor() {
    super();

    this.addEventListener('GeneralComplete', async () => {
      if (DEBUG) {
        console.log(`GridGeneral GeneralSet listener ${this.generalId}`);
      }
      await this.recomputeBuffs();
    });
  }

  private recomputeBuffs = async () => {
    let InComplete = true;
    if (DEBUG) {
      console.log(`GridGeneral recomputeBuffs ${this.generalId}`);
    }
    if (this.InvestmentLevel === null) {
      if (DEBUG) {
        console.log(
          `GridGeneral recomputeBuffs ${this.generalId} InvestmentLevel null`
        );
      }
      return;
    }
    if (
      this._eg === null ||
      this._eg === undefined ||
      this.status.localeCompare(ExtendedGeneralStatus.enum.complete)
    ) {
      if (DEBUG) {
        console.log(
          `GridGeneral recomputeBuffs ${this.generalId} not ready to recompute`
        );
        console.log(`GridGeneral recomputeBuffs status: ${this.status}`);
      }
      return;
    }
    if (DEBUG) {
      console.log(
        `GridGeneral recomputeBuffs ${this.generalId} ready to recompute`
      );
    }
    do {
      if (
        this.InvestmentLevel !== null &&
        !this.status.localeCompare(ExtendedGeneralStatus.enum.complete)
      ) {
        const result = this.GeneralBuffs(
          this.DisplayPref,
          this.InvestmentLevel
        );
        if (result) {
          this.EvAnsRanking =
            this.computedBuffs.get(
              BaseGeneral.InvestmentOptions2Key(this.InvestmentLevel)
            )?.EvAnsRanking ?? -7;
          this.AttackRanking =
            this.computedBuffs.get(
              BaseGeneral.InvestmentOptions2Key(this.InvestmentLevel)
            )?.AttackRanking ?? -7;
          this.ToughnessRanking =
            this.computedBuffs.get(
              BaseGeneral.InvestmentOptions2Key(this.InvestmentLevel)
            )?.ToughnessRanking ?? -7;
          this.dispatchEvent(
            new CustomEvent('RanksAvailable', {
              bubbles: true,
              composed: true,
              detail: {
                generalId: this.generalId,
              },
            })
          );
          InComplete = false;
        }
      } else {
        if (DEBUG) {
          console.log(
            `GridGeneral recomputeBuffs investment: ${this.InvestmentLevel}`
          );
        }
        await delay(10);
      }
    } while (InComplete);
  };

  //the following code schedules the update to occur after the next frame paints
  protected override async scheduleUpdate(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve));
    super.scheduleUpdate();
  }

  protected async willUpdate(
    _changedProperties: PropertyValues
  ): Promise<void> {
    await super.willUpdate(_changedProperties);
    if (DEBUG) {
      console.log(`GridGeneral willUpdate started ${this.generalId ?? ''}`);
    }
    if (_changedProperties.has('InvestmentLevel')) {
      if (this._eg !== null && this._eg !== undefined) {
        if (!this.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
          await this.recomputeBuffs();
        }
      }
    }
  }

  public static override get styles(): CSSResultArray {
    const localStyle = css``;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [...super.styles, localStyle];
    } else {
      return [localStyle];
    }
  }

  render() {
    let returnable = html``;
    if (this.general !== null && this.general !== undefined) {
      returnable = html` ${this.general.name} `;
    } else if (this.generalId !== null && this.generalId !== undefined) {
      if (DEBUG) {
        //console.log(`returning ID, not name`)
      }
      returnable = html` ${this.generalId} `;
    } else {
      returnable = html` No General Name String Available `;
    }

    return returnable;
  }
}
