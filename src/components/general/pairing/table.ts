import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

const DEBUG = true;
import { withStores } from "@nanostores/lit";

import {z,  type ZodError} from 'zod';

import { SpectrumElement } from '@spectrum-web-components/base';

import type {
  Table,
  TableBody,
  TableCell,
  TableCheckboxCell,
  TableHead,
  TableHeadCell,
  TableRow
} from '@spectrum-web-components/table';
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

import {
  type generalInvestment,
  type generalTypeAndUse,
  primaryInvestmentMap,
  secondaryInvestmentMap,
  typeAndUseMap
} from '../generalInvestmentStore.ts';

@customElement('pairing-table')
export class PairingTable extends withStores(SpectrumElement, [typeAndUseMap,primaryInvestmentMap, secondaryInvestmentMap]) {

  render(){
    return html`hi`
  }

}