import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

const DEBUG = false;

import { withStores } from "@nanostores/lit";

import {z,  type ZodError} from 'zod';

import { SpectrumElement } from '@spectrum-web-components/base';

import '@spectrum-web-components/table/elements.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';
import '@spectrum-web-components/status-light/sp-status-light.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import {InterestSelector} from '../InterestSelector.ts';
import {InvestmentSelector} from '../InvestmentSelector.ts';
import {PairingTable} from './table.ts';

import {
  type generalInvestment,
  type generalTypeAndUse,
  primaryInvestmentMap,
  secondaryInvestmentMap,
  typeAndUseMap
} from '../generalInvestmentStore.ts';

import {
  conflictingGenerals,
  conflictRecords,
  checkConflicts,
} from "@components/general/ConflictingSkillExcludes.ts";

import {
  generalSchema,
  type General,
  generalObjectSchema,
  generalUseCase,
  type generalUseCaseType,
  type generalObject,
  levelSchema,
  type levelSchemaType,
  troopClass,
  type troopClassType,
} from "@schemas/evonySchemas.ts";


const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

@customElement('pairing-page')
export class PairingPage extends withStores(SpectrumElement, [conflictingGenerals,conflictRecords,typeAndUseMap,primaryInvestmentMap, secondaryInvestmentMap]) {

  private changeHandler(e: CustomEvent) {
    console.log(`${JSON.stringify(e)}`)
  }

  static styles = css`
    .sp-table-container {
      display: block;
      flex: 2 0 auto;
      min-height: calc(var(--spectrum-global-dimension-size-6000)*2);
      & sp-table {
        background-color: var(--spectrum-cyan-600);
        
        
        & #Status {
          flex-grow 1;
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
    }
    
  `

  public render() {

    return html`
      <div class="sp-table-container">
        <interest-selector role="primary"></interest-selector>
        <investment-selector generalRole="primary" @PickerChanged=${this.changeHandler} ></investment-selector>
        <investment-selector generalRole="secondary" @PickerChanged=${this.changeHandler}></investment-selector>
        <pairing-table></pairing-table>
      </div>
    `

  }

}