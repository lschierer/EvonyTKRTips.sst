import {html, css, nothing, type CSSResultArray, type PropertyValues, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref} from 'lit/directives/ref.js';

import {boolean, z} from 'zod';

import { action, onMount, task} from "nanostores";
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
import '@spectrum-web-components/picker-button/sp-picker-button.js';
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
import { Button, ClearButton, CloseButton } from '@spectrum-web-components/button';

const DEBUG = false;

import * as b from '@schemas/baseSchemas.ts'

import {
  GeneralArray,
    type GeneralElement,
    GeneralElementSchema,
} from "@schemas/generalsSchema";

import { type GeneralToggle, allGenerals, filteredPrimaries, selectedPrimaries, selectedSecondaries, togglePrimary, toggleSecondary, resetPrimary, resetSecondary } from "./generals";


@customElement('general-filter')
export class GeneralFilter extends withStores(SpectrumElement, [allGenerals, filteredPrimaries, selectedPrimaries, selectedSecondaries]) { 

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
      /*if(ag !== null && ag !== undefined) {
        const valid = GeneralArray.safeParse(ag);
        const spv = selectedPrimaries.get();
        if(valid.success && (spv !== null && spv !== undefined)) {
          const ssv = selectedSecondaries.get();
          const ssKeys = new Set(ssv.map((sse) => {
            if(sse !== null && sse !== undefined) {
              const k = Object.keys(sse)[0];
              return k;
            }
          }))
          for (let i in valid.data) {
            const one = valid.data[i];
            const name = one.general.name;
            if(!spv.has(one)){
              spv.set(one,true);
              selectedPrimaries.set(spv);
              this.requestUpdate();
            }
            if(!ssKeys.has(name)) {
              const toAdd = {[name]: true};
              ssv.push(toAdd);
              selectedSecondaries.set(ssv);
            }
          }
        }
      }*/
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
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        border-top: 1px solid var(--spectrum-cyan-600);
        border-right: 1px solid var(--spectrum-cyan-600);
        border-left: 0px;
        border-bottom: 0px;
        height: 100%;

        & .primary {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-evenly;
        }

        & .secondary {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-evenly;
        }

      }
      
    `
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];
  }

  public togglePrimarySelection(e: CustomEvent) {

    const values = (e.target as Menu).value.split(',');
    if(values.includes("all")){
      console.log(`I should reset`)
      return;
    }
    const existing = selectedPrimaries.get();
    const eKeys = new Set();
    values.forEach((v) => {
      const g = allGenerals.get()?.filter((value) => {
        return (!value.general.name.localeCompare(v))
      }).pop();
      if(g !== undefined) {
        if(existing.has(g)){
          if(existing.get(g) !== true) {
            togglePrimary(g,true);
            this.requestUpdate();
          }
        } else {
          togglePrimary(g,true);
          this.requestUpdate();
        }
      } else {
        console.error(`I cannot find a general with ${v}`)
      }
    })
    allGenerals.get()?.forEach((gen) => {
      if(gen !== null && gen !== undefined) {
        if(!values.includes(gen.general.name)){
          togglePrimary(gen,false);
          this.requestUpdate();
        }
      }
    })
  }

  public toggleSecondarySelection(e: CustomEvent) {

    const values = new Set((e.target as Menu).value.split(','));
    const existing = new Set(selectedSecondaries.get());
    const eKeys = new Set();
    existing.forEach((ev) => {
      if(ev !== null && ev !== undefined) {
        const k = Object.keys(ev)[0];
        if(DEBUG){console.log(`found existing key ${k}`)};
        const trueVersion = {[k]: true};
        const falseVersion = {[k]: false};
        if(values.has(k)){
          toggleSecondary(k,true);
        } else {
          toggleSecondary(k,false);
        }
      }
    })
  }

  primaryCickListener(e?: Element) {
    if(e !== null && e !== undefined) {
      (e as Button).addEventListener('click', () => {resetPrimary()});
    }
  }

  secondaryCickListener(e?: Element) {
    if(e !== null && e !== undefined) {
      (e as Button).addEventListener('click', () => {resetSecondary()});
    }
  }

  render() {
    let spt = html``;
    const primaries = selectedPrimaries.get();
    const generals = allGenerals.get();

    const secondaries = selectedSecondaries.get();
    if(primaries !== null && primaries !== undefined && generals !== undefined && generals !== null) {
      for(let i = 0; i < generals?.length; i++) {
        if(generals[i] !== null && generals[i] !== undefined) {
          const v = generals[i];
          const k = v.general.name;
          let e: boolean = true;
          if(primaries.has(v)) {
            const tResult = primaries.get(v);
            e = (tResult !== undefined) ? tResult : true;
          }
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
          <sp-menu-item value="all">All</sp-menu-item>
          <sp-menu-divider></sp-menu-divider>
          ${spt}
        </sp-menu>
      </sp-popover>
      `

      let sst = html``;
      if(secondaries !== null && secondaries !== undefined) {
        for(let i = 0; i < secondaries.length; i++) {
          if(secondaries[i] !== null && secondaries[i] !== undefined) {
            const v = secondaries[i];
            const k = Object.keys(v)[0];
            const e = v[k]; 
            if (DEBUG) {console.log(`${k} set to ${e}`) }
            if(k !== null && k !== undefined) {
              sst = html`${sst}
                <sp-menu-item value=${k} selected=${(e === true)? true : nothing}>${k}</sp-menu-item>
              `
            }
          }
          
        }
      }
      sst = html`
      <sp-popover slot="click-content" open style="position: relative">
        <sp-menu label="Secondary Generals" selects="multiple" @change=${this.togglePrimarySelection}>
          
          ${sst}
        </sp-menu>
      </sp-popover>
      `

      return html`
      <div class="not-content outside">
        <div class="not-content primary">
          <overlay-trigger id="trigger" placement="bottom" offset="6">
            <sp-picker-button size="m" slot="trigger" type='button' ><span slot="label">Primary Generals</span></sp-picker-button>
            ${spt}
          </overlay-trigger>
          <sp-button treatment="outline" ${ref(this.primaryCickListener)}variant="primary" >Reset</sp-button>
        </div>
        <div class="not-content secondary">
          <overlay-trigger id="trigger" placement="bottom" offset="6">
            <sp-picker-button size="m" slot="trigger" type='button' ><span slot="label">Secondary Generals</span></sp-picker-button>
            ${spt}
          </overlay-trigger>
          <sp-button treatment="outline" ${ref(this.secondaryCickListener)}variant="primary" >Reset</sp-button>
        </div>
      </div>
      `
    }
  }

}
  