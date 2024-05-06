import {LitElement, html} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {provide, createContext} from '@lit/context';

import { type CSSResultArray, SpectrumElement, SpectrumMixin } from '@spectrum-web-components/base';

import {
    ConflictArray,
    type ConflictArrayType,
    ConflictDatum,
    type ConflictDatumType,
    GeneralElement,
    type GeneralElementType
} from "@schemas/index";

export class GeneralStore {

    public allGenerals: GeneralElementType[];

    public conflicts: ConflictArrayType;

}

export const GeneralStoreContext = createContext<GeneralStore>('GeneralStore');

@customElement('grid-display')
export class GridDisplay extends SpectrumElement {

    @provide({context: GeneralStoreContext})
    generalStore = new GeneralStore();

    handleSlotchange(e) {
        console.log(`grid-display handleSlotchange called`)
        const childNodes = e.target.assignedNodes({flatten: true});
        // ... do something with childNodes ...
        if(
            (this.generalStore.allGenerals === undefined) || 
            (!Array.isArray(this.generalStore.allGenerals)) ||
            (this.generalStore.allGenerals.length <= 0)
        ) {
            this.generalStore.allGenerals = childNodes.map((node:Element) => {
                if(node.allGenerals !== undefined && node.allGenerals !== null) {
                  return node.allGenerals;
                } else {
                  console.log(`node ${node.className} does not have property allGenerals`)
                }
              }).flat();
              this.requestUpdate();
        }

        if(
            (this.generalStore.conflicts === undefined) || 
            (!Array.isArray(this.generalStore.conflicts)) ||
            (this.generalStore.conflicts.length <= 0)
        ) {
            this.generalStore.conflicts = childNodes.map((node) => {
                if(node.conflictRecords !== undefined && node.conflictRecords !== null) {
                    return node.conflictRecords;
                }
            }).flat();
            this.requestUpdate();
        }
      }

    render() {
        if(
            (this.generalStore.allGenerals === undefined) || 
            (!Array.isArray(this.generalStore.allGenerals)) ||
            (this.generalStore.allGenerals.length <= 0)
        ) {
            return html`
            gridDisplay
            <slot name="astro-store" @slotchange=${this.handleSlotchange}></slot>
        `
        } else {
            return html`
                I have ${this.generalStore.allGenerals.length} generals
            `
        }
    }

}