import { html, nothing} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ContextConsumer, consume } from "@lit/context";
import { Task, initialState } from "@lit/task";

import {
  type CSSResultArray,
  css,
  SpectrumElement,
  SizedMixin,
} from "@spectrum-web-components/base";
import '@spectrum-web-components/combobox/sp-combobox.js';
import { type ComboboxOption} from '@spectrum-web-components/combobox';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sp-picker.js';


import {
  generalUseCase,
  type generalUseCaseType,
}from '@schemas/index'


import { type GeneralStore, GeneralStoreContext } from "./GeneralContext";

const DEBUG = true;



@customElement("display-controls")
export class DisplayControls extends SizedMixin(SpectrumElement, {
  validSizes: ["s", "m", "l", "xl"],
  defaultSize: "m",
  noDefaultSize: false,
}) {

  @property({type: String})
  public defaultUseCase: String = 'all';

  @property({type: Boolean})
  public disableUseCase: boolean = false;

  @state()
  private generalStore = new ContextConsumer(this, {
    context: GeneralStoreContext,
    subscribe: true,
  });

  @state()
  private useCaseOptions: ComboboxOption[] = new Array<ComboboxOption>();

  public constructor() {
    super();

    for(const option of generalUseCase.options) {
      this.useCaseOptions.push({
        value: option,
        itemText: option.replaceAll('_',' ')
      })
    }

  }

  public static override get styles(): CSSResultArray {
    const localstyle = css`
      
      :host {
        display: grid;
        z-index: 0;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(15, 1fr);
        grid-auto-flow: row;
        grid-column-gap: var(--spectrum-global-dimension-size-25);
        grid-row-gap: var(--spectrum-global-dimension-size-25);
        justify-items: start;
        justify-content: space-between;
        align-items: start;
        align-content: start;
        background-color: blue;
        grid-row-start: 0;
        grid-row-end: span 15;
      }

      .picker  {
        background-color: green;
        grid-row-start: 0;
        grid-row-end: span 5;
        grid-column-start: 0;
        grid-column-end: span 2;
        overflow: hidden;
        border: 1px solid;

        & #useCase {
          grid-row-end: span 2;
        }
      }
    `;
    return [localstyle];
  }
  
  public render() {

    return html`
    <div class='grid'>
      <div class='picker'>
        <div id='useCase'>
          <sp-field-label for='useCase'>Use Case</sp-field-label>
          <sp-picker id='useCase' 
            disabled="${this.disableUseCase || nothing}"
            value=${this.defaultUseCase}>
            ${this.useCaseOptions.map((useCase) => html`
              <sp-menu-item value=${useCase.value} >
                ${useCase.itemText}
              </sp-menu-item>
            `)}
          </sp-picker>
        </div>
      
      hi
      </div>
    </div>
      
    `

  }
  
}
