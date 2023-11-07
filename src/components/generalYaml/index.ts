import {  html, css, type TemplateResult, type PropertyValues, type CSSResultArray, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef,  type Ref} from 'lit/directives/ref.js';
import {guard} from 'lit/directives/guard.js';
import { withStores } from "@nanostores/lit";


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

import {GeneralBuffController} from "./Buff.ts"

import {addValue, formValues } from './dataStore.ts';

import * as b from "@schemas/baseSchemas.ts";

export class GeneralYaml extends withStores(SpectrumElement, [formValues]) {

  private findMe: Ref<HTMLElement> = createRef();

  @state()
  private specialities: boolean = false; 
  
  @state()
  private buffEventPending: Record<string,boolean> = {};

  private buffs = new GeneralBuffController(this);

  constructor() {
    super();
  }

  public static override get styles(): CSSResultArray {
    const localstyle = css`
      div.Intrinsic {
        display: flex;
        flex-direction: column;

        & div.leadership, div.attack, div.defense, div.politics {
          display: flex;
          width: 100%;
          flex-direction: row;
          justify-content: flex-start;
          gap: var(--spectrum-global-dimension-size-125);
          
          #leadership, #lgi, #attack, #agi, #defense, #dgi, #politics, #pgi {
            width: 7rem;
          }
        }
      }
      div.specialities {
        & div.green, div.blue, div.purple, div.orange, div.gold {
          span.h5 {
            font-weight: bold;
          }         
        }
        .valueFieldGroup {
          background-color: var(--spectrum-celery-600);
          width: 100%;

          & sp-number-field {
            width: 7rem;
          }
        }
      }
      #CardDiv {
        display: flex-wrap;
        flex-direciton: column;
        flex: 1 1 auto;
        height: 60vh;

        & #result {
          width: 100%;
          height: 59vh;
        }
      }

      `
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];

  }

  public connectedCallback(){
    super.connectedCallback()
  }
  
  public willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(_changedProperties);
    console.log(`index willUpdate`)

    if(_changedProperties.has('buffEventPending')) {
      console.log(`buffUpdatePending detected`)
    }
  }

  

  protected formHandler(e: CustomEvent) {
    console.log(`index; formhandler`)
    const target = e.target;
    if(target !== null && target !== undefined) {
      console.log(`${(target as Element).id} has ${target.value}`)
      addValue((target as Element).id, target.value);
      this.requestUpdate()
    }
  }

  public sformHandler(e: CustomEvent) {
    console.log(`index; sformhandler`)
    const target = e.target;
    if(target !== null && target !== undefined) {
      console.log(`${(target as Element).id} has ${target.value}`)
      if((target as Element).id.includes('_valueU')) {
        if(target.checked === false) {
          addValue((target as Element).id, 'flat');
        } else {
          addValue((target as Element).id, 'percentage');
        }
        if(target.checked !== undefined && target.checked !== null) {
          this.buffEventPending[(target as Element).id] = true;
        } else {
          this.buffEventPending[(target as Element).id] = false;
        }
      } else {
        addValue((target as Element).id, target.value);
        if((target.value !== '') && (target.value !== false)) {
          this.buffEventPending[(target as Element).id] = true;
        } else {
          this.buffEventPending[(target as Element).id] = false;
        }
      }
      this.requestUpdate()
    }
  }

  renderLeft() {
    const s1gT = new Array<TemplateResult>();
    const s1bT = new Array<TemplateResult>();
    const s1pT = new Array<TemplateResult>();
    const s1oT = new Array<TemplateResult>();
    const s1GT = new Array<TemplateResult>();
    const s2gT = new Array<TemplateResult>();
    const s2bT = new Array<TemplateResult>();
    const s2pT = new Array<TemplateResult>();
    const s2oT = new Array<TemplateResult>();
    const s2GT = new Array<TemplateResult>();
    for(let i = 0; i < (formValues.value?.get('s1numattrs') as number); i++) {
      s1gT.push(this.buffs.render(b.qualityColor.enum.Green, `1.${i}`, 'left'))
      s1bT.push(this.buffs.render(b.qualityColor.enum.Green, `1.${i}`, 'left'))
      s1pT.push(this.buffs.render(b.qualityColor.enum.Green, `1.${i}`, 'left'))
      s1oT.push(this.buffs.render(b.qualityColor.enum.Green, `1.${i}`, 'left'))
      s1GT.push(this.buffs.render(b.qualityColor.enum.Green, `1.${i}`, 'left'))
    }
    for(let i = 0; i < (formValues.value?.get('s2numattrs') as number); i++) {
      s2gT.push(this.buffs.render(b.qualityColor.enum.Green, `2.${i}`, 'left'))
      s2bT.push(this.buffs.render(b.qualityColor.enum.Green, `2.${i}`, 'left'))
      s2pT.push(this.buffs.render(b.qualityColor.enum.Green, `2.${i}`, 'left'))
      s2oT.push(this.buffs.render(b.qualityColor.enum.Green, `2.${i}`, 'left'))
      s2GT.push(this.buffs.render(b.qualityColor.enum.Green, `2.${i}`, 'left'))
    }
  
  
    return html`
    <div class="GeneralsDetailsForm" ${ref(this.findMe)}>
      <div class="not-content Name">
        <sp-field-label for="name" required>General's Name</sp-field-label>
        <sp-textfield id="name" placeholder="Enter General's Name" @change=${this.formHandler}></sp-textfield>
      </div>
      <div class="not-content Intrinsic">
        <div class="not-content leadership">
          <div>
            <sp-field-label for="leadership" required >Leadership</sp-field-label>
            <sp-number-field
              id="leadership"
              value="0"
              format-options='{
                "signDisplay": "exceptZero",
                "minimumFractionDigits": 1,
                "maximumFractionDigits": 2
              }'
              @change=${this.formHandler}
            />
          </div>
          <div>
            <sp-field-label for="lgi" required >Growth Increment</sp-field-label>
            <sp-number-field
              id="lgi"
              value="0"
              format-options='{
                "signDisplay": "exceptZero",
                "minimumFractionDigits": 1,
                "maximumFractionDigits": 2
              }'
              @change=${this.formHandler}
            />
          </div>
        </div>
        <div class="not-content attack">
          <div>
            <sp-field-label for="attack" required>Attack</sp-field-label>
            <sp-number-field
              id="attack"
              value="0"
              format-options='{
                "signDisplay": "exceptZero",
                "minimumFractionDigits": 1,
                "maximumFractionDigits": 2
              }'
              @change=${this.formHandler}
            />
          </div>
          <div>
            <sp-field-label for="agi" required>Growth Increment</sp-field-label>
            <sp-number-field
              id="agi"
              value="0"
              format-options='{
                "signDisplay": "exceptZero",
                "minimumFractionDigits": 1,
                "maximumFractionDigits": 2
              }'
              @change=${this.formHandler}
            />
          </div>
        </div>
        <div class="not-content defense">
          <div>
            <sp-field-label for="defense" required>Defense</sp-field-label>
            <sp-number-field
              id="defense"
              value="0"
              format-options='{
                "signDisplay": "exceptZero",
                "minimumFractionDigits": 1,
                "maximumFractionDigits": 2
              }'
              @change=${this.formHandler}
            />
          </div>
          <div>
            <sp-field-label for="dgi" required>Growth Increment</sp-field-label>
            <sp-number-field
              id="dgi"
              value="0"
              format-options='{
                "signDisplay": "exceptZero",
                "minimumFractionDigits": 1,
                "maximumFractionDigits": 2
              }'
              @change=${this.formHandler}
            />
          </div>
        </div>
        <div class="not-content politics">
          <div>
            <sp-field-label for="politics" required>Politics</sp-field-label>
            <sp-number-field
              id="politics"
              value="0"
              format-options='{
                "signDisplay": "exceptZero",
                "minimumFractionDigits": 1,
                "maximumFractionDigits": 2
              }'
              @change=${this.formHandler}
            />
          </div>
          <div>
            <sp-field-label for="pgi" required>Growth Increment</sp-field-label>
            <sp-number-field
              id="pgi"
              value="0"
              format-options='{
                "signDisplay": "exceptZero",
                "minimumFractionDigits": 1,
                "maximumFractionDigits": 2
              }'
              @change=${this.formHandler}
            />
          </div>
        </div>
        <div>
          <sp-field-label for="score_as" size="s" required>General's Type</sp-field-label>
          <sp-picker id="score_as" size="s" label="pick one" @change=${this.formHandler}>
            <sp-menu-item value="Mounted">Mounted General</sp-menu-item>
            <sp-menu-item value="Ground">Ground General</sp-menu-item>
            <sp-menu-item value="Archers">Archer General</sp-menu-item>
            <sp-menu-item value="Siege">Siege General</sp-menu-item>
            <sp-menu-item value="Wall">Wall General</sp-menu-item>
            <sp-menu-item value="Mayor">SubCity Mayor</sp-menu-item>
          </sp-picker>
        </div>
      </div>
      <hr>
      <div class="not-content specialities">
        <sp-field-group id="specialities" >
          <div class="not-content speciality one">
            <sp-field-label for="s1name" required>Speciality Name</sp-field-label>
            <sp-textfield id="s1name" placeholder="Enter Speciality Name" @change=${this.sformHandler}></sp-textfield>
            <br/>
            <sp-field-label for="s1numattrs" required>Number of Attributes per Level</sp-field-label>
            <sp-number-field
                id='s1numattrs'
                value="0"
                size="m"
                style="--spectrum-stepper-width: 110px"
                @change=${this.formHandler}
                ></sp-number-field>
            <div class="not-content green">
                <span class="not-content h5">Green</span>
                ${s1gT}
            </div>
            <div class="not-content blue">
              <span class="not-content h5">Blue</span>
              ${s1bT}
            </div>
            <div class="not-content purple">
              <span class="not-content h5">Purple</span>
              ${s1pT}
            </div>
            <div class="not-content orange">
              <span class="not-content h5">Orange</span>
              ${s1oT}
            </div>
            <div class="not-content gold">
              <span class="not-content h5">Gold</span>
              ${s1GT}
            </div>
          </div>
          <div class="not-content speciality two">
            <sp-field-label for="s2name" required>Speciality Name</sp-field-label>
            <sp-textfield id="s2name" placeholder="Enter Speciality Name" @change=${this.sformHandler}></sp-textfield>
            <br/>
            <sp-field-label for="s1numattrs" required>Number of Attributes per Level</sp-field-label>
            <sp-number-field
                id='s2numattrs'
                value="0"
                size="m"
                style="--spectrum-stepper-width: 110px"
                @change=${this.formHandler}
                ></sp-number-field>
            <div class="not-content green">
                <span class="not-content h5">Green</span>
                ${s2gT}
            </div>
            <div class="not-content blue">
              <span class="not-content h5">Blue</span>
              ${s2bT}
            </div>
            <div class="not-content purple">
              <span class="not-content h5">Purple</span>
              ${s2pT}
            </div>
            <div class="not-content orange">
              <span class="not-content h5">Orange</span>
              ${s2oT}
            </div>
            <div class="not-content gold">
              <span class="not-content h5">Gold</span>
              ${s2GT}
            </div>
          </div>
          <div class="not-content speciality three">
          </div>
          <div class="not-content speciality four">
          </div>
        </sp-field-group>
      </div>
    </div>
    `
  }

  renderRight(){
    
    console.log(`renderRight`)
    let exportable='---';
    if(formValues.value !== null && formValues.value !== undefined) {
      exportable = `${exportable}\ngeneral:`;
      exportable = `${exportable}\n  name: ${formValues.value.get('name')}`;
      exportable = `${exportable}\n  display: summary`;
      exportable = `${exportable}\n  leadership: ${formValues.value.get('leadership')}`;
      exportable = `${exportable}\n  leadership_increment: ${formValues.value.get('lgi')}`;
      exportable = `${exportable}\n  attack: ${formValues.value.get('attack')}`;
      exportable = `${exportable}\n  attack_increment: ${formValues.value.get('agi')}`;
      exportable = `${exportable}\n  defense: ${formValues.value.get('defense')}`;
      exportable = `${exportable}\n  defense_increment: ${formValues.value.get('dgi')}`;
      exportable = `${exportable}\n  politics: ${formValues.value.get('politics')}`;
      exportable = `${exportable}\n  politics_increment: ${formValues.value.get('pgi')}`;
      exportable = `${exportable}\n  stars: '10'`
      exportable = `${exportable}\n  level: '1'`
      exportable = `${exportable}\n  score_as: ${formValues.value.get('score_as')}`

      if(
        (this.buffEventPending['s1name']) ||
        (this.buffEventPending['s2name']) ||
        (this.buffEventPending['s3name']) ||
        (this.buffEventPending['s4name'])
        ) {
          exportable = `${exportable}\n  specialities:`
      
          if(this.buffEventPending['s1name']) {
            console.log(`detected something to get`)
            exportable = `${exportable}\n    - name: ${formValues.value.get('s1name')}`;
            exportable = `${exportable}\n      attribute:`;

            let s1 = this.buffs.render(b.qualityColor.enum.Green, `1.`, 'right');
            console.log(`s1 is ${s1}`)
            exportable = `${exportable}\n${s1.values}`
            let s2 = this.buffs.render(b.qualityColor.enum.Blue,'1.','right')
            exportable = `${exportable}\n${s2.values}`
          }  
          
          if(this.buffEventPending['s2name']) {
            console.log(`detected something to get`)
            exportable = `${exportable}\n    - name: ${formValues.value.get('s2name')}`;
            exportable = `${exportable}\n      attribute:`;
            let s1 = this.buffs.render(b.qualityColor.enum.Green, '2.', 'right');
            exportable = `${exportable}\n${s1.values}`
            let s2 = this.buffs.render(b.qualityColor.enum.Blue,'2.','right')
            exportable = `${exportable}\n${s2.values}`
          }  

          if(this.buffEventPending['s3name']) {
            console.log(`detected something to get`)
            exportable = `${exportable}\n    - name: ${formValues.value.get('s1name')}`;
            exportable = `${exportable}\n      attribute:`;
            let s1 = this.buffs.render(b.qualityColor.enum.Green, '3.', 'right');
            exportable = `${exportable}\n${s1.values}`
            let s2 = this.buffs.render(b.qualityColor.enum.Blue,'3.','right')
            exportable = `${exportable}\n${s2.values}`
          }  

          if(this.buffEventPending['s4name']) {
            console.log(`detected something to get`)
            exportable = `${exportable}\n    - name: ${formValues.value.get('s1name')}`;
            exportable = `${exportable}\n      attribute:`;
            let s1 = this.buffs.render(b.qualityColor.enum.Green, '4.', 'right');
            console.log(`s1 is ${s1}`)
            exportable = `${exportable}\n${s1.values}`
            let s2 = this.buffs.render(b.qualityColor.enum.Blue,'4.','right')
            exportable = `${exportable}\n${s2.values}`
            
          }  
      
        }
      
      
    } else {
      console.log(`formValue is ${formValues.get()}`)
    }
    const lines = exportable.split('\n').length;
    return html`
    <div id="CardDiv" style="width: 100%;">
      <sp-textfield id="result" multiline rows=${lines} readonly value=${exportable}></sp-text-field>
    </div>
    `
  }

  render() {
    console.log(`index render`)
    return html`
    <sp-split-view>
      <div>
      ${this.renderLeft()}
      </div>
      <div>
      ${this.renderRight()}
      </div>
    </sp-split-view>  
    
    `

  }

}
if(!customElements.get('general-yaml')) {
  customElements.define('general-yaml', GeneralYaml)
}