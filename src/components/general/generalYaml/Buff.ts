import { type ReactiveController, type ReactiveControllerHost, html, css, type PropertyValues, type CSSResultArray, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef,  type Ref} from 'lit/directives/ref.js';
import { StoreController } from "@nanostores/lit";

const DEBUG = false;


import { SpectrumElement } from '@spectrum-web-components/base';

import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/checkbox/sp-checkbox.js';
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
import '@spectrum-web-components/switch/sp-switch.js';


import { parse, stringify } from 'yaml'

import {addValue, getValue, formValues } from '../../formValueStore';


import * as b from '@schemas/baseSchemas.ts'

type GeneralYaml = /*unresolved*/ any;

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

  
  render(level: string, sindex: string, side: 'left' | 'right', rkey?: string) {
    let fieldLabel = sindex + '_' + level;
    console.log(`fieldLable is ${fieldLabel}`)
    if (side === 'left') {
      return html`
        <sp-field-label for=${fieldLabel.concat('_condition')} required>Adjective</sp-field-label>
        <sp-picker id=${fieldLabel.concat('_condition')} size="s" value="always" label="When does this take effect" @change=${(this.host as GeneralYaml).sformHandler}>
          ${b.Condition.options.flatMap((c)=> {
            return html`
            <sp-menu-item value="${c}">${c.replaceAll('_',' ')}</sp-menu-item>
            `
          })}
        </sp-picker>

        <sp-field-label for=${fieldLabel.concat('_attribute')} required>Attribute</sp-field-label>
        <sp-picker id=${fieldLabel.concat('_attribute')} size="s" value="always" label="When does this take effect" @change=${(this.host as GeneralYaml).sformHandler}>
          ${b.AttributeSchema.options.flatMap((a) => {
            return html`
              <sp-menu-item value="${a}">${a.replaceAll('_',' ')}</sp-menu-item>
            `
          })}
        </sp-picker>

        <sp-field-label for=${fieldLabel.concat('_class')} >Troop Class</sp-field-label>
        <sp-picker id=${fieldLabel.concat('_class')} size="s" value="all" label="When does this take effect" @change=${(this.host as GeneralYaml).sformHandler}>
          <sp-menu-item value="Archers">Archers</sp-menu-item>
          <sp-menu-item value="Ground">Ground Troops</sp-menu-item>
          <sp-menu-item value="Mounted">Mounted Troops</sp-menu-item>
          <sp-menu-item value="Siege">Siege Machines</sp-menu-item>
          <sp-menu-item value="all">All Types</sp-menu-item>
          <sp-menu-item value="none">Not Applicable</sp-menu-item>
        </sp-picker>

        <sp-field-label  for=${fieldLabel.concat('_value')} >Buff Value/Amount</sp-field-label>
        <sp-field-group class="not-content valueFieldGroup" horizontal id="${fieldLabel.concat('_value')}">
          <sp-number-field
                id=${fieldLabel.concat('_valueN')}
                value="0"
                format-options='{
                  "signDisplay": "exceptZero",
                  "minimumFractionDigits": 1,
                  "maximumFractionDigits": 2
                }'
                @change=${(this.host as GeneralYaml).sformHandler}
              ></sp-number-field>
          <sp-checkbox size="m" 
            id=${fieldLabel.concat('_valueU')} 
            checked 
            @change=${(this.host as GeneralYaml).sformHandler}
            >Value is a percentage</sp-checkbox>
        </sp-field-group>
        `  
    } else {  
      console.log(`buff render right`)
      let exportable = '';
      console.log(`buff render right; exportable is \n${exportable}`)
      if(rkey !== undefined && rkey !== null) {
        let initialBlanks = '    ';
        if(!rkey.localeCompare('b1numattrs')){
          initialBlanks = `${initialBlanks}  `
        } else {
          initialBlanks = `${initialBlanks}    `
        }
        console.log(`rkey is ${rkey}`)
        if(getValue(rkey)) {
          if(level.localeCompare('special')) {
            exportable = `${initialBlanks}- level: '${level}'`
            exportable = `${exportable}\n${initialBlanks}  buff:`
          } else {
            exportable = `${initialBlanks}buff:`
          }
          
        }
        for(let i = 0; i < (getValue(rkey) as number); i++) {
          fieldLabel = sindex + i.toString() + '_' + level;
          console.log(`new label is ${fieldLabel}`)
          const attribute: number | string |boolean |null| undefined = getValue(fieldLabel.concat('_attribute')) 
          if(attribute === undefined || attribute === null) {
            console.log(`${exportable}\n${initialBlanks}- attribute: value pending`)
          } else {
            exportable = `${exportable}\n${initialBlanks}  - attribute: ${attribute}`
          }
          
          const condition_label = fieldLabel.concat('_condition');
          const condition: number | string |boolean |null| undefined = getValue(condition_label) 
          if(condition === undefined || condition === null) {
            console.log(`${exportable}\n${initialBlanks}  condition: value pending`)
          } else {
            if(condition.toLocaleString().localeCompare('always')){
              exportable = `${exportable}\n${initialBlanks}    condition: ${condition}`
            }
            
          }
  
          const tclass: number | string |boolean |null| undefined = getValue(fieldLabel.concat('_class')) 
          if(tclass === undefined || tclass === null) {
            console.log(`${exportable}\n${initialBlanks}  class: value pending`);
          } else if((tclass !== 'all') && (tclass !== 'none')) {
            exportable = `${exportable}\n${initialBlanks}    class: ${tclass}`
          }
  
          const tvalue: number | string |boolean |null| undefined = getValue(fieldLabel.concat('_valueN')) 
          if(tvalue === undefined || tvalue === null) {
            console.log(`${exportable}\n${initialBlanks}  value: value pending`)
          } else  {
            exportable = `${exportable}\n${initialBlanks}    value:`
            exportable = `${exportable}\n${initialBlanks}      number: ${tvalue}`
            let tcheck: number | string |boolean |null| undefined = getValue(fieldLabel.concat('_valueU'))
            if(tcheck === undefined || tcheck === 'percentage') {
              tcheck = 'percentage';
            }
            exportable = `${exportable}\n${initialBlanks}      unit: ${tcheck}`
          }
        }
      } else {
        console.error(`no rkey for render right`)
      }
      
      return html`${exportable}`;
    }
  }

}