import {html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';

import {withStores} from "@nanostores/lit";

import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/picker/sp-picker.js';
import {Picker} from '@spectrum-web-components/picker';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import {SpectrumElement} from "@spectrum-web-components/base";

import {
  generalUseCase,
  type generalUseCaseType,
  levelSchema,
  type levelSchemaType,
  qualitySchema,
  type qualitySchemaType
} from "@schemas/evonySchemas.ts";

import {type generalInvestment, primaryInvestmentMap, secondaryInvestmentMap} from './generalInvestmentStore.ts';


@customElement('investment-selector')
export class InvestmentSelector extends withStores(SpectrumElement, [primaryInvestmentMap, secondaryInvestmentMap]) {
  
  @property({type: String})
  public role: string = 'primary';
  
  constructor() {
    super();
  }
  
  private MutationObserverCallback = (mutationList: MutationRecord[], observer: MutationObserver) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
      } else if (mutation.type === "attributes") {
        console.log(`The ${mutation.attributeName} attribute was modified.`);
      }
    }
  };
  
  private observer = new MutationObserver(this.MutationObserverCallback);
  
  protected changeHandler(e: Event) {
    let myEvent = new CustomEvent('PickerChanged', {
      detail: {
        id: (e.target as Picker).id,
        value: (e.target as Picker).value,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(myEvent);
    const picker = (e.target as Picker);
    if (!this.role.localeCompare('primary')) {
      if (!picker.id.localeCompare('ascending')) {
        const validation = levelSchema.safeParse(picker.value)
        if (validation.success) {
          primaryInvestmentMap.setKey('ascending', validation.data)
        }
      } else if (!picker.id.localeCompare('Speciality1')) {
        const validation = qualitySchema.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality1', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality2')) {
        const validation = qualitySchema.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality2', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality3')) {
        const validation = qualitySchema.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality3', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality4')) {
        const validation = qualitySchema.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality4', validation.data);
        }
      }
    } else {
      if (!picker.id.localeCompare('ascending')) {
        const validation = levelSchema.safeParse(picker.value)
        if (validation.success) {
          secondaryInvestmentMap.setKey('ascending', validation.data)
        }
      } else if (!picker.id.localeCompare('Speciality1')) {
        const validation = qualitySchema.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality1', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality2')) {
        const validation = qualitySchema.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality2', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality3')) {
        const validation = qualitySchema.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality3', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality4')) {
        const validation = qualitySchema.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality4', validation.data);
        }
      }
    }
  }
  
  static styles = css`
    div.fieldGroup {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      border: 1px solid var(--spectrum-cyan-600);
      border-bottom: 0px;
      
      & #InvestmentFieldGroupHeader {
        text-align: center;
        margin-top: 0px;
        margin-bottom: 0px;
        font-weight: bold;
      }
    }
    
    sp-picker#ascending {
      width: 3rem;
    }

    sp-picker[id^=Speciality] {
      width: 7rem;
    }

    sp-picker#unitClass {
      width: 9rem;
    }
  
  `
  
  
  public render() {
    return html`
        <div class="fieldGroup">
            <p id="InvestmentFieldGroupHeader">${this.role.charAt(0).toUpperCase() + this.role.slice(1)} General</p>
            <sp-field-group horizontal>
                <sp-help-text slot="help-text">Indicate your investment level in the generals.</sp-help-text>
                <div>
                    <sp-field-label for="ascending" size="s">Ascending Level</sp-field-label>
                    <sp-picker id="ascending" size="s" label="5" value='10' @change=${this.changeHandler}>
                        <sp-menu-item value='5'>0</sp-menu-item>
                        <sp-menu-item value='6'>1</sp-menu-item>
                        <sp-menu-item value='7'>2</sp-menu-item>
                        <sp-menu-item value='8'>3</sp-menu-item>
                        <sp-menu-item value='9'>4</sp-menu-item>
                        <sp-menu-item value='10'>5</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality1" size="s">1st Speciality</sp-field-label>
                    <sp-picker id="Speciality1" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                        <sp-menu-item value=${qualitySchema.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality2" size="s">2nd Speciality</sp-field-label>
                    <sp-picker id="Speciality2" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                        <sp-menu-item value=${qualitySchema.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality3" size="s">3rd Speciality</sp-field-label>
                    <sp-picker id="Speciality3" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                        <sp-menu-item value=${qualitySchema.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality4" size="s">4th Speciality</sp-field-label>
                    <sp-picker id="Speciality4" size="s" label="Gold" value='Gold' @change=${this.changeHandler}>
                        <sp-menu-item value=${qualitySchema.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${qualitySchema.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
            </sp-field-group>
        </div>
    `
    
  }
}
