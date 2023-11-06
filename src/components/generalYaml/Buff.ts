import { type ReactiveController, type ReactiveControllerHost, html, css, type PropertyValues, type CSSResultArray, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef,  type Ref} from 'lit/directives/ref.js';
import { StoreController } from "@nanostores/lit";

const DEBUG = false;


import { SpectrumElement } from '@spectrum-web-components/base';

import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/table/elements.js';
import { FieldGroup } from '@spectrum-web-components/field-group';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import { NumberField } from '@spectrum-web-components/number-field';
import '@spectrum-web-components/number-field/sp-number-field.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';
import '@spectrum-web-components/split-view/sp-split-view.js';
import '@spectrum-web-components/status-light/sp-status-light.js';
import { Textfield } from '@spectrum-web-components/textfield';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import { parse, stringify } from 'yaml'

import {addValue, formValues } from './dataStore.ts';


import * as b from '@schemas/baseSchemas.ts'

export class GeneralBuffController implements ReactiveController {
  private host: ReactiveControllerHost;

  private formValuesController;

  constructor(host: ReactiveControllerHost, timeout = 1000) {
    this.host = host;
    this.host.addController(this);
    this.formValuesController  = new StoreController(this.host,formValues);

  }

  hostConnected() {
  }

  hostDisconnected(): void {
    
  }

  
  render(level: string, sindex: number, side: 'left' | 'right') {
    const fieldLabel = sindex.toString() + '_' + level;
    if (side === 'left') {
      return html`
        <sp-field-label for=${fieldLabel.concat('_condition')} required>Adjective</sp-field-label>
        <sp-picker id=${fieldLabel.concat('_condition')} size="s" value="always" label="When does this take effect" @change=${(this.host as GeneralYaml).sformHandler}>
          <sp-menu-item value="always">All The Time, On All Troops</sp-menu-item>
          <sp-menu-item value="Marching">Marching</sp-menu-item>
          <sp-menu-item value="Attacking">Attacking</sp-menu-item>
          <sp-menu-item value="When_Rallying">When Launcing A Rally</sp-menu-item>
          <sp-menu-item value="leading_the_army_to_attack">when leading the army to attack</sp-menu-item>
          <sp-menu-item value="dragon_to_the_attack">when general brings a dragon to the attack</sp-menu-item>
          <sp-menu-item value="brings_dragon_or_beast_to_attack">when general brings a dragon or spiritual beast to the attack</sp-menu-item>
          <sp-menu-item value='Reinforcing'>When Reinforcing</sp-menu-item>
          <sp-menu-item value='In_City'>When In City</sp-menu-item>
          <sp-menu-item value='Defending'>When Defending</sp-menu-item>
          <sp-menu-item value='When_The_Main_Defense_General'>When the General is the Main Defense General</sp-menu-item>
          <sp-menu-item value='When_the_City_Mayor'>When the General is a SubCity mayor</sp-menu-item>
          <sp-menu-item value='During_SvS'>During SvS</sp-menu-item>
          <sp-menu-item value='When_an_officer'>When the General is the Duty Officer</sp-menu-item>
          <sp-menu-item value='Against_Monsters'>Against Monsters</sp-menu-item>
          <sp-menu-item value='Reduces_Enemy'>This is a pure debuff</sp-menu-item>
          <sp-menu-item value='Enemy'>attribute has the adjective "enemy"</sp-menu-item>
          <sp-menu-item value='Enemy_In_City'>attribute affects troops in the enemy's city</sp-menu-item>
          <sp-menu-item value='Reduces_Monster'>a debuff against monsters</sp-menu-item>
        </sp-picker>

        
        `  
    } else {  
      console.log(`render right`)
      let exportable = `    - ${level}:`
      exportable = `${exportable}\n      buff:`
      exportable = `${exportable}\n        - attribute:`
      const condition_label = fieldLabel.concat('_condition');
      let condition: number | string | undefined = this.formValuesController.value.get(condition_label) 
      if(condition === undefined) {
        condition = 'value pending'
      }
      console.log(`buff; condition from ${condition_label} is ${condition}`)
      if( condition !== undefined && condition !== null ) {
        console.log(`buff; condition if for ${condition}`)
        exportable = `${exportable}\n          condition: ${condition}`
        console.log(`exportable is \n${exportable}`)
      } else {
        console.log(`condition ${condition} was undefined`)
      }

      exportable = `${exportable}\n          class:`
      exportable = `${exportable}\n          value:`
      exportable = `${exportable}\n            number:`
      exportable = `${exportable}\n            unit:`
      return html`${exportable}`;
    }
  }

}