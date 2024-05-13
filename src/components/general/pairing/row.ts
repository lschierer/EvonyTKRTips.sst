import { html, css, type PropertyValues, type PropertyValueMap, LitElement, type CSSResultArray } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';

const DEBUG = false;
import { withStores } from "@nanostores/lit";

import { z } from 'astro:content';

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
import '@spectrum-web-components/dialog/sp-dialog.js';
import '@spectrum-web-components/table/elements.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/overlay/sp-overlay.js';
import '@spectrum-web-components/picker/sp-picker.js';
import { Picker } from '@spectrum-web-components/picker';
import '@spectrum-web-components/popover/sp-popover.js';
import '@spectrum-web-components/status-light/sp-status-light.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';


import { TypeSelector } from './TypeSelector.ts';
import { InvestmentSelector } from './InvestmentSelector.ts';

import {
  type generalInvestment,
  type generalTypeAndUse,
  primaryInvestmentMap,
  secondaryInvestmentMap,
  typeAndUseMap
} from './selectionStore.ts';

import {
  generalPairs,
} from './generals.ts';

import * as b from '@schemas/baseSchemas.ts';

import { statusLights, type statusLightsType } from "@schemas/statusLightsSchema.ts";

import {
  generalUseCase,
  type generalUseCaseType,
  type GeneralClassType
} from "@schemas/generalsSchema.ts"

import {Book, type BookType} from "@schemas/bookSchemas.ts"

import {
  conflictingBooks,
  checkConflicts
} from "./ConflictingSkillExcludes.ts";

import { buffAdverbs, buff } from './buff.ts';


@customElement('pairing-row')
export class PairingRow extends withStores(LitElement, [generalPairs, conflictingBooks, primaryInvestmentMap, secondaryInvestmentMap]) {

  @property({ type: String })
  public one: GeneralClassType | null = null;

  @property({ type: String })
  public two: GeneralClassType | null = null;

  accessor adverbs = buffAdverbs[generalUseCase.enum.all];

  
  @state()
  private attack_buff = 0;

  public getAttackBuff() {
    return this.attack_buff;
  }

  @state()
  private defense_buff = 0;

  public getDefenseBuff() {
    return this.defense_buff;
  }

  @state()
  private hp_buff = 0;

  public getHPBuff() {
    return this.hp_buff;
  }

  @state()
  private march_buff = 0;

  public getMarchBuff() {
    return this.march_buff;
  }

  @property({type: String, reflect: true})
  public unitClass: b.ClassEnumType = b.ClassEnum.enum.all;

  @state()
  private statusLight1: statusLightsType = statusLights.enum.neutral;

  @state()
  private statusLight2: statusLightsType = statusLights.enum.neutral;

  @state()
  private buffLead = false;

  @state()
  private props: generalInvestment = {
    dragon: primaryInvestmentMap.get().dragon,
    beast: primaryInvestmentMap.get().beast,
    ascending: primaryInvestmentMap.get().ascending,
    speciality1: primaryInvestmentMap.get().speciality1,
    speciality2: primaryInvestmentMap.get().speciality2,
    speciality3: primaryInvestmentMap.get().speciality3,
    speciality4: primaryInvestmentMap.get().speciality4,
    debuffLead: primaryInvestmentMap.get().debuffLead,
    extraBooks: [],
  };

  @state()
  private Assistprops: generalInvestment = {
    dragon: secondaryInvestmentMap.get().dragon ? secondaryInvestmentMap.get().dragon : false,
    beast: secondaryInvestmentMap.get().beast ? secondaryInvestmentMap.get().beast : false,
    ascending: '0' as b.levelsType,
    speciality1: secondaryInvestmentMap.get().speciality1 ? secondaryInvestmentMap.get().speciality1 : b.qualityColor.enum.Disabled,
    speciality2: secondaryInvestmentMap.get().speciality2 ? secondaryInvestmentMap.get().speciality2 : b.qualityColor.enum.Disabled,
    speciality3: secondaryInvestmentMap.get().speciality3 ? secondaryInvestmentMap.get().speciality3 : b.qualityColor.enum.Disabled,
    speciality4: secondaryInvestmentMap.get().speciality4 ? secondaryInvestmentMap.get().speciality4 : b.qualityColor.enum.Disabled,
    debuffLead: this.props.debuffLead,
    extraBooks: [],
  };
  
