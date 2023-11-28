import {html, css, nothing, type CSSResultArray, type PropertyValues, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import {boolean, z} from 'zod';

import { action, onMount, task} from "nanostores";
import { persistentAtom } from '@nanostores/persistent'
import { logger } from '@nanostores/logger'
import {withStores} from "@nanostores/lit";

import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/overlay/overlay-trigger.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/popover/sp-popover.js';
import '@spectrum-web-components/radio/sp-radio.js';
import '@spectrum-web-components/radio/sp-radio-group.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import {SpectrumElement} from "@spectrum-web-components/base";
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuDivider
} from '@spectrum-web-components/menu';

const DEBUG = true;

import * as b from '@schemas/baseSchemas.ts'

import {
  GeneralArray,
    type GeneralElement,
    GeneralElementSchema,
} from "@schemas/generalsSchema";

import { allGenerals } from "./generals";

export interface GeneralToggle {
  [key: string]: boolean;
}

export const selectedPrimaries = persistentAtom<GeneralToggle[]>('evonyTKRTipsPrimaries', [], {
  listen: false,
  encode: JSON.stringify,
  decode: JSON.parse,
})

export const selectedSecondaries = persistentAtom<Record<string,boolean>[]>('secondaries', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
})

let destroy = logger({
  'selectedPrimaries': selectedPrimaries,
  'selectedSecondaries': selectedSecondaries,
})

export const togglePrimary = action(selectedPrimaries, 'toggle', (store, general: string, enabled: boolean) => {
  const data = store.get();
  const keys = new Set(data.map((so) => Object.keys(so)[0]));
  
  if(DEBUG) {console.log(`set of ${keys.size}`)}
  const trueVersion = {[general]: true};
  const falseVersion = {[general]: false};
  if(DEBUG) {console.log(`true is ${JSON.stringify(trueVersion)} and false is ${JSON.stringify(falseVersion)}`)}
  const index = data.findIndex((element) => {
    const k = Object.keys(element)[0];
    return (!(k as string).localeCompare(general))
  })
  data[index] = {[general]: enabled}
  store.set(data);
})

const primaryEnabled = (mykey: string) => {
  const values = new Map<string, number|string|boolean>();
  const storedValues = selectedPrimaries.get();
  if(storedValues !== null && storedValues !== undefined) {
    storedValues.forEach((val) => {
      const k = Object.keys(val)[0];
      values.set(k,val[k]);
    })
    return values.get(mykey);
  }
  return false;
}

@customElement('general-filter')
export class GeneralFilter extends withStores(SpectrumElement, [allGenerals, selectedPrimaries, selectedSecondaries]) { 

  constructor() {
    super();
    selectedPrimaries.subscribe(sp => {
      this.requestUpdate();
    });
    selectedSecondaries.subscribe(ss => {
      this.requestUpdate();
    })

    allGenerals.subscribe(ag => {
      if(DEBUG) {console.log(`ag subscribe in general-filter`) }
      if(ag !== null && ag !== undefined) {
        const valid = GeneralArray.safeParse(ag);
        if(valid.success) {
          const spv = selectedPrimaries.get();
          const ssv = selectedSecondaries.get();
          const spKeys = new Set(spv.map((spe) => {
            if(spe !== null && spe !== undefined) {
              const k = Object.keys(spe)[0];
              return k;
            }
          }))
          const ssKeys = new Set(ssv.map((sse) => {
            if(sse !== null && sse !== undefined) {
              const k = Object.keys(sse)[0];
              return k;
            }
          }))
          for (let i in valid.data) {
            const one = valid.data[i];
            const name = one.general.name;
            if(!spKeys.has(name)) {
              const toAdd = {[name]: true};
              spv.push(toAdd);
              selectedPrimaries.set(spv);
            }
            if(!ssKeys.has(name)) {
              const toAdd = {[name]: true};
              ssv.push(toAdd);
              selectedSecondaries.set(ssv);
            }
          }
        }
      }
    })

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

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.willUpdate(_changedProperties);
  }

  public static override get styles(): CSSResultArray {
    const localstyle = css`
    
      .outside {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 0.5rem;
        border-top: 1px solid var(--spectrum-cyan-600);
        border-right: 1px solid var(--spectrum-cyan-600);
        border-left: 0px;
        border-bottom: 0px;
        height: 100%;
      }

    `
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];
  }

  public togglePrimarySelection(e: CustomEvent) {

    const values = new Set((e.target as Menu).value.split(','));
    const existing = new Set(selectedPrimaries.get());
    const eKeys = new Set();
    existing.forEach((ev) => {
      if(ev !== null && ev !== undefined) {
        const k = Object.keys(ev)[0];
        if(DEBUG){console.log(`found existing key ${k}`)};
        const trueVersion = {[k]: true};
        const falseVersion = {[k]: false};
        if(values.has(k)){
          togglePrimary(k,true);
        } else {
          togglePrimary(k,false);
        }
      }
    })
  }

  render() {
    let spt = html``;
    const primaries = selectedPrimaries.get();
    if(DEBUG) {console.log(`render SP has ${primaries.length} entries`)}
    const secondaries = selectedSecondaries.get();
    if(primaries !== null && primaries !== undefined) {
      for(let i = 0; i < primaries.length; i++) {
        if(primaries[i] !== null && primaries[i] !== undefined) {
          const v = primaries[i];
          const k = Object.keys(v)[0];
          const e = v[k]; 
          if (DEBUG) {console.log(`${k} set to ${e}`) }
          if(k !== null && k !== undefined) {
            spt = html`${spt}
              <sp-menu-item value=${k} selected=${(e === true)? true : nothing}>${k}</sp-menu-item>
            `
          }
        }
        
      }
      spt = html`
      <sp-popover slot="click-content" open style="position: relative">
        <sp-menu label="Primary Generals" selects="multiple" @change=${this.togglePrimarySelection}>
          ${spt}
        </sp-menu>
      </sp-popover>
      `

      return html`
      <div class="outside">
        <overlay-trigger id="trigger" placement="bottom" offset="6">
          <sp-action-button slot="trigger" toggles type='button' >Primary Generals</sp-action-button>
          ${spt}
        </overlay-trigger>
      </div>
      `
    }
  }

}
  