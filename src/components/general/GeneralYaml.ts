import {  html, css, type PropertyValues, type CSSResultArray} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

const DEBUG = false;


import { SpectrumElement } from '@spectrum-web-components/base';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/table/elements.js';
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

@customElement('general-yaml')
export class GeneralYaml extends SpectrumElement {

  @state()
  private formValues: Map<string,string|number> = new Map();

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

  protected formHandler(e: CustomEvent) {
    console.log(`formhandler`)
    const target = e.target;
    if(target !== null && target !== undefined) {
      console.log(`${target.id} has ${target.value}`)
      this.formValues.set(target.id, target.value)
      this.requestUpdate();
    }
  }

  renderLeft() {
    return html`
    <div class="GeneralsDetailsForm">
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
    </div>
    `
  }

  renderRight(){
    let exportable='---';
    exportable = `${exportable}\ngeneral:`;
    exportable = `${exportable}\n  name: ${this.formValues.get('name')}`;
    exportable = `${exportable}\n  display: summary`;
    exportable = `${exportable}\n  leadership: ${this.formValues.get('leadership')}`;
    exportable = `${exportable}\n  leadership_increment: ${this.formValues.get('lgi')}`;
    exportable = `${exportable}\n  attack: ${this.formValues.get('attack')}`;
    exportable = `${exportable}\n  attack_increment: ${this.formValues.get('agi')}`;
    exportable = `${exportable}\n  defense: ${this.formValues.get('defense')}`;
    exportable = `${exportable}\n  defense_increment: ${this.formValues.get('dgi')}`;
    exportable = `${exportable}\n  politics: ${this.formValues.get('politics')}`;
    exportable = `${exportable}\n  politics_increment: ${this.formValues.get('pgi')}`;
    exportable = `${exportable}\n  stars: '10'`
    exportable = `${exportable}\n  level: '1'`
    exportable = `${exportable}\n  score_as: ${this.formValues.get('score_as')}`


    const lines = exportable.split('\n').length;
    return html`
    <div id="CardDiv" style="width: 100%;">
      <sp-textfield id="result" multiline rows=${lines} readonly value=${exportable}></sp-text-field>
    </div>
    `
  }

  render() {
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
