import { css, html, type CSSResultArray, type PropertyValueMap, type TemplateResult } from "lit";
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';

import { withStores } from "@nanostores/lit";



const DEBUG = false;


import { SpectrumElement } from '@spectrum-web-components/base';

import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/number-field/sp-number-field.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/split-view/sp-split-view.js';
import '@spectrum-web-components/status-light/sp-status-light.js';
import '@spectrum-web-components/table/elements.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import { parse, isDocument } from 'yaml'

import { GeneralBuffController } from "./Buff.ts";

import { addValue, formValues } from '../formValueStore.ts';

import * as b from "@schemas/baseSchemas.ts";

import { GeneralElementSchema } from '@schemas/generalsSchema.ts';
import type { ZodError } from "zod";

export class GeneralYaml extends withStores(SpectrumElement, [formValues]) {

  private findMe: Ref<HTMLElement> = createRef();

  private resultDiv: Ref<HTMLElement> = createRef();

  private validationError: ZodError | null = null;

  @state()
  private resultClassList = { 'not-content': true, valid: false, invalid: false }

  @state()
  private specialities: boolean = false;

  @state()
  private buffEventPending: Record<string, boolean> = {};

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
      div.specialities, div.books, div.ascending {
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
      #ResultsDiv {
        display: block;
        white-space: pre;
        min-height: 60vh;
        height: fit-content;
        width: 75%;
        padding-left: 3rem;
      }
      .valid {
        border: 1.5px solid var(--spectrum-celery-500);
      }

      .invalid {
        border: 1.5px solid var(--spectrum-red-800);
      }

