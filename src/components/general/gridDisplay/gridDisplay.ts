import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ContextProvider, provide,  } from "@lit/context";
import {Task, initialState} from '@lit/task';

import {
  type CSSResultArray,
  SpectrumElement,
  SpectrumMixin,
} from "@spectrum-web-components/base";

import {type GeneralStore, GeneralStoreContext} from './GeneralContext';
import { allGenerals } from "../pairing/generals";

const DEBUG = true;

@customElement("grid-display")
export class GridDisplay extends SpectrumElement {

  @state()
  generalStore = new ContextProvider(this, {
    context: GeneralStoreContext,
    initialValue: {
      allGenerals: null,
      conflicts: null,
    }
  });

  handleSlotchange(e: Event) {
    if (DEBUG) console.log(`grid-display handleSlotchange called`);
    const childNodes = (e.target as HTMLSlotElement).assignedNodes({ flatten: true });
    let needsUpdate = false;
    if (
      this.generalStore.value.allGenerals === undefined ||
      !Array.isArray(this.generalStore.value.allGenerals) ||
      this.generalStore.value.allGenerals.length <= 0
    ) {
      if(DEBUG) console.log(`grid-display handleSlotchange; generals store defined generals are zero`)
      this.generalStore.value.allGenerals = childNodes
        .map((node: any) => {
          if (node.allGenerals !== undefined && node.allGenerals !== null) {
            if(DEBUG) console.log(`found node with allGenerals property`)
            return node.allGenerals;
          } else {
            console.log(
              `node ${node.className} does not have property allGenerals`
            );
          }
        })
        .flat();
      if(DEBUG) console.log(`updated to allGenerals ${this.generalStore?.value?.allGenerals?.length}`)
      needsUpdate = true;
    }

    if (
      this.generalStore.value.conflicts === undefined ||
      !Array.isArray(this.generalStore.value.conflicts) ||
      this.generalStore.value.conflicts.length <= 0
    ) {
      this.generalStore.value.conflicts = childNodes
        .map((node: any) => {
          if (
            node.conflictRecords !== undefined &&
            node.conflictRecords !== null
          ) {
            return node.conflictRecords;
          }
        })
        .flat();
        needsUpdate = true;
    }
    if(needsUpdate) {
      if(DEBUG) console.log(`gridDisplay handleSlotChange needsUpdate if`)
      this.requestUpdate();
    }
  }

  render() {
    if (
      this.generalStore.value.allGenerals === undefined ||
      this.generalStore.value.allGenerals === null || 
      (this.generalStore.value.allGenerals!== null && 
        !Array.isArray(this.generalStore.value.allGenerals) ||
        this.generalStore.value.allGenerals.length <= 0
      )
    ) {
      return html`
        gridDisplay
        <slot name="astro-store" @slotchange=${this.handleSlotchange}></slot>
      `;
    } else {
      return html` 
        I have ${this.generalStore.value.allGenerals.length} generals 
        <general-table />
      `;
    }
  }
}