  constructor() {
    super()

    generalPairs.subscribe(gp => {
      if (DEBUG) { console.log(`rows constructor generalPairs subscribe`) }
      return;
    })

    conflictingBooks.subscribe(cb => {
      return;
    })

    primaryInvestmentMap.subscribe(pim => {
      this.requestUpdate('props', this.props);
      this.props = {
        dragon: pim.dragon,
        beast: pim.beast,
        debuffLead: pim.debuffLead,
        ascending: pim.ascending,
        speciality1: pim.speciality1,
        speciality2: pim.speciality2,
        speciality3: pim.speciality3,
        speciality4: pim.speciality4,
        extraBooks: [],
      };
      if (this.one !== null && this.one !== undefined) {
        this.computeBuffs();
      }
      if(this.buffLead !== pim.debuffLead) {
        if(DEBUG) {console.log(`row buffLead being set`)}
        this.buffLead = pim.debuffLead;
        this.Assistprops.debuffLead = pim.debuffLead;
        this.computeBuffs();
        this.requestUpdate();
      }

    })

    secondaryInvestmentMap.subscribe(sim => {
      this.requestUpdate('Assistprops', this.Assistprops);
      this.Assistprops = {
        dragon: sim.dragon,
        beast: sim.beast,
        debuffLead: this.props.debuffLead,
        ascending: '0' as b.levelsType,
        speciality1: sim.speciality1,
        speciality2: sim.speciality2,
        speciality3: sim.speciality3,
        speciality4: sim.speciality4,
        extraBooks: [],
      };
      if (this.one !== null && this.one !== undefined) {
        this.computeBuffs();
      }
    })

  }

  connectedCallback(): void {
    super.connectedCallback();
    if(DEBUG) {console.log(`rows connectedCallback`)}


  }

  public triggerUpdate() {

    this.shouldUpdate();
  }

  protected override shouldUpdate(_changedProperties?: PropertyValueMap<any> | Map<PropertyKey, unknown>): boolean {
    if(DEBUG) {console.log(`rows shouldupdate start`) }

    if ((this.one !== null && this.one !== undefined) || (this.two !== null && this.two !== undefined)) {
      if (this.attack_buff === 0 && this.defense_buff === 0 && this.hp_buff === 0) {
        return true;
      }
    }
    if (_changedProperties !== null && _changedProperties !== undefined) {
      const returnable = super.shouldUpdate(_changedProperties);
      return returnable;
    }
    return false;
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if(DEBUG) {console.log(`rows willUpdate start`) }
    super.willUpdate(_changedProperties);
    if (_changedProperties.has('one') || _changedProperties.has('two')) {
      if(DEBUG) {console.log(`rows willupdate has one or two`) }
    }
    if(_changedProperties.has('unitClass') || _changedProperties.has('adverbs')) {
      if (this.one !== null) {
        if (this.one.score_as !== null && this.one.score_as !== undefined) {
          if (this.one.score_as !== this.unitClass) {
            this.statusLight1 = statusLights.enum.fuchsia;
          }
        }
      }
      if (this.one !== null && this.one !== undefined) {
        this.computeBuffs();
      }
    }
  }

