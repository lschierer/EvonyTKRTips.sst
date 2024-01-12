import {html, css, nothing, type PropertyValues} from "lit";
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
import {SpectrumElement} from "@spectrum-web-components/base";

import {
  dragon,
  generalUseCase,
  type generalUseCaseType,
  levels,
  type levelsType,
  qualityColor,
  type qualityColorType,
  Speciality,
} from "@schemas/index";

import {BoS, type BoSType, type generalInvestment, primaryInvestmentMap, secondaryInvestmentMap} from './generalInvestmentStore';

const generalRole = z.enum(['primary','secondary']);
type generalRoleType = z.infer<typeof generalRole>;

@customElement('investment-selector')
export class InvestmentSelector extends withStores(SpectrumElement, [primaryInvestmentMap, secondaryInvestmentMap]) {
  
  @property({type: String})
  public generalRole: string;

  @state()
  private _role: generalRoleType;

  @state()
  private disableSpecial4: boolean = false;
  
  private Special4disabledValue: qualityColorType = qualityColor.enum.Gold;
  
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
    
  }
  
  willUpdate(changedProperties: PropertyValues<this>) {
    if(changedProperties.has('generalRole')) {
      const valid = generalRole.safeParse(this.generalRole);
      if(valid.success) {
        this._role = valid.data;
        let initialsetcounter = 0;
        if (!this.investmentMapGet[this._role]['speciality1']()) { 
          initialsetcounter++;
          if(this._role === generalRole.enum.primary) {
            primaryInvestmentMap.setKey('speciality1',qualityColor.enum.Gold)
          } else {
            secondaryInvestmentMap.setKey('speciality1',qualityColor.enum.Gold)
          }
        }
        if (!this.investmentMapGet[this._role]['speciality2']() ) { 
          initialsetcounter++;
          if(this._role === generalRole.enum.primary) {
            primaryInvestmentMap.setKey('speciality2',qualityColor.enum.Gold)
          } else {
            secondaryInvestmentMap.setKey('speciality2',qualityColor.enum.Gold)
          }
        }
        if (!this.investmentMapGet[this._role]['speciality3']() ) { 
          initialsetcounter++;
          if(this._role === generalRole.enum.primary) {
            primaryInvestmentMap.setKey('speciality3',qualityColor.enum.Gold)
          } else {
            secondaryInvestmentMap.setKey('speciality3',qualityColor.enum.Gold)
          }
        }
        if (!this.investmentMapGet[this._role]['speciality4']() ) { 
          initialsetcounter++;
          if(this._role === generalRole.enum.primary) {
            primaryInvestmentMap.setKey('speciality4',qualityColor.enum.Gold)
          } else {
            secondaryInvestmentMap.setKey('speciality4',qualityColor.enum.Gold)
          }
        }
        if(initialsetcounter === 4) {
          if(this._role === generalRole.enum.primary) {
            primaryInvestmentMap.setKey('ascending', '10')
            primaryInvestmentMap.setKey(BoS.enum.dragon, true);
            primaryInvestmentMap.setKey(BoS.enum.beast, false);
          } else {
            secondaryInvestmentMap.setKey('ascending', '0')
            secondaryInvestmentMap.setKey(BoS.enum.dragon,false);
            secondaryInvestmentMap.setKey(BoS.enum.beast,false);
          }
        }
      }
    }
  }


  protected changeHandler(e: CustomEvent) {
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
    if (this._role === generalRole.enum.primary) {
      if (!picker.id.localeCompare('ascending')) {
        const validation = levels.safeParse(picker.value)
        if (validation.success) {
          primaryInvestmentMap.setKey('ascending', validation.data)
        }
      } else if (!picker.id.localeCompare('Speciality1')) {
        const validation = qualityColor.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality1', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality2')) {
        const validation = qualityColor.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality2', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality3')) {
        const validation = qualityColor.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality3', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality4')) {
        const validation = qualityColor.safeParse(picker.value);
        if (validation.success) {
          primaryInvestmentMap.setKey('speciality4', validation.data);
        }
      }
    } else {
      if (!picker.id.localeCompare('ascending')) {
        const validation = levels.safeParse(picker.value)
        if (validation.success) {
          secondaryInvestmentMap.setKey('ascending', validation.data)
        }
      } else if (!picker.id.localeCompare('Speciality1')) {
        const validation = qualityColor.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality1', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality2')) {
        const validation = qualityColor.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality2', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality3')) {
        const validation = qualityColor.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality3', validation.data);
        }
      } else if (!picker.id.localeCompare('Speciality4')) {
        const validation = qualityColor.safeParse(picker.value);
        if (validation.success) {
          secondaryInvestmentMap.setKey('speciality4', validation.data);
        }
      }
    }
    secondaryInvestmentMap.setKey('ascending', '0');
    if(picker.id.localeCompare('Speciality4')){
      this.disable4();
    }
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
    const dragon = (this._role === generalRole.enum.primary) ? 
      primaryInvestmentMap.subscribe(pm => {
        if(pm.dragon === true) {
          returnValue = BoS.enum.dragon;
        }
      }) :
      secondaryInvestmentMap.subscribe(sm => {
        if(sm.dragon === true) {
          returnValue = BoS.enum.dragon;
        }
      })

    const beast = (this._role === generalRole.enum.primary) ? 
    primaryInvestmentMap.subscribe(pm => {
      if(pm.beast === true) {
        returnValue = BoS.enum.beast;
      }
    }) :
    secondaryInvestmentMap.subscribe(sm => {
      if(sm.beast === true) {
        returnValue = BoS.enum.beast;
      }
    })

    return returnValue;

  }

  private investmentMapGet: Record<string,  Record<string, () => string>> = {
    'primary':  {
      'speciality1': () => {return primaryInvestmentMap.get().speciality1 },
      'speciality2': () => {return primaryInvestmentMap.get().speciality2 },
      'speciality3': () => {return primaryInvestmentMap.get().speciality3 },
      'speciality4': () => {return primaryInvestmentMap.get().speciality4 },
    },
    'secondary':  {
      'speciality1': () => {return secondaryInvestmentMap.get().speciality1},
      'speciality2': () => {return secondaryInvestmentMap.get().speciality2},
      'speciality3': () => {return secondaryInvestmentMap.get().speciality3},
      'speciality4': () => {return secondaryInvestmentMap.get().speciality4},
    }
  }
  
  private disabler: Record<string, (tf: boolean) => void> = {
    'primary' : (tf: boolean) => {
      if(tf) {
        primaryInvestmentMap.setKey('speciality4', qualityColor.enum.Disabled);
        this.disableSpecial4 = true;
      } else {
        primaryInvestmentMap.setKey('speciality4',this.Special4disabledValue)
        this.disableSpecial4 = false;
      }
    },
    'secondary' : (tf) => {
      if(tf) {
        secondaryInvestmentMap.setKey('speciality4', qualityColor.enum.Disabled);
        this.disableSpecial4 = true;
      } else {
        secondaryInvestmentMap.setKey('speciality4',this.Special4disabledValue)
        this.disableSpecial4 = false;
      }
    },
  }

  private disable4 (){
        
    let specials = new Array<qualityColorType>();
    let value = qualityColor.safeParse(this.investmentMapGet[this._role]['speciality1']());
    if(value.success){
      specials.push(value.data);
    }
    value = qualityColor.safeParse(this.investmentMapGet[this._role]['speciality2']());
    if(value.success){
      specials.push(value.data);
    }
    value = qualityColor.safeParse(this.investmentMapGet[this._role]['speciality3']());
    if(value.success){
      specials.push(value.data);
    }
    if(specials.includes(qualityColor.enum.Disabled)) {
      const value = qualityColor.safeParse(this.investmentMapGet[this._role]['speciality4']());
      if(value.success) {
        this.Special4disabledValue = value.data;
      }
      this.disabler[this._role](true);
    } else if ( specials.includes(qualityColor.enum.Green)) {
      const value = qualityColor.safeParse(this.investmentMapGet[this._role]['speciality4']());
      if(value.success) {
        this.Special4disabledValue = value.data;
      }
      this.disabler[this._role](true);
    } else if (specials.includes(qualityColor.enum.Blue)) {
      const value = qualityColor.safeParse(this.investmentMapGet[this._role]['speciality4']());
      if(value.success) {
        this.Special4disabledValue = value.data;
      }
      this.disabler[this._role](true);
    } else if (specials.includes(qualityColor.enum.Purple)) {
      const value = qualityColor.safeParse(this.investmentMapGet[this._role]['speciality4']());
      if(value.success) {
        this.Special4disabledValue = value.data;
      }
      this.disabler[this._role](true);
    } else if (specials.includes(qualityColor.enum.Orange)){
      const value = qualityColor.safeParse(this.investmentMapGet[this._role]['speciality4']());
      if(value.success) {
        this.Special4disabledValue = value.data;
      }
      this.disabler[this._role](true);
    } else {
      this.disabler[this._role](false);
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
  
  `;
  
  
  public render() {
    let ascendingHtml = html``;
    if (this._role === generalRole.enum.primary) {
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
            <sp-field-group horizontal>
                <sp-help-text slot="help-text">Indicate your investment level in the generals.</sp-help-text>
                ${ascendingHtml}
                <div>
                    <sp-field-label for="Speciality1" size="s">1st Speciality</sp-field-label>
                    <sp-picker id="Speciality1" size="s" label=${this.investmentMapGet[this._role]['speciality1']()} value=${this.investmentMapGet[this._role]['speciality1']()}
                               @change=${this.changeHandler}>
                        <sp-menu-item value=${qualityColor.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality2" size="s">2nd Speciality</sp-field-label>
                    <sp-picker id="Speciality2" size="s" label=${this.investmentMapGet[this._role]['speciality2']()} value=${this.investmentMapGet[this._role]['speciality2']()}
                               @change=${this.changeHandler}>
                        <sp-menu-item value=${qualityColor.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality3" size="s">3rd Speciality</sp-field-label>
                    <sp-picker id="Speciality3" size="s" label=${this.investmentMapGet[this._role]['speciality3']()} value=${this.investmentMapGet[this._role]['speciality3']()}
                               @change=${this.changeHandler}>
                        <sp-menu-item value=${qualityColor.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Gold}>Gold</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="Speciality4" size="s">4th Speciality</sp-field-label>
                    <sp-picker id="Speciality4" size="s" label=${this.investmentMapGet[this._role]['speciality4']()} value=${this.investmentMapGet[this._role]['speciality4']()}
                               ?disabled=${this.disableSpecial4}
                               @change=${this.changeHandler}>
                        <sp-menu-item value=${qualityColor.enum.Disabled}>Not Active</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Green}>Green</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Blue}>Blue</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Purple}>Purple</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Orange}>Orange</sp-menu-item>
                        <sp-menu-item value=${qualityColor.enum.Gold}>Gold</sp-menu-item>
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
