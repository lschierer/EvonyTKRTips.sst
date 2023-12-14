import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';

import { withStores } from "@nanostores/lit";

import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import {SpectrumElement} from "@spectrum-web-components/base";

import {
  generalUseCase,
  type generalUseCaseType, ClassEnum
} from "@schemas/index";
import {type generalInvestment, typeAndUseMap} from './generalInvestmentStore.ts';

@customElement('interest-selector')
export class InterestSelector extends withStores(SpectrumElement,[typeAndUseMap]) {

  constructor() {
    super();
  }
  
  private MutationObserverCallback = (mutationList: MutationRecord[] , observer: MutationObserver) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
      } else if (mutation.type === "attributes") {
      }
    }
  };
  
  private observer = new MutationObserver(this.MutationObserverCallback);
  
  protected  changeHandler(e: Event) {
    let myEvent = new CustomEvent('PickerChanged',{
      detail: {
        id: (e.target as Picker).id,
        value: (e.target as Picker).value,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(myEvent);
    const picker = (e.target as Picker);
    if(!picker.id.localeCompare('unitClass')){
      const validation = ClassEnum.safeParse(picker.value);
      if(validation.success) {
        typeAndUseMap.setKey('type', validation.data)
      }
    }
    if(!picker.id.localeCompare('generalUse')){
      const validation = generalUseCase.safeParse(picker.value);
      if (validation.success){
        typeAndUseMap.setKey('use',validation.data);
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
    }
  `
  
  public render () {
    return html`
      <div class="fieldGroup">
          <sp-field-group horizontal>
            <sp-help-text slot="help-text">Which generals are you interested in?</sp-help-text>
            <div>
              <sp-field-label for="unitClass" size="s">Filter by Type</sp-field-label>
              <sp-picker id="unitClass" size="s" label="All" value="all" @change=${this.changeHandler}>
                <sp-menu-item value="all">All Generals</sp-menu-item>
                <sp-menu-item value="Mounted">Mounted Generals</sp-menu-item>
                <sp-menu-item value="Ground">Ground Generals</sp-menu-item>
                <sp-menu-item value="Archers">Archer Generals</sp-menu-item>
                <sp-menu-item value="Siege">Siege Generals</sp-menu-item>
              </sp-picker>
            </div>
            <div>
              <sp-field-label for="generalUse" size="s">
                General Use Case
                <sp-tooltip placement="right-end" self-managed variant="info">Some buffs apply only in certain
                  use cases. This determines which buffs will be used to determine the general's attributes. Wall
                  Generals and SubCity Mayors are sufficiently different as to require a totally different table.
                </sp-tooltip>
              </sp-field-label>
              <sp-picker id="generalUse" size="s" label="All" value="all" @change=${this.changeHandler}>
                <sp-menu-item value="all">All Generals</sp-menu-item>
                <sp-menu-item value=${generalUseCase.enum.Monsters}>Monster Hunting</sp-menu-item>
                <sp-menu-item value=${generalUseCase.enum.Attack}>Attacking Only</sp-menu-item>
                <sp-menu-item value=${generalUseCase.enum.Defense}>Reinforcing and Defending</sp-menu-item>
                <sp-menu-item value=${generalUseCase.enum.Overall}>All Purpose</sp-menu-item>
                <sp-menu-divider size="s"></sp-menu-divider>
                <sp-menu-item disabled>Wall Generals</sp-menu-item>
                <sp-menu-item disabled>SubCity Mayors</sp-menu-item>

              </sp-picker>
            </div>
          </sp-field-group>
      </div>
    `
    
  }
}
