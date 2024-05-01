import {html, css, nothing, type PropertyValues, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import {z} from 'zod';

import {withStores} from "@nanostores/lit";

import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/picker/sp-picker.js';
import {Picker} from '@spectrum-web-components/picker';
import '@spectrum-web-components/radio/sp-radio.js';
import '@spectrum-web-components/radio/sp-radio-group.js';
import {
  Radio,
  RadioGroup
} from '@spectrum-web-components/radio';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import '@spectrum-web-components/switch/sp-switch.js';
import {SpectrumElement} from "@spectrum-web-components/base";

const DEBUG = false;

import * as b from '@schemas/baseSchemas'

import {generalRole, type generalRoleType} from '@schemas/generalsSchema';

import {
  BoS, 
  type BoSType, 
  type generalInvestment, 
  primaryInvestmentMap, 
  secondaryInvestmentMap, 
  PrimaryInvestmentInitialize, 
  SecondaryInvestmentInitialize
} from './selectionStore';


export class InvestmentSelector extends withStores(SpectrumElement, [primaryInvestmentMap, secondaryInvestmentMap]) {
  
  @property({type: String})
  public generalRole: string;

  @state()
  private _role: generalRoleType;

  @state()
  private _speciality1: b.qualityColorType = b.qualityColor.enum.Gold;

  @state()
  private _speciality2: b.qualityColorType = b.qualityColor.enum.Gold;

  @state()
  private _speciality3: b.qualityColorType = b.qualityColor.enum.Gold;

  @state()
  private _speciality4: b.qualityColorType = b.qualityColor.enum.Gold;

  @state()
  private _dragon = true;

  @state()
  private _beast = false;

  @state()
  private debuffLead = false;

  @state()
  private _ascending: b.levelsType = b.levels.enum[10];

  private Special4disabledValue = false;

  constructor() {
    super();
    this.generalRole = 'secondary';
    this._role = generalRole.enum.secondary;

  }
  
  private MutationObserverCallback = (mutationList: MutationRecord[], observer: MutationObserver) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
      } else if (mutation.type === "attributes") {
      }
    }
  };
  
  private observer = new MutationObserver(this.MutationObserverCallback);
  
  connectedCallback() {
    super.connectedCallback();    
    this.addEventListener('debuff', (e) => this.toggleDebuffLead());
  }
  
  private yieldToMain () {
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if(DEBUG) {console.log(`InvestmentSelector firstUpdated`)}
      if(_changedProperties.has('generalRole')) {
        if(DEBUG) {console.log(`and I have a generalRole`)}
        const valid = generalRole.safeParse(this.generalRole);
        if(valid.success) {
          if(DEBUG) {console.log(`with valid data`)}
          if(valid.data === generalRole.enum.primary) {
            PrimaryInvestmentInitialize();
            this.investmentMap[this._role]()
          } else {
            SecondaryInvestmentInitialize();
            this.investmentMap[this._role]()
          }
          this.requestUpdate();
        }
      }
  }

  async willUpdate(changedProperties: PropertyValues<this>) {
    if(DEBUG) {console.log(`investmentselector willupdate`)}
    if(changedProperties.has('generalRole')) {
      const valid = generalRole.safeParse(this.generalRole);
      if(valid.success) {
        this._role = valid.data;
        this.investmentMap[this._role]()
      }
    }
  }

  protected toggleDebuffLead() {
    if(DEBUG) {console.log(`InvestmentSelector toggling debuff`)}
    this.debuffLead = (!(this.debuffLead));
    primaryInvestmentMap.setKey('debuffLead',this.debuffLead);
  }

  protected changeHandler(e: CustomEvent) {
    console.log(`test`)
    const myEvent = new CustomEvent('PickerChanged', {
      detail: {
        id: (e.target as Picker).id,
        value: (e.target as Picker).value,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(myEvent);
    const picker = (e.target as Picker);
    if (this._role === generalRole.enum.primary) {
      if (!picker.id.localeCompare('ascending')) {
        const validation = b.levels.safeParse(picker.value)
        if (validation.success) {
          primaryInvestmentMap.setKey('ascending', validation.data)
        }
      } else if (!picker.id.localeCompare('Speciality1')) {
        const validation = b.qualityColor.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality1', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality2')) {
        const validation = b.qualityColor.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality2', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality3')) {
        const validation = b.qualityColor.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality3', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality4')) {
        const validation = b.qualityColor.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality4', validation.data);
        }
      }
    } else {
      if (!picker.id.localeCompare('ascending')) {
        const validation = b.levels.safeParse(picker.value)
        if (validation.success) {
          secondaryInvestmentMap.setKey('ascending', validation.data)
        }
      } else if (!picker.id.localeCompare('Speciality1')) {
        const validation = b.qualityColor.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality1', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality2')) {
        const validation = b.qualityColor.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality2', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality3')) {
        const validation = b.qualityColor.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality3', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality4')) {
        const validation = b.qualityColor.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality4', validation.data);
        }
      }
    }
    secondaryInvestmentMap.setKey('ascending', '0');
  }

  private radioHandler(e: CustomEvent) {
    const radio = (e.target as RadioGroup);
    if(radio !== null && radio !== undefined && radio.selected !== null && radio.selected !== undefined) {
      
      const valid = BoS.safeParse(radio.selected)
      if(valid.success) {
        const value = valid.data;
        if(value && value === BoS.enum.dragon) {
          if(this._role === generalRole.enum.primary) {
            primaryInvestmentMap.setKey(BoS.enum.dragon,true);
            primaryInvestmentMap.setKey(BoS.enum.beast,false);
          } else {
            secondaryInvestmentMap.setKey(BoS.enum.dragon,true);
            secondaryInvestmentMap.setKey(BoS.enum.beast,false);
          }
        }
        if(value === BoS.enum.beast) {
          if(this._role === generalRole.enum.primary) {
            primaryInvestmentMap.setKey(BoS.enum.dragon,false);
            primaryInvestmentMap.setKey(BoS.enum.beast,true);
          } else {
            secondaryInvestmentMap.setKey(BoS.enum.dragon,false);
            secondaryInvestmentMap.setKey(BoS.enum.beast,true);
          }
        }
        if (value === BoS.enum.none) {
          if(this._role === generalRole.enum.primary) {
            primaryInvestmentMap.setKey(BoS.enum.dragon,false);
            primaryInvestmentMap.setKey(BoS.enum.beast,false);
          } else {
            secondaryInvestmentMap.setKey(BoS.enum.dragon,false);
            secondaryInvestmentMap.setKey(BoS.enum.beast,false);
          }
        }
      } else {
        console.error(valid.error)
      }
    
    } else {
    }
  }

  private getBoS_Setting(): BoSType {
    let returnValue: BoSType = BoS.enum.none;
    
    if(this._dragon === true) {
      returnValue = BoS.enum.dragon;
    }else if(this._beast === true) {
      returnValue = BoS.enum.beast;
    }
    return returnValue;
  }

  private investmentMap: Record<string,  () => void> = {
    'primary': () => {
      let returnable: b.qualityColorType = b.qualityColor.enum.Gold;
      primaryInvestmentMap.subscribe(pm => {
        returnable = pm.speciality1 !== undefined ? pm.speciality1 : b.qualityColor.enum.Gold;
      })
      this._speciality1 = returnable;

      returnable = b.qualityColor.enum.Gold;
      primaryInvestmentMap.subscribe(pm => {
        returnable = pm.speciality2 !== undefined ? pm.speciality2 : b.qualityColor.enum.Gold;
      })
      this._speciality2 = returnable;

      returnable = b.qualityColor.enum.Gold;
      primaryInvestmentMap.subscribe(pm => {
        returnable = pm.speciality3 !== undefined ? pm.speciality3 : b.qualityColor.enum.Gold;
      })
      this._speciality3 = returnable;

      returnable = b.qualityColor.enum.Gold;
      primaryInvestmentMap.subscribe(pm => {
        if(
          pm.speciality4 !== undefined && 
          pm.speciality1 === b.qualityColor.enum.Gold && 
          pm.speciality2 === b.qualityColor.enum.Gold && 
          pm.speciality3 === b.qualityColor.enum.Gold
        ) {
          this.Special4disabledValue = false;
          returnable = pm.speciality4;
        } else if (
          pm.speciality1 !== b.qualityColor.enum.Gold ||
          pm.speciality2 !== b.qualityColor.enum.Gold ||
          pm.speciality3 !== b.qualityColor.enum.Gold 
        ) {
          this.Special4disabledValue = true
          returnable = b.qualityColor.enum.Disabled
        } else {
          this.Special4disabledValue = false;
          returnable = b.qualityColor.enum.Gold
        }
      })
      this._speciality4 = returnable;
      primaryInvestmentMap.subscribe(pm => {
        if(pm.dragon !== undefined) {
          this._dragon = pm.dragon;
        }
        if(pm.beast !== undefined) {
          this._beast = pm.beast;
        }
        if(pm.ascending !== undefined) {
          this._ascending = pm.ascending;
        }
      })
    },
    'secondary':  () => {
      let returnable: b.qualityColorType = b.qualityColor.enum.Gold;
      secondaryInvestmentMap.subscribe(pm => {
        returnable = pm.speciality1 !== undefined ? pm.speciality1 : b.qualityColor.enum.Gold;
      })
      this._speciality1 = returnable;

      returnable = b.qualityColor.enum.Gold;
      secondaryInvestmentMap.subscribe(pm => {
        returnable = pm.speciality2 !== undefined ? pm.speciality2 : b.qualityColor.enum.Gold;
      })
      this._speciality2 = returnable;

      returnable = b.qualityColor.enum.Gold;
      secondaryInvestmentMap.subscribe(pm => {
        returnable = pm.speciality3 !== undefined ? pm.speciality3 : b.qualityColor.enum.Gold;
      })
      this._speciality3 = returnable;

      returnable = b.qualityColor.enum.Gold;
      secondaryInvestmentMap.subscribe(pm => {
        if(
          pm.speciality4 !== undefined && 
          pm.speciality1 === b.qualityColor.enum.Gold && 
          pm.speciality2 === b.qualityColor.enum.Gold && 
          pm.speciality3 === b.qualityColor.enum.Gold
        ) {
          this.Special4disabledValue = false;
          returnable = pm.speciality4;
        } else if (
          pm.speciality1 !== b.qualityColor.enum.Gold ||
          pm.speciality2 !== b.qualityColor.enum.Gold ||
          pm.speciality3 !== b.qualityColor.enum.Gold 
        ) {
          this.Special4disabledValue = true
          returnable = b.qualityColor.enum.Disabled
        } else {
          this.Special4disabledValue = false;
          returnable = b.qualityColor.enum.Gold
        }
      })
      this._speciality4 = returnable;
      secondaryInvestmentMap.subscribe(pm => {
        if(pm.dragon !== undefined) {
          this._dragon = pm.dragon;
        } else {
          this._dragon = false;
        }
        if(pm.beast !== undefined) {
          this._beast = pm.beast;
        } else {
          this._beast = false;
        }
        if(pm.ascending !== undefined) {
          this._ascending = pm.ascending;
        } else {
          this._ascending = b.levels.enum[0];
        }
      })
    },
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
  
  `;
  
  
  public render() {

    let debuffHtml = html``;
    let ascendingHtml = html``;
    if (this._role === generalRole.enum.primary) {
      debuffHtml = html`
        <div>
          <sp-field-group horizontal>
            <sp-switch 
              value=${this.debuffLead} 
              checked=${this.debuffLead ? 'true' : nothing }
              onclick="this.dispatchEvent(new Event('debuff', {bubbles: true, composed: true}))"
              >
              Will you be the Primary Debuff
            </sp-switch>
          </sp-field-group horizontal>
        </div>
      `;
      ascendingHtml = html`
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
          </div>`;
    }
    return html`
        <div class="fieldGroup">
            <p id="InvestmentFieldGroupHeader">${this._role.charAt(0).toUpperCase() + this._role.slice(1)} General</p>
            ${debuffHtml}
            <sp-field-group horizontal>
                <sp-help-text slot="help-text">Indicate your investment level in the generals.</sp-help-text>
                ${ascendingHtml}
                <div>
                    <sp-field-label for="Speciality1" size="s">1st Speciality</sp-field-label>
                    <sp-picker 
                      id="Speciality1" size="s" 
                      label=${this._speciality1} 
                      value=${this._speciality1}
                      @change=${this.changeHandler}
                      >
                        <sp-menu-item value=${b.qualityColor.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality2" size="s">2nd Speciality</sp-field-label>
                    <sp-picker 
                      id="Speciality2" size="s" 
                      label=${this._speciality2} 
                      value=${this._speciality2}
                      @change=${this.changeHandler}
                      >
                        <sp-menu-item value=${b.qualityColor.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality3" size="s">3rd Speciality</sp-field-label>
                    <sp-picker 
                      id="Speciality3" size="s" 
                      label=${this._speciality3} 
                      value=${this._speciality3}
                      @change=${this.changeHandler}
                      >
                        <sp-menu-item value=${b.qualityColor.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality4" size="s">4th Speciality</sp-field-label>
                    <sp-picker 
                      id="Speciality4" size="s" 
                      label=${this._speciality4} 
                      value=${this._speciality4}
                      disabled=${this.Special4disabledValue ? true : nothing}
                      @change=${this.changeHandler}
                      >
                        <sp-menu-item value=${b.qualityColor.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${b.qualityColor.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
            </sp-field-group>
            <sp-field-group>
              <div >
                  <sp-radio-group label="Small" label="BoS" horizontal
                  selected=${ this.getBoS_Setting() } 
                  @change=${this.radioHandler}>
                    <sp-radio value=${BoS.enum.none} size="m">none</sp-radio>
                    <sp-radio value=${BoS.enum.beast} size="m">Spiritual Beast Assigned</sp-radio>
                    <sp-radio value=${BoS.enum.dragon} size="m">Dragon Assigned</sp-radio>
                  </sp-radio-group>
                </div>
            </sp-field-group
        </div>
    `
    
  }
}
if (!customElements.get('investment-selector')) {
  customElements.define('investment-selector', InvestmentSelector)
}
