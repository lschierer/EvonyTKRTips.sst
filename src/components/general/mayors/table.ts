import { LitElement, html, css, type CSSResultGroup, type CSSResultArray, getCompatibleStyle, type PropertyValues, type PropertyValueMap, nothing } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import { consume } from '@lit/context';

const DEBUG = true;

import {
  ClassEnum,
  GeneralArray,
  generalUseCase,
  levels,
  qualityColor,
  standardSkillBook,
  type ClassEnumType,
  type GeneralArrayType,
  type GeneralElementType,
  type generalUseCaseType,
  type levelsType,
  type qualityColorType,
  type standardSkillBookType,
} from "@schemas/index";

import {
  type generalTypeAndUse, 
  type generalInvestment,  
  generalsContext,
} from "./contexts"

import {
  Table,
  type TableBody,
  type TableCell,
  type TableCheckboxCell,
  type TableHead,
  type TableHeadCell,
  type TableRow
} from '@spectrum-web-components/table';
import { SpectrumElement } from "@spectrum-web-components/base";
import '@spectrum-web-components/table/elements.js';


@customElement("general-table")
export class GeneralTable extends SpectrumElement {

  @consume({ context: generalsContext, subscribe: true })
  @property({attribute: false})
  public theGenerals?: GeneralArrayType | undefined;

  private tableRef: Ref<Table> = createRef();

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(_changedProperties);
    if(_changedProperties.has('theGenerals')){
      if(DEBUG) {console.log(`mayor table willUpdate`)}

    }
  }

  public static override get styles(): CSSResultGroup | undefined {
    const localstyle = css`
      sp-table {
        background-color: var(--spectrum-cyan-600);
        
        .cellDiv {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-evenly;
          width: 100%;

          & .name {
            flex: 3;
          }

          & .status {
            flex: 1;
          }

          & sp-status-light {
            align-self: center;
            padding: 1px;
          }
        }
        
        & #primeName {
          flex-grow: 3;
        }
          
        & #assistName {
          flex-grow: 3;
        }

        & sp-table-body {
          min-height: var(--spectrum-global-dimension-size-900);
        }
      }
      `
    if (super.styles !== null && super.styles !== undefined) {
      let cra: CSSResultArray = ([super.styles].flat() as CSSResultArray);
      cra.push(localstyle);
      return cra as CSSResultGroup;
    } else return [localstyle];

  }

  render() {
    return html`
      ${(this.theGenerals !== undefined) ?  this.theGenerals?.length : nothing }
      <sp-table size="m" style="height: calc(var(--spectrum-global-dimension-size-3600)*2)"scroller="true" ${ref(this.tableRef)}>
        <sp-table-head>
          <sp-table-head-cell sortable sort-direction="desc" id='primeName' sort-key="primeName">
            Mayor Name
          </sp-table-head-cell>
          <sp-table-head-cell sortable sort-direction="desc" id='attackDebuff' sort-key="attackDebuff">
            Attack Debuff
          </sp-table-head-cell>
          <sp-table-head-cell sortable sort-direction="desc" id='SDebuff' sort-key="SDebuff">
            Survivability Debuff
          </sp-table-head-cell>
          <sp-table-head-cell sortable sort-direction="desc" id='HPDebuff' sort-key="HPDebuff">
            HP Debuff
          </sp-table-head-cell>
          <sp-table-head-cell sortable sort-direction="desc" id='defenseDebuff' sort-key="defenseDebuff">
            Defense Debuff
          </sp-table-head-cell>
          <sp-table-head-cell sortable sort-direction="desc" id='W2DDebuff' sort-key="W2DDebuff">
            Wounded to Death Rate
          </sp-table-head-cell>
          <sp-table-head-cell sortable sort-direction="desc" id='SCTSDebuff' sort-key="SCTSDebuff">
            SubCity Training Speed
          </sp-table-head-cell>
          <sp-table-head-cell sortable sort-direction="desc" id='SCTCDebuff' sort-key="SCTCDebuff">
            SubCity Training Capacity
          </sp-table-head-cell>
        </sp-table-head>
      </sp-table>
    `
  }

}