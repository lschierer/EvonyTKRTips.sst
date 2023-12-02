import {html, css, nothing, type CSSResultArray, type PropertyValues, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref} from 'lit/directives/ref.js';

import {z} from 'zod';

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

import * as util from '../../../lib/util';

import {
  GeneralArray,
    type GeneralElementType,
    GeneralElement,
} from "@schemas/generalsSchema";

import { 
  GeneralToggle,
  type GeneralToggleType,
  allGenerals, 
  filteredPrimaries, 
  selections, 
  togglePrimary, 
  toggleSecondary, 
  resetPrimary, 
  resetSecondary,
  getValue,
} from "./generals";


@customElement('general-filter')
export class GeneralFilter extends withStores(SpectrumElement, [allGenerals, filteredPrimaries, selections]) { 

  @state()
  private primaryValues: string[] = new Array<string>();


  @state()
  private secondaryValues: string[] = new Array<string>();

  constructor() {
    super();
    selections.subscribe(sp => {
      if(DEBUG){console.log(`requesting update for selections subscribe`)}
      this.requestUpdate();
    });

    allGenerals.subscribe(ag => {
      if(DEBUG) {console.log(`ag subscribe in general-filter`) }
      if(ag !== null && ag !== undefined) {
        const valid = GeneralArray.safeParse(ag);
        let spv = selections.get().primaries;
        let ssv = selections.get().secondaries;
        if(valid.success) {
          if(DEBUG) {console.log(`ag subscribe I have a valid ag`)}
          if(spv === null || spv === undefined) {
            resetPrimary();
          } else if(spv.length === 0) {
            console.error(`ag subscribe shows spv with size 0`)
          } else {
            if(DEBUG) {console.log(`until I am persistent, spv is fine`)}
          }

          if(ssv === null || ssv === undefined) {
            resetSecondary();
          } else if(ssv.length === 0) {
            console.error(`ag subscribe shows ssv with size 0`)
          } else {
            if(DEBUG) {console.log(`until I am persistent, ssv is fine`)}
          }
        } else {
          console.error(`ag subscribe cannot parse generals`)
          selections.setKey('primaries', null);
          selections.setKey('secondaries', null);
        }
      } else {
        if(DEBUG) {console.log(`ag subscribe setting selections to null`)}
        selections.setKey('primaries', null);
        selections.setKey('secondaries', null);
      }

    })
  
    const allgens = allGenerals.get();
    if(allgens !== null && allgens !== undefined) {
      allgens.map((ag) => {
        if(ag !== null && ag !== undefined) {
          this.primaryValues.push(ag.general.name);
          this.secondaryValues.push(ag.general.name);
        }
      })
    }
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
    const values = (e.target as Menu).value.split(',').sort();
    const oldValues = this.primaryValues.sort();
    const vdiff:string[] = new Array<string>();
    const vUnion = new Set<string>();
    for(let i = 0; i < oldValues.length; i++) {
      const v1 = oldValues[i];
      if(v1 !== null && v1 !== undefined) {
        const k1 = Object.keys(v1)[0];
        for(let j = 0 ; j < values.length; j++) {
          if(vUnion.has(k1)){
            continue;
          }
          const v2 = values[j]
          if(v2 !== null && v2 !== undefined) {
            const k2 = Object.keys(v2)[0];
            if(!k1.localeCompare(k2)){
              vUnion.add(k1);
            }
          }
        }
        if(!vUnion.has(k1)) {
          vdiff.push(k1);
        }
      }
    }
    if(DEBUG) {console.log(`I have ${vdiff.length} differences: old: ${JSON.stringify(oldValues)}, new: ${JSON.stringify(values)}, diff: ${JSON.stringify(vdiff)}`)}
    this.primaryValues = [...values];
    if(vdiff.includes("all")){
      console.log(`I should reset`)
      return;
    }
    allGenerals.get()?.forEach((gen) => {
      if(gen !== null && gen !== undefined) {
        if(!vdiff.includes(gen.general.name) && oldValues.includes(gen.general.name)){
          if(DEBUG){console.log(`tPS used !vdiff for ${gen.general.name}`)}
          const ov = getValue('primary', gen);
          if(ov !== true) {
            if(DEBUG){console.log(`and marking true`)}
            togglePrimary(gen,true);
          }else {
            if(DEBUG){console.log(`and marking false`)}
            togglePrimary(gen,false)
          }
        } else if (!values.includes(gen.general.name)) {
          if(DEBUG){console.log(`tPS used !values for ${gen.general.name}`)}
          const ov = getValue('primary', gen);
          if(ov !== false) {
            if(DEBUG){console.log(`and setting false`)}
            togglePrimary(gen, false);
          } else {
            if(DEBUG){console.log(`gen ${gen.general.name} has ov ${ov}`)}
          }
        }
      }
    })
    this.requestUpdate();
  }

  public toggleSecondarySelection(e: CustomEvent) {
    const values = new Set((e.target as Menu).value.split(','));
    const oldValues = new Set(this.secondaryValues);
    const vdiff:string[] = [...util.setDifference(values, oldValues)];
    this.secondaryValues = [...values];
    if(vdiff.includes("all")){
      console.log(`I should reset`)
      return;
    }
    allGenerals.get()?.forEach((gen) => {
      if(gen !== null && gen !== undefined) {
        if(!vdiff.includes(gen.general.name)){
          toggleSecondary(gen,false);
          this.requestUpdate();
        } else {
          toggleSecondary(gen, true);
          this.requestUpdate();
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
    let sst = html``;
    let npv = new Array<string>();
    let nsv = new Array<string>();
    let primaries = selections.get().primaries;
    if(primaries === null || primaries === undefined) {
      resetPrimary();
    }
    let secondaries = selections.get().secondaries;
    if(secondaries === null || secondaries === undefined) {
      resetSecondary();
    }
    const generals = allGenerals.get();
    
    if(primaries !== null && primaries !== undefined) {
      if( secondaries !== null && secondaries !== undefined) {
        if( generals !== undefined && generals !== null) {
          for(let i = 0; i < generals.length; i++) {
            if(generals[i] !== null && generals[i] !== undefined) {
              const v = generals[i];
              const k = v.general.name;
              let p: boolean = false;
              
              if(primaries.length > 0) {
                for(let i  = 0; i < primaries.length; i++) {
                  const r = primaries[i];
                  const tk = Object.keys(r)[0];
                  if(!tk.localeCompare(k)) {
                    p = Object.values(r)[0];
                  }
                }
              }
              if (DEBUG) {console.log(`${k} set p to ${p}`) }
              if(k !== null && k !== undefined) {
                npv.push(k);
                spt = html`${spt}
                  <sp-menu-item value=${k} selected=${(p === true)? true : nothing}>${k}</sp-menu-item>
                `
              }
            }
            
          }
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

    sst = html`
    <sp-popover slot="click-content" open style="position: relative">
      <sp-menu value=${this.secondaryValues.join(',')} label="Secondary Generals" selects="multiple" @change=${this.toggleSecondarySelection}>
        
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
          ${sst}
        </overlay-trigger>
        <sp-button treatment="outline" ${ref(this.secondaryCickListener)}variant="primary" >Reset</sp-button>
      </div>
    </div>
    `
  }

}
  
