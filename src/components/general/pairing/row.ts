import {  html, css, type PropertyValues, type PropertyValueMap} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

const DEBUG = true;
import { withStores } from "@nanostores/lit";

import {z,  type ZodError} from 'zod';

import { SpectrumElement } from '@spectrum-web-components/base';

import {
  type Table,
  type TableBody,
  type TableCell,
  type TableCheckboxCell,
  type TableHead,
  type TableHeadCell,
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

import {
  generalPairs,
} from './generals.ts';

import * as b from '@schemas/baseSchemas.ts';

import {statusLights, type statusLightsType } from "@schemas/statusLightsSchema.ts";

import {
  type GeneralClassType
} from "@schemas/generalsSchema.ts"

import {
  conflictingBooks,
} from "./ConflictingSkillExcludes.ts";

import {buff} from './buff.ts';

@customElement('pairing-row')
export class PairingRow extends withStores(TableRow, [generalPairs,conflictingBooks,typeAndUseMap,primaryInvestmentMap, secondaryInvestmentMap]) {

  @property({type: String})
  public one: GeneralClassType | null = null;

  @property({type: String})
  public two: GeneralClassType | null = null;

  constructor() {
    super()
  }

  @state()
  private attack_buff: Number = 0;

  @state()
  private defense_buff: Number = 0;

  @state()
  private hp_buff: Number = 0;

  @state()
  private march_buff: Number = 0;

  @state()
  private unitClass: b.ClassEnum = b.ClassEnumSchema.enum.all;

  @state()
private statusLight: statusLightsType = statusLights.enum.neutral;

  private props = {
    dragon: primaryInvestmentMap.get().dragon,
    beast: primaryInvestmentMap.get().beast,
    ascending: primaryInvestmentMap.get().ascending,
    Speciality1: primaryInvestmentMap.get().speciality1,
    Speciality2: primaryInvestmentMap.get().speciality2,
    Speciality3: primaryInvestmentMap.get().speciality3,
    Speciality4: primaryInvestmentMap.get().speciality4,
  };

  private Assistprops = {
    dragon: secondaryInvestmentMap.get().dragon,
    beast: secondaryInvestmentMap.get().beast,
    ascending: secondaryInvestmentMap.get().ascending,
    Speciality1: secondaryInvestmentMap.get().speciality1,
    Speciality2: secondaryInvestmentMap.get().speciality2,
    Speciality3: secondaryInvestmentMap.get().speciality3,
    Speciality4: secondaryInvestmentMap.get().speciality4,
  };

  connectedCallback(): void {
    generalPairs.subscribe(gp => {
      return;
    })

    conflictingBooks.subscribe(cb => {
      return;
    })

    typeAndUseMap.subscribe(tum => {
      this.unitClass = tum.type;
      if(this.one !== null) {
        if(this.one.score_as !== null && this.one.score_as !== undefined) {
          if(this.one.score_as !== this.unitClass) {
            this.statusLight = statusLights.enum.fuchsia;
          }
        }
      }
    })
    
    primaryInvestmentMap.subscribe(pim => {
      this.props = {
        dragon: pim.dragon,
        beast: pim.beast,
        ascending: pim.ascending,
        Speciality1: pim.speciality1,
        Speciality2: pim.speciality2,
        Speciality3: pim.speciality3,
        Speciality4: pim.speciality4,
      };
    })

    secondaryInvestmentMap.subscribe(sim => {
      this.Assistprops = {
        dragon: sim.dragon,
        beast: sim.beast,
        ascending: sim.ascending,
        Speciality1: sim.speciality1,
        Speciality2: sim.speciality2,
        Speciality3: sim.speciality3,
        Speciality4: sim.speciality4,
      };
    })

  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(_changedProperties);

    if(_changedProperties.has('one') || _changedProperties.has('two')) {
      
    
      
    }
    
  }

  public render1() {
    return html`
    <sp-table-cell role='gridcell' dir='ltr' id='primeName'>${this.one ? this.one.name : "No Primary General"}</sp-table-cell>
    `
  }

  render() {
  
    return html`
    <sp-table-cell role='gridcell' dir='ltr' id='primeName'>${this.one ? this.one.name : "No Primary General"}</sp-table-cell>
    <sp-table-cell role='gridcell' dir='ltr' id='assistName'>${this.two ? this.two.name : "No Primary General"}</sp-table-cell>
    <sp-table-cell role='gridcell' dir='ltr' id='attackBuff'>${this.attack_buff.toFixed(2)}</sp-table-cell>
    <sp-table-cell role='gridcell' dir='ltr' id='HPBuff'>${this.hp_buff.toFixed(2)}</sp-table-cell>
    <sp-table-cell role='gridcell' dir='ltr' id='defenseBuff'>${this.defense_buff.toFixed(2)}</sp-table-cell>
    `
  }

}