  private yieldToMain () {
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  computeBuffs() {
    if (DEBUG) { console.log(`rows computeBuffs start`) }
    if(this.one !== null && this.one !== undefined) {
      const { attackBuff, defenseBuff, hpBuff, marchBuff } = buff(this.one, this.adverbs, this.props);
      if(DEBUG) {console.log(`${this.one.name} a ${attackBuff} d ${defenseBuff} h ${hpBuff}`)}
      this.one.totalBuffs = {
        attack: attackBuff,
        defense: defenseBuff,
        hp: hpBuff,
        march: marchBuff,
      }
    }
    
    if (this.one !== null && this.one.totalBuffs !== null && this.one.totalBuffs !== undefined) {
      
      this.yieldToMain();
      this.requestUpdate('attack_buff', this.attack_buff);
      this.attack_buff = this.one.totalBuffs.attack;
      this.requestUpdate('defense_buff', this.defense_buff);
      this.defense_buff = this.one.totalBuffs.defense;
      this.requestUpdate('hp_buff', this.hp_buff);
      this.hp_buff = this.one.totalBuffs.hp;
      this.march_buff = this.one.totalBuffs.march;
      if (DEBUG) { console.log(`o ${this.one.name}, attack now ${this.attack_buff}`) }
      if (this.two !== null) {
        if (!checkConflicts(this.one.name, this.two.name, this.unitClass)) {
          const { attackBuff, defenseBuff, hpBuff, marchBuff } = buff(this.two, this.adverbs, this.Assistprops);
          if(DEBUG) {console.log(`${this.two.name} a ${attackBuff} d ${defenseBuff} h ${hpBuff}`)}
          this.two.totalBuffs = {
            attack: attackBuff,
            defense: defenseBuff,
            hp: hpBuff,
            march: marchBuff,
          }
          if(this.two.totalBuffs !== null && this.two.totalBuffs !== undefined) {
            this.attack_buff = this.attack_buff + this.two.totalBuffs.attack;
            this.defense_buff = this.defense_buff + this.two.totalBuffs.defense;
            this.hp_buff = this.hp_buff + this.two.totalBuffs.hp;
            this.march_buff = this.march_buff + this.two.totalBuffs.march;
          } 
          if (DEBUG) { console.log(`o ${this.one.name} t ${this.two.name}, attack now ${this.attack_buff}`) }
        } else {
          console.error(`conflict detected, this pair should have been filtered`)
        }
      }
      this.dispatchEvent(new CustomEvent('GeneralPairUpdate', { bubbles: true, composed: true }));
    } else {
      console.error(`first general is null`)
    }
  }

  public static override get styles(): CSSResultArray {
    const localstyle = css`
      
      
      
    
    `
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];

  }

  public render1() {
    const statusOverlay = html``;
    if (this.one !== null && this.one !== undefined) {
      const mySkillConflicts = (conflictingBooks.get()!).get(this.one.name);
      if (mySkillConflicts !== null && mySkillConflicts !== undefined) {
        if (mySkillConflicts.length >= 1) {
          this.statusLight1 = statusLights.enum.notice;
          mySkillConflicts.forEach((book) => {
            for (let i = 0; i < book.buff.length; i++) {
              const keys = Object.keys(book.buff[i]);
              if(book.buff[i].condition !== null && book.buff[i].condition !== undefined) {
                if (book.buff[i].condition === b.Condition.enum.When_Not_Mine) {
                  if(this.statusLight1 === statusLights.enum.notice) {
                    this.statusLight1 = statusLights.enum.indigo;
                  }
                }
                if((book.buff[i].condition === b.Condition.enum.dragon_to_the_attack) ||
                (book.buff[i].condition === b.Condition.enum.brings_dragon_or_beast_to_attack)){
                  if((this.statusLight1 === statusLights.enum.notice) ||
                    (this.statusLight1 === statusLights.enum.indigo)){
                    this.statusLight1 = statusLights.enum.magenta;
                  }
                }
              }
            }
          })
      
        }
      }
      if((this.statusLight1 === statusLights.enum.neutral) ||
      (this.statusLight1 === statusLights.enum.indigo)) {
        if(this.one.books !== null && this.one.books !== undefined) {
          const book1: BookType = this.one.books[0];
          const buffArray: b.BuffType[] = book1.buff;
          for(const be in buffArray) {
            const condition = buffArray[be].condition;
            if(condition !== null && condition !== undefined) {
              if ((condition === b.Condition.enum.dragon_to_the_attack) ||
              (condition === b.Condition.enum.brings_dragon_or_beast_to_attack)) {
                this.statusLight1 = statusLights.enum.magenta;
              }
            }
          }
          
        }
      }
      return html`
    <sp-table-cell role='gridcell' dir='ltr' id='primeName'>
      <div class="cellDiv not-content">
        <div class="name not-content">
          ${this.one ? this.one.name : "No Primary General"}
        </div>
        <div class="status">
          <sp-status-light size='m' variant=${this.statusLight1} >
            
          </sp-status-light>
          ${statusOverlay}
        </div>
      </div>
    </sp-table-cell>
    `
    }
    return html``;
  }