      `
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];

  }

  public connectedCallback() {
    super.connectedCallback()
  }

  public willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(_changedProperties);
    console.log(`index willUpdate`)

    if (_changedProperties.has('buffEventPending')) {
      console.log(`buffUpdatePending detected`)
    }
  }

  public finalValidator(toValidate: string) {
    console.log(`index finalValidator start;`)
    if (this.resultDiv !== null && this.resultDiv !== undefined) {
      if (this.resultDiv.value !== null && this.resultDiv.value !== undefined) {
        
          const JsonValue = parse(toValidate, { prettyErrors: true });
          const valid = GeneralElementSchema.safeParse(JsonValue);
          if (valid.success) {
            this.resultClassList.valid = true;
            this.resultClassList.invalid = false;
            this.validationError = null;
          } else {
            this.resultClassList.valid = false;
            this.resultClassList.invalid = true;
            this.validationError = valid.error;
          }
          this.requestUpdate();
        
      }
    } 
  }

  protected formHandler(e: CustomEvent) {
    console.log(`index; formhandler`)
    const target = e.target;
    if (target !== null && target !== undefined) {
      if (!(target as Element).id.localeCompare('al1numattrs')) {
        if (target.value > 0) {
          this.buffEventPending['al1name'] = true;
        } else {
          this.buffEventPending['al1name'] = false;
        }
        addValue('al1name', 'isSet');
      }
      if (!(target as Element).id.localeCompare('al2numattrs')) {
        if (target.value > 0) {
          this.buffEventPending['al2name'] = true;
        } else {
          this.buffEventPending['al2name'] = false;
        }
        addValue('al2name', 'isSet');
      }
      if (!(target as Element).id.localeCompare('al3numattrs')) {
        if (target.value > 0) {
          this.buffEventPending['al3name'] = true;
        } else {
          this.buffEventPending['al3name'] = false;
        }
        addValue('al3name', 'isSet');
      }
      if (!(target as Element).id.localeCompare('al4numattrs')) {
        if (target.value > 0) {
          this.buffEventPending['al4name'] = true;
        } else {
          this.buffEventPending['al4name'] = false;
        }
        addValue('al4name', 'isSet');
      }
      if (!(target as Element).id.localeCompare('al5numattrs')) {
        if (target.value > 0) {
          this.buffEventPending['al5name'] = true;
        } else {
          this.buffEventPending['al5name'] = false;
        }
        addValue('al5name', 'isSet');
      }
      console.log(`${(target as Element).id} has ${target.value}`)
      addValue((target as Element).id, target.value);
      this.requestUpdate()
    }
  }

  public sformHandler(e: CustomEvent) {
    console.log(`index; sformhandler`)
    const target = e.target;
    if (target !== null && target !== undefined) {
      console.log(`sformHander; ${(target as Element).id} has ${target.value}`)
      if ((target as Element).id.includes('_valueU')) {
        if (target.checked === false) {
          addValue((target as Element).id, 'flat');
        } else {
          addValue((target as Element).id, 'percentage');
        }
        if (target.checked !== undefined && target.checked !== null) {
          this.buffEventPending[(target as Element).id] = true;
        } else {
          this.buffEventPending[(target as Element).id] = false;
        }
      } else {
        addValue((target as Element).id, target.value);
        if ((target.value !== '') && (target.value !== false)) {
          this.buffEventPending[(target as Element).id] = true;
        } else {
          this.buffEventPending[(target as Element).id] = false;
        }
      }
      this.requestUpdate()
    }
  }

  renderLeft() {
    const b1T = new Array<TemplateResult>();
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
    const s3gT = new Array<TemplateResult>();
    const s3bT = new Array<TemplateResult>();
    const s3pT = new Array<TemplateResult>();
    const s3oT = new Array<TemplateResult>();
    const s3GT = new Array<TemplateResult>();
    const s4gT = new Array<TemplateResult>();
    const s4bT = new Array<TemplateResult>();
    const s4pT = new Array<TemplateResult>();
    const s4oT = new Array<TemplateResult>();
    const s4GT = new Array<TemplateResult>();
    const al1T = new Array<TemplateResult>();
    const al2T = new Array<TemplateResult>();
    const al3T = new Array<TemplateResult>();
    const al4T = new Array<TemplateResult>();
    const al5T = new Array<TemplateResult>();
    for (let i = 0; i < (formValues.value?.get('b1numattrs') as number); i++) {
      b1T.push(this.buffs.render('special', `b1.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('s1numattrs') as number); i++) {
      s1gT.push(this.buffs.render(b.qualityColor.enum.Green, `1.${i}`, 'left'))
      s1bT.push(this.buffs.render(b.qualityColor.enum.Blue, `1.${i}`, 'left'))
      s1pT.push(this.buffs.render(b.qualityColor.enum.Purple, `1.${i}`, 'left'))
      s1oT.push(this.buffs.render(b.qualityColor.enum.Orange, `1.${i}`, 'left'))
      s1GT.push(this.buffs.render(b.qualityColor.enum.Gold, `1.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('s2numattrs') as number); i++) {
      s2gT.push(this.buffs.render(b.qualityColor.enum.Green, `2.${i}`, 'left'))
      s2bT.push(this.buffs.render(b.qualityColor.enum.Blue, `2.${i}`, 'left'))
      s2pT.push(this.buffs.render(b.qualityColor.enum.Purple, `2.${i}`, 'left'))
      s2oT.push(this.buffs.render(b.qualityColor.enum.Orange, `2.${i}`, 'left'))
      s2GT.push(this.buffs.render(b.qualityColor.enum.Gold, `2.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('s3numattrs') as number); i++) {
      s3gT.push(this.buffs.render(b.qualityColor.enum.Green, `3.${i}`, 'left'))
      s3bT.push(this.buffs.render(b.qualityColor.enum.Blue, `3.${i}`, 'left'))
      s3pT.push(this.buffs.render(b.qualityColor.enum.Purple, `3.${i}`, 'left'))
      s3oT.push(this.buffs.render(b.qualityColor.enum.Orange, `3.${i}`, 'left'))
      s3GT.push(this.buffs.render(b.qualityColor.enum.Gold, `3.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('s4numattrs') as number); i++) {
      s4gT.push(this.buffs.render(b.qualityColor.enum.Green, `4.${i}`, 'left'))
      s4bT.push(this.buffs.render(b.qualityColor.enum.Blue, `4.${i}`, 'left'))
      s4pT.push(this.buffs.render(b.qualityColor.enum.Purple, `4.${i}`, 'left'))
      s4oT.push(this.buffs.render(b.qualityColor.enum.Orange, `4.${i}`, 'left'))
      s4GT.push(this.buffs.render(b.qualityColor.enum.Gold, `4.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('al1numattrs') as number); i++) {
      al1T.push(this.buffs.render((6).toString(), `.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('al2numattrs') as number); i++) {
      al2T.push(this.buffs.render((7).toString(), `.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('al3numattrs') as number); i++) {
      al3T.push(this.buffs.render((8).toString(), `.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('al4numattrs') as number); i++) {
      al4T.push(this.buffs.render((9).toString(), `.${i}`, 'left'))
    }
    for (let i = 0; i < (formValues.value?.get('al5numattrs') as number); i++) {
      al5T.push(this.buffs.render((10).toString(), `.${i}`, 'left'))
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
      <div class="not-content books">
        <div class="not-content BuiltIn">
          <sp-field-label for"b1name" required>Built In Book Name</sp-field-label>
          <sp-textfield id="b1name" placeholder="Enter BuiltIn Book Name" @change=${this.sformHandler}></sp-textfield>
          <br/>
          <sp-field-label for="b1numattrs" required>Number of Attributes in this Book</sp-field-label>
            <sp-number-field
                id='b1numattrs'
                value="0"
                size="m"
                style="--spectrum-stepper-width: 110px"
                @change=${this.formHandler}
                ></sp-number-field>
            <div class="not-content green">
                ${b1T}
            </div>
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
          <br/>
          <div class="not-content speciality two">
            <sp-field-label for="s2name" required>Speciality Name</sp-field-label>
            <sp-textfield id="s2name" placeholder="Enter Speciality Name" @change=${this.sformHandler}></sp-textfield>
            <br/>
            <sp-field-label for="s2numattrs" required>Number of Attributes per Level</sp-field-label>
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
          <br/>
          <div class="not-content speciality three">
            <sp-field-label for="s3name" required>Speciality Name</sp-field-label>
            <sp-textfield id="s3name" placeholder="Enter Speciality Name" @change=${this.sformHandler}></sp-textfield>
            <br/>
            <sp-field-label for="s3numattrs" required>Number of Attributes per Level</sp-field-label>
            <sp-number-field
                id='s3numattrs'
                value="0"
                size="m"
                style="--spectrum-stepper-width: 110px"
                @change=${this.formHandler}
                ></sp-number-field>
            <div class="not-content green">
                <span class="not-content h5">Green</span>
                ${s3gT}
            </div>
            <div class="not-content blue">
              <span class="not-content h5">Blue</span>
              ${s3bT}
            </div>
            <div class="not-content purple">
              <span class="not-content h5">Purple</span>
              ${s3pT}
            </div>
            <div class="not-content orange">
              <span class="not-content h5">Orange</span>
              ${s3oT}
            </div>
            <div class="not-content gold">
              <span class="not-content h5">Gold</span>
              ${s3GT}
            </div>
          </div>
          <br/>
          <div class="not-content speciality four">
            <sp-field-label for="s4name" required>Speciality Name</sp-field-label>
            <sp-textfield id="s4name" placeholder="Enter Speciality Name" @change=${this.sformHandler}></sp-textfield>
            <br/>
            <sp-field-label for="s4numattrs" required>Number of Attributes per Level</sp-field-label>
            <sp-number-field
                id='s4numattrs'
                value="0"
                size="m"
                style="--spectrum-stepper-width: 110px"
                @change=${this.formHandler}
                ></sp-number-field>
            <div class="not-content green">
                <span class="not-content h5">Green</span>
                ${s4gT}
            </div>
            <div class="not-content blue">
              <span class="not-content h5">Blue</span>
              ${s4bT}
            </div>
            <div class="not-content purple">
              <span class="not-content h5">Purple</span>
              ${s4pT}
            </div>
            <div class="not-content orange">
              <span class="not-content h5">Orange</span>
              ${s4oT}
            </div>
            <div class="not-content gold">
              <span class="not-content h5">Gold</span>
              ${s4GT}
            </div>
          </div>
        </sp-field-group>
      </div>
      <hr>
      <div class="not-content ascending">
        <div class="not-content al1">
          <span class="not-content h5">Ascending Level 1</span>
          <sp-field-label for="al1numattrs" required>Number of Attributes per Level</sp-field-label>
          <sp-number-field
              id='al1numattrs'
              value="0"
              size="m"
              style="--spectrum-stepper-width: 110px"
              @change=${this.formHandler}
              ></sp-number-field>
          <div class="not-content al1attr">
              ${al1T}
          </div>
        </div>
        <div class="not-content al2">
          <span class="not-content h5">Ascending Level 2</span>
          <sp-field-label for="al2numattrs" required>Number of Attributes per Level</sp-field-label>
          <sp-number-field
              id='al2numattrs'
              value="0"
              size="m"
              style="--spectrum-stepper-width: 110px"
              @change=${this.formHandler}
              ></sp-number-field>
          <div class="not-content al2attr">
              ${al2T}
          </div>
        </div>
        <div class="not-content al3">
          <span class="not-content h5">Ascending Level 3</span>
          <sp-field-label for="al3numattrs" required>Number of Attributes per Level</sp-field-label>
          <sp-number-field
              id='al3numattrs'
              value="0"
              size="m"
              style="--spectrum-stepper-width: 110px"
              @change=${this.formHandler}
              ></sp-number-field>
          <div class="not-content al3attr">
              ${al3T}
          </div>
        </div>
        <div class="not-content al4">
          <span class="not-content h5">Ascending Level 4</span>
          <sp-field-label for="al4numattrs" required>Number of Attributes per Level</sp-field-label>
          <sp-number-field
              id='al4numattrs'
              value="0"
              size="m"
              style="--spectrum-stepper-width: 110px"
              @change=${this.formHandler}
              ></sp-number-field>
          <div class="not-content al4attr">
              ${al4T}
          </div>
        </div>
        <div class="not-content al5">
          <span class="not-content h5">Ascending Level 5</span>
          <sp-field-label for="al5numattrs" required>Number of Attributes per Level</sp-field-label>
          <sp-number-field
              id='al5numattrs'
              value="0"
              size="m"
              style="--spectrum-stepper-width: 110px"
              @change=${this.formHandler}
              ></sp-number-field>
          <div class="not-content al5attr">
              ${al5T}
          </div>
        </div>
      </div>
    </div>
    `
  }

  renderRight() {

    console.log(`renderRight`)
    let exportable = '---';
    if (formValues.value !== null && formValues.value !== undefined) {
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

      if (this.buffEventPending['b1name']) {
        console.log(`b1name is set`)
        exportable = `${exportable}\n  books:`;
        exportable = `${exportable}\n    - name: ${formValues.value.get('b1name')}`;
        let s1 = this.buffs.render('special', 'b1.', 'right', 'b1numattrs');
        const toAdd = s1.values;
        if (toAdd.length >= 1) {
          console.log(`books s1 is '${toAdd}'`)
          exportable = `${exportable}\n${toAdd}`
        }
      }
      if (
        (this.buffEventPending['s1name']) ||
        (this.buffEventPending['s2name']) ||
        (this.buffEventPending['s3name']) ||
        (this.buffEventPending['s4name'])
      ) {
        exportable = `${exportable}\n  specialities:`

        if (this.buffEventPending['s1name']) {
          console.log(`detected something to get`)
          exportable = `${exportable}\n    - name: ${formValues.value.get('s1name')}`;
          exportable = `${exportable}\n      attribute:`;

          let s1 = this.buffs.render(b.qualityColor.enum.Green, `1.`, 'right', 's1numattrs');
          console.log(`s1 is ${s1}`)
          exportable = `${exportable}\n${s1.values}`
          let s2 = this.buffs.render(b.qualityColor.enum.Blue, '1.', 'right', 's1numattrs')
          exportable = `${exportable}\n${s2.values}`
          let s3 = this.buffs.render(b.qualityColor.enum.Purple, '1.', 'right', 's1numattrs')
          exportable = `${exportable}\n${s3.values}`
          let s4 = this.buffs.render(b.qualityColor.enum.Orange, '1.', 'right', 's1numattrs')
          exportable = `${exportable}\n${s4.values}`
          let s5 = this.buffs.render(b.qualityColor.enum.Gold, '1.', 'right', 's1numattrs')
          exportable = `${exportable}\n${s5.values}`
        }

        if (this.buffEventPending['s2name']) {
          console.log(`detected something to get`)
          exportable = `${exportable}\n    - name: ${formValues.value.get('s2name')}`;
          exportable = `${exportable}\n      attribute:`;
          let s1 = this.buffs.render(b.qualityColor.enum.Green, '2.', 'right', 's2numattrs');
          exportable = `${exportable}\n${s1.values}`
          let s2 = this.buffs.render(b.qualityColor.enum.Blue, '2.', 'right', 's2numattrs')
          exportable = `${exportable}\n${s2.values}`
          let s3 = this.buffs.render(b.qualityColor.enum.Purple, '2.', 'right', 's2numattrs')
          exportable = `${exportable}\n${s3.values}`
          let s4 = this.buffs.render(b.qualityColor.enum.Orange, '2.', 'right', 's2numattrs')
          exportable = `${exportable}\n${s4.values}`
          let s5 = this.buffs.render(b.qualityColor.enum.Gold, '2.', 'right', 's2numattrs')
          exportable = `${exportable}\n${s5.values}`
        }

        if (this.buffEventPending['s3name']) {
          console.log(`detected something to get`)
          exportable = `${exportable}\n    - name: ${formValues.value.get('s1name')}`;
          exportable = `${exportable}\n      attribute:`;
          let s1 = this.buffs.render(b.qualityColor.enum.Green, '3.', 'right', 's3numattrs');
          exportable = `${exportable}\n${s1.values}`
          let s2 = this.buffs.render(b.qualityColor.enum.Blue, '3.', 'right', 's3numattrs')
          exportable = `${exportable}\n${s2.values}`
          let s3 = this.buffs.render(b.qualityColor.enum.Purple, '3.', 'right', 's3numattrs')
          exportable = `${exportable}\n${s3.values}`
          let s4 = this.buffs.render(b.qualityColor.enum.Orange, '3.', 'right', 's3numattrs')
          exportable = `${exportable}\n${s4.values}`
          let s5 = this.buffs.render(b.qualityColor.enum.Gold, '3.', 'right', 's3numattrs')
          exportable = `${exportable}\n${s5.values}`
        }

        if (this.buffEventPending['s4name']) {
          console.log(`detected something to get`)
          exportable = `${exportable}\n    - name: ${formValues.value.get('s1name')}`;
          exportable = `${exportable}\n      attribute:`;
          let s1 = this.buffs.render(b.qualityColor.enum.Green, '4.', 'right', 's4numattrs');
          console.log(`s1 is ${s1}`)
          exportable = `${exportable}\n${s1.values}`
          let s2 = this.buffs.render(b.qualityColor.enum.Blue, '4.', 'right', 's4numattrs')
          exportable = `${exportable}\n${s2.values}`
          let s3 = this.buffs.render(b.qualityColor.enum.Purple, '4.', 'right', 's4numattrs')
          exportable = `${exportable}\n${s3.values}`
          let s4 = this.buffs.render(b.qualityColor.enum.Orange, '4.', 'right', 's4numattrs')
          exportable = `${exportable}\n${s4.values}`
          let s5 = this.buffs.render(b.qualityColor.enum.Gold, '4.', 'right', 's4numattrs')
          exportable = `${exportable}\n${s5.values}`
        }

      }
      if (
        (this.buffEventPending['al1name']) ||
        (this.buffEventPending['al2name']) ||
        (this.buffEventPending['al3name']) ||
        (this.buffEventPending['al4name']) ||
        (this.buffEventPending['al5name'])
      ) {
        exportable = `${exportable}\n  ascending:`

        if (this.buffEventPending['al1name']) {
          console.log(`detected something to get`)
          let s1 = this.buffs.render((6).toString(), '.', 'right', 'al1numattrs');
          console.log(`s1 is ${s1}`)
          exportable = `${exportable}\n${s1.values}`
        }

        if (this.buffEventPending['al2name']) {
          console.log(`detected something to get`)
          let s1 = this.buffs.render((7).toString(), '.', 'right', 'al2numattrs');
          console.log(`s1 is ${s1}`)
          exportable = `${exportable}\n${s1.values}`
        }

        if (this.buffEventPending['al3name']) {
          console.log(`detected something to get`)
          let s1 = this.buffs.render((8).toString(), '.', 'right', 'al3numattrs');
          console.log(`s1 is ${s1}`)
          exportable = `${exportable}\n${s1.values}`
        }

        if (this.buffEventPending['al4name']) {
          console.log(`detected something to get`)
          let s1 = this.buffs.render((9).toString(), '.', 'right', 'al4numattrs');
          console.log(`s1 is ${s1}`)
          exportable = `${exportable}\n${s1.values}`
        }

        if (this.buffEventPending['al5name']) {
          console.log(`detected something to get`)
          let s1 = this.buffs.render((10).toString(), '.', 'right', 'al5numattrs');
          console.log(`s1 is ${s1}`)
          exportable = `${exportable}\n${s1.values}`
        }

      } else {
        console.log(`ascending Pending check: ${this.buffEventPending['al1name']}`)
      }


    } else {
      console.log(`formValue is ${formValues.get()}`)
    }
    const lines = exportable.split('\n').length;
    this.finalValidator(exportable);
    return html`
    <div class=${classMap(this.resultClassList)} id="ResultsDiv"  ${ref(this.resultDiv)}>${exportable}</div>
    ${this.validationError}
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
if (!customElements.get('general-yaml')) {
  customElements.define('general-yaml', GeneralYaml)
}