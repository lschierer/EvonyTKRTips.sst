import { css, html, type CSSResultArray, type PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';

import { withStores } from '@nanostores/lit';

const DEBUG = false;

import { SpectrumElement } from '@spectrum-web-components/base';

import { formValues } from '../formValueStore';

import { Tier, type TierType } from '@schemas/troopsSchemas.ts';

import * as b from '@schemas/baseSchemas';

export class EvonySiege extends withStores(SpectrumElement, [formValues]) {
  static hp = {
    t1: 100,
    t2: 140,
    t3: 190,
    t4: 260,
    t5: 350,
    t6: 470,
    t7: 630,
    t8: 850,
    t9: 1150,
    t10: 1550,
    t11: 1940,
    t12: 2425,
    t13: 2780,
    t14: 3280,
    t15: 3780,
  };
  static defense = {
    t1: 50,
    t2: 70,
    t3: 90,
    t4: 120,
    t5: 160,
    t6: 220,
    t7: 300,
    t8: 410,
    t9: 550,
    t10: 740,
    t11: 930,
    t12: 1162,
    t13: 1330,
    t14: 1560,
    t15: 1790,
  };
  static attack = {
    t1: 100,
    t2: 140,
    t3: 190,
    t4: 260,
    t5: 350,
    t6: 470,
    t7: 630,
    t8: 850,
    t9: 1150,
    t10: 1550,
    t11: 1940,
    t12: 2425,
    t13: 2780,
    t14: 3280,
    t15: 3780,
  };
  static ranges = {
    [Tier.enum.t1]: 1400,
    [Tier.enum.t2]: 1400,
    [Tier.enum.t3]: 1400,
    [Tier.enum.t4]: 1400,
    [Tier.enum.t5]: 1556,
    [Tier.enum.t6]: 1556,
    [Tier.enum.t7]: 1556,
    [Tier.enum.t8]: 1556,
    [Tier.enum.t9]: 1771,
    [Tier.enum.t10]: 1771,
    [Tier.enum.t11]: 1867,
    [Tier.enum.t12]: 1867,
    [Tier.enum.t13]: 2178,
    [Tier.enum.t14]: 2178,
    [Tier.enum.t15]: 2178,
  };

  static speed = 75;

  static modifiersByClass = {
    [b.ClassEnum.enum.Siege]: 0.5,
    [b.ClassEnum.enum.Archers]: 0.4,
    [b.ClassEnum.enum.Mounted]: 0.3,
    [b.ClassEnum.enum.Ground]: 0.35,
  };

  static modifiersByClass_T11_T15 = {
    [b.ClassEnum.enum.Siege]: 0.6,
    [b.ClassEnum.enum.Archers]: 0.4,
    [b.ClassEnum.enum.Mounted]: 0.3,
    [b.ClassEnum.enum.Ground]: 0.35,
  };

  @property({ type: Number })
  public count = 0;

  @property({ type: String })
  public tier: TierType = Tier.enum.t1;

  accessor range: number = 0;

  public override willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    super.willUpdate(_changedProperties);
    if (DEBUG) {
      console.log(`siege willupdate`);
    }

    if (this.count > 0 && _changedProperties.has('count')) {
      this.range =
        EvonySiege.ranges[this.tier as keyof typeof EvonySiege.ranges];
      if (DEBUG) {
        window.console.log(`${this.tier} siege range is ${this.range}`);
      }
    }
  }

  constructor() {
    super();
    formValues.subscribe((fv) => {
      if (fv !== null && fv !== undefined) {
        this.requestUpdate();
        return true;
      } else {
        return false;
      }
    });
  }

  public static override get styles(): CSSResultArray {
    const localstyle = css``;
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];
  }

  render() {
    return html` <span>${this.count}</span> `;
  }
}
if (!customElements.get('evony-siege')) {
  customElements.define('evony-siege', EvonySiege);
}