  public render2() {
    if (this.two !== null && this.two !== undefined) {
      const mySkillConflicts = (conflictingBooks.get()!).get(this.two.name);
      if (mySkillConflicts !== null && mySkillConflicts !== undefined) {
        if (mySkillConflicts.length >= 1) {
          this.statusLight2 = statusLights.enum.notice;
          mySkillConflicts.forEach((book) => {
            for (let i = 0; i < book.buff.length; i++) {
              const keys = Object.keys(book.buff[i]);
              if(book.buff[i].condition !== null && book.buff[i].condition !== undefined) {
                if (book.buff[i].condition === b.Condition.enum.When_Not_Mine) {
                  if(this.statusLight2 === statusLights.enum.notice) {
                    this.statusLight2 = statusLights.enum.indigo;
                  }
                }
                if((book.buff[i].condition === b.Condition.enum.dragon_to_the_attack) ||
                (book.buff[i].condition === b.Condition.enum.brings_dragon_or_beast_to_attack)){
                  if((this.statusLight2 === statusLights.enum.notice) ||
                    (this.statusLight2 === statusLights.enum.indigo)){
                    this.statusLight2 = statusLights.enum.magenta;
                  }
                }
              }
            }
          })
        }
      }
    }
    if((this.statusLight2 === statusLights.enum.neutral) ||
      (this.statusLight2 === statusLights.enum.indigo)) {
        if(this.two!.books !== null && this.two!.books !== undefined) {
          const book1: BookType = this.two!.books[0];
          const buffArray: b.BuffType[] = book1.buff;
          for(const be in buffArray) {
            const condition = buffArray[be].condition;
            if(condition !== null && condition !== undefined) {
              if ((condition === b.Condition.enum.dragon_to_the_attack) ||
              (condition === b.Condition.enum.brings_dragon_or_beast_to_attack)) {
                this.statusLight2 = statusLights.enum.magenta;
              }
            }
          }
          
        }
      }
    return html`
      <sp-table-cell role='gridcell' dir='ltr' id='assistName'>
        <div class="cellDiv not-content">
          <div class="name not-content">
            ${this.two ? this.two.name : "No Primary General"}
          </div>
          <div class="status">
            <sp-status-light size='m' variant=${this.statusLight2} >
            <sp-overlay trigger@hover>
              <sp-tooltip placement="right-end" >Skill Book Conflict</sp-tooltip>
            </sp-overlay>
            </sp-status-light>
          </div>
        </div>
      </sp-table-cell>
    
    `
  }

  public render3() {
    return html`
    <sp-table-cell role='gridcell' dir='ltr' id='attackBuff'>${this.attack_buff.toFixed(2)}</sp-table-cell>
    `
  }

  public render4() {
    return html`
    <sp-table-cell role='gridcell' dir='ltr' id='HPBuff'>${this.hp_buff.toFixed(2)}</sp-table-cell>
    `
  }

  public render5() {
    return html`
    <sp-table-cell role='gridcell' dir='ltr' id='defenseBuff'>${this.defense_buff.toFixed(2)}</sp-table-cell>
    `
  }

  public render6() {
    return html`
    <sp-table-cell role='gridcell' dir='ltr' id='marchBuff'>${this.march_buff.toFixed(2)}</sp-table-cell>
    `
  }

  protected createRenderRoot() {
    return this;
  }

  render() {

    return html`
    ${this.render1()}
    ${this.render2()}
    ${this.render3()}
    ${this.render4()}
    ${this.render5()}
    ${this.render6()}
    `
  }

}
