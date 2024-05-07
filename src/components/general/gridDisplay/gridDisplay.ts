import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ContextProvider, provide,  } from "@lit/context";
import {Task, initialState} from '@lit/task';
import {type Ref, createRef, ref} from 'lit/directives/ref.js';

import {
  type CSSResultArray,
  css,
  SpectrumElement,
} from "@spectrum-web-components/base";

import {type GeneralStore, GeneralStoreContext} from './GeneralContext';

import {GeneralTable} from './table';
import {DisplayControls} from './controls';

import {
  generalUseCase
} from '@schemas/index'
const DEBUG = true;

@customElement("grid-display")
export class GridDisplay extends SpectrumElement {

  @property({type: String})
  public useCase: String = generalUseCase.enum.all;

  @property({type: Boolean})
  public disableUseCase: boolean = false;

  @state()
  generalStore = new ContextProvider(this, {
    context: GeneralStoreContext,
    initialValue: {
      allGenerals: null,
      conflicts: null,
    }
  });
  private generalTableRef: Ref<GeneralTable> = createRef();
  private displayControlsRef: Ref<DisplayControls> = createRef();

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

  public static override get styles(): CSSResultArray {
    const localstyle = css`
    .sp-general-grid {
      z-index: 0;
      background-color: var(--spectrum-cyan-600);
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(15, 1fr);
      grid-auto-flow: row;
      grid-column-gap: var(--spectrum-global-dimension-size-25);
      grid-row-gap: var(--spectrum-global-dimension-size-25);
      justify-items: start;
      justify-content: space-between;
      align-items: start;
      align-content: start;
      
    }

    .controls {
      width: 100%;
      grid-row-start: 0 ;
      grid-row-end: span 5;
      place-self: stretch stretch;
      grid-column: 1 / span 5;
      
    }
    
    .table {
      width: 100%;
      grid-row-end: span 10;
      place-self: stretch stretch;
      grid-column: 1 / span 5;
      
    }
    .data {
      z-index: 0;
      display: none;
      grid-row-start: 0;
      grid-row-end: 1;
      grid-column-start: 0;
      grid-column-end: 1;
    }
    `;
    return [localstyle];
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
      <div class="sp-general-grid">
        <slot name="astro-store" @slotchange=${this.handleSlotchange}></slot>
      </div>
      `;
    } else {
      return html` 
        I have ${this.generalStore.value.allGenerals.length} generals
        <div class="sp-general-grid"> 
          <display-controls 
            class="controls" ${ref(this.displayControlsRef)} 
            defaultUseCase=${generalUseCase.enum.Monsters}
            disableUseCase="${this.disableUseCase || nothing}"
            ></display-controls>
          <general-table class="table" ${ref(this.generalTableRef)} >  </general-table>
          <slot class="data" name="astro-store" @slotchange=${this.handleSlotchange}></slot>
        </div>
        
      `;
    }
  }
}
