import { html, type PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { type GeneralClassType } from '@schemas/generalsSchema';

import { SpectrumElement } from '@spectrum-web-components/base';
import '@spectrum-web-components/table/elements.js';

@customElement('table-general')
export class TableGeneral extends SpectrumElement {
  @property({ type: Object })
  public thisGeneral: GeneralClassType | null = null;

  @state()
  readonly attackDebuff: number = 0;

  @state()
  readonly SDebuff: number = 0;

  @state()
  readonly HPDebuff: number = 0;

  @state()
  readonly defenseDebuff: number = 0;

  @state()
  readonly W2DDebuff: number = 0;

  @state()
  readonly SCTSDebuff: number = 0;

  @state()
  readonly SCTCDebuff: number = 0;

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has('thisGeneral')) {
    }
  }

  render() {
    if (this.thisGeneral !== null) {
      return html`
        <sp-table-cell role="gridcell" id="primeName">
          <div class="cellDiv not-content">
            <div class="name not-content">${this.thisGeneral.name}</div>
          </div>
        </sp-table-cell>
        <sp-table-cell role="gridcell" class="buff">
          ${this.attackDebuff}
        </sp-table-cell>
        <sp-table-cell role="gridcell" class="buff">
          ${this.SDebuff}
        </sp-table-cell>
        <sp-table-cell role="gridcell" class="buff">
          ${this.HPDebuff}
        </sp-table-cell>
        <sp-table-cell role="gridcell" class="buff">
          ${this.defenseDebuff}
        </sp-table-cell>
        <sp-table-cell role="gridcell" class="buff">
          ${this.W2DDebuff}
        </sp-table-cell>
        <sp-table-cell role="gridcell" class="buff">
          ${this.SCTSDebuff}
        </sp-table-cell>
        <sp-table-cell role="gridcell" class="buff">
          ${this.SCTCDebuff}
        </sp-table-cell>
      `;
    }
  }
}
