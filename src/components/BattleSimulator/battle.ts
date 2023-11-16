import { css, html, type CSSResultArray, type PropertyValueMap, type TemplateResult, nothing } from "lit";
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';

import { withStores } from "@nanostores/lit";

const DEBUG = true;

import { SpectrumElement } from '@spectrum-web-components/base';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/number-field/sp-number-field.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/split-view/sp-split-view.js';
import '@spectrum-web-components/status-light/sp-status-light.js';
import '@spectrum-web-components/switch/sp-switch.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import { NumberField } from '@spectrum-web-components/number-field';
import { Picker } from '@spectrum-web-components/picker';
import { Switch } from '@spectrum-web-components/switch';




import { addValue, formValues } from '../formValueStore';

import { Tier, type TierType } from "@schemas/troopsSchemas.ts"
import { statusLights, type statusLightsType } from "@schemas/statusLightsSchema.ts";

import * as b from "@schemas/baseSchemas";


import { EvonySiege } from "./siege";

interface TroopTier {
  tier: TierType, 
  count: number,
  range: number,
};

export class EvonyBattle extends withStores(SpectrumElement, [formValues]) {

  @state()
  private _attackerSiegeTiers: TroopTier[] = new Array<TroopTier>();

  @state()
  private _defenderSiegeTiers: TroopTier[] = new Array<TroopTier>();

  @state()
  private _battlefieldSize: number = 0;

  constructor() {
    super()
    formValues.subscribe((fv) => {
      if (fv !== null && fv !== undefined) {
        this.requestUpdate();
        return true;
      } else {
        return false;
      }
    })
  }

  public override willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(_changedProperties);
    const fv = formValues.value;
    if (fv !== null && fv !== undefined) {
      let ar = 0;
      let dr = 0;
      for (let i = 15; i > 0; i--) {
        let v = fv.get(`Attacker.t${i}.siege`);
        if (v !== null && v !== undefined) {
          if(DEBUG) {console.log(`Attacker.t${i}.siege is ${v}`)}
          const _tier = Tier.safeParse(`t${i}`);
          if (_tier.success) {
            if(DEBUG) {console.log(`tier is ${_tier.data}`)}
            this._attackerSiegeTiers[i] = {
              tier: _tier.data,
              count: v as number,
              range: EvonySiege.ranges[_tier.data as keyof typeof EvonySiege.ranges],
            }
            if ((v as number) > 0) {
              ar = (this._attackerSiegeTiers[i].range > ar) ? this._attackerSiegeTiers[i].range : ar ;
            }
          }
        }
        v = fv.get(`Defender.t${i}.siege`);
        if (v !== null && v !== undefined) {
          if(DEBUG) {console.log(`Defender.t${i}.siege is ${v}`)}
          const _tier = Tier.safeParse(`t${i}`);
          if (_tier.success) {
            this._defenderSiegeTiers[i].tier = _tier.data;
            this._defenderSiegeTiers[i].count = v as number;
            this._defenderSiegeTiers[i].range = EvonySiege.ranges[_tier.data as keyof typeof EvonySiege.ranges];
            if ((v as number) > 0) {
              dr = (this._defenderSiegeTiers[i].range > dr) ? this._defenderSiegeTiers[i].range : dr ;
            }
          }
        }
      }
      if(DEBUG) { console.log(`ar is ${ar}`)}
      if(DEBUG) { console.log(`dr is ${dr}`)}

      const arp = fv.get('arp');
      const drp = fv.get('drp');
      const arf = fv.get('arf');
      const drf = fv.get('drf');
      ar = (arf !== undefined) ? ((arf as number) > 0) ? ar + (arf as number) : ar : ar;
      dr = (drf !== undefined) ? ((drf as number) > 0) ? dr + (drf as number) : 
      dr : dr;
      if(DEBUG) { window.console.log(`arf is ${arf}; arp is ${arp} ar is ${ar}`)}
      if(DEBUG) { console.log(`drf is ${drf}; drp is ${drp} dr is ${dr}`)}
      this._battlefieldSize = ar + dr;
    }
  }

  public static override get styles(): CSSResultArray {
    const localstyle = css`
            span.H3 {
              color: var(--sl-color-text-accent);
              font-size: var(--sl-text-h3);
              font-weight: bold;
              margin-left: 1rem;
            }
            span.H4 {
              color: var(--sl-color-text-accent);
              font-size: var(--sl-text-h4);
              font-weight: bold;
              margin-left: 2rem;
            }
            
            span.bold {
              color: var(--sl-color-text-accent);
              font-weight: bold;
            }

            .divTable{ display: table; }
            .divTableRow { display: table-row; }
            .divTableHeading { 
              display: table-header-group; 
              
            }
            .divTableCell, .divTableHead { 
              display: table-cell; 
              width: 2%; 
            }
            .divTableHeadTop {display: table-cell; width: 6%}
            .divTableFoot { display: table-footer-group;}
            .divTableBody { display: table-row-group;}

            div.Buffs {
                width=100%;

                
            }
            div.Attacker div.Defender {
              padding-top: 1.5rem;
            }
            div.Values {
              width=100%;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: space-between;
              margin-left: 3rem;

              & div.Value {
                  display: flex;
                  flex-direction: column;
                  flex: 1 1 auto;
              }
          }
          div.Results {
            width=100%;
            margin-top: 2rem;
            border-top: solid 1px var(--sl-color-accent-low);
           
            

            div.CalcResult {
              
            }
          }
                
          div.AttackersTroops {
            border: 0.6px solid;
            border-color: var(--spectrum-green-600);
            background-color: var(--spectrum-green-400);
          }
          
          `
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];

  }

  renderBuffSelector() {
    return html`
      <div class="not-content Buffs">
      <div class="not-content Attacker">
        <span class="not-content H3">Attacker's Buffs</span>
        <div class="not-content">
          <span class="not-content H4">Percentage Based Buffs</span>
          <div class="not-content Values">
            <div class="not-content Value">
              <sp-field-label for="aap"  >Attack Buff </sp-field-label>
              <sp-number-field
                id="aap"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "style": "percent",
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("aap", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="adp"  >Defense Buff </sp-field-label>
              <sp-number-field
                id="adp"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "style": "percent",
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("adp", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="ahp"  >HP Buff </sp-field-label>
              <sp-number-field
                id="ahp"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "style": "percent",
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("ahp", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="arp"  >Range Buff </sp-field-label>
              <sp-number-field
                id="arp"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "style": "percent",
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("arp", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
          </div>
        </div>
        <div class="not-content">
          <span class="not-content H4">Flat Buffs</span>
          <div class="not-content Values">
            <div class="not-content Value">
              <sp-field-label for="aaf"  >Attack Buff </sp-field-label>
              <sp-number-field
                id="aaf"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("aaf", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="adf"  >Defense Buff </sp-field-label>
              <sp-number-field
                id="adf"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("adf", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="ahf"  >HP Buff </sp-field-label>
              <sp-number-field
                id="ahf"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("ahf", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="arf"  >Range Buff </sp-field-label>
              <sp-number-field
                id="arf"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("arf", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="not-content Defender">
        <span class="not-content H3">Defender's Buffs</span>
        <div class="not-content">
          <span class="not-content H4">Percentage Based Buffs</span>
          <div class="not-content Values">
            <div class="not-content Value">
              <sp-field-label for="dap"  >Attack Buff </sp-field-label>
              <sp-number-field
                id="dap"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "style": "percent",
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("dap", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="ddp"  >Defense Buff </sp-field-label>
              <sp-number-field
                id="ddp"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "style": "percent",
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("ddp", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="dhp"  >HP Buff </sp-field-label>
              <sp-number-field
                id="dhp"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "style": "percent",
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("dhp", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="drp"  >Range Buff </sp-field-label>
              <sp-number-field
                id="drp"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "style": "percent",
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("drp", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
          </div>
        </div>
        <div class="not-content">
          <span class="not-content H4">Flat Buffs</span>
          <div class="not-content Values">
            <div class="not-content Value">
              <sp-field-label for="daf"  >Attack Buff </sp-field-label>
              <sp-number-field
                id="daf"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("daf", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="ddf"  >Defense Buff </sp-field-label>
              <sp-number-field
                id="ddf"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("ddf", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="dhf"  >HP Buff </sp-field-label>
              <sp-number-field
                id="dhf"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("dhf", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
            <div class="not-content Value">
              <sp-field-label for="drf"  >Range Buff </sp-field-label>
              <sp-number-field
                id="drf"
                value="0"
                min="0"
                max="100"
                format-options='{
                    "signDisplay": "never",
                    "maximumFractionDigits": 0
                }'
                @change=${(e: CustomEvent) => { addValue("drf", (e.target as NumberField).value); this.requestUpdate(); }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  }

  rendersingleTierSelector(tier: string) {
    return html`
      <div class="not-content Values">
        <div class="not-content Value">
          <sp-field-label for="ground"  >Ground Troops </sp-field-label>
          <sp-number-field
            id="ground"
            disabled
            value="0"
            min="0"
            format-options='{
                "signDisplay": "never",
                "maximumFractionDigits": 0
            }'
            @change=${(e: CustomEvent) => { addValue(`${tier}.ground`, (e.target as NumberField).value); this.requestUpdate(); }}
          />
        </div>
        <div class="not-content Value">
          <sp-field-label for="ranged"  >Ranged Troops </sp-field-label>
          <sp-number-field
            id="ranged"
            disabled
            value="0"
            min="0"
            format-options='{
                "signDisplay": "never",
                "maximumFractionDigits": 0
            }'
            @change=${(e: CustomEvent) => { addValue(`${tier}.ranged`, (e.target as NumberField).value); this.requestUpdate(); }}
          />
        </div>
        <div class="not-content Value">
          <sp-field-label for="mounted"  >Mounted Troops </sp-field-label>
          <sp-number-field
            id="mounted"
            disabled
            value="0"
            min="0"
            format-options='{
                "signDisplay": "never",
                "maximumFractionDigits": 0
            }'
            @change=${(e: CustomEvent) => { addValue(`${tier}.mounted`, (e.target as NumberField).value); this.requestUpdate(); }}
          />
        </div>
        <div class="not-content Value">
          <sp-field-label for="siege"  >Siege Machines</sp-field-label>
          <sp-number-field
            id="siege"
            value="0"
            min="0"
            format-options='{
                "signDisplay": "never",
                "maximumFractionDigits": 0
            }'
            @change=${(e: CustomEvent) => { addValue(`${tier}.siege`, (e.target as NumberField).value); this.requestUpdate(); }}
          />
        </div>
      </div>
    `
  }

  renderLayersSelector(side: 'Attacker' | 'Defender') {
    let result = html``;
    for (let i = 15; i > 0; i--) {
      result = html`${result}
          <div class="not-content t${i}">
            <span class="not-content H4">Tier ${i}</span>
            ${this.rendersingleTierSelector(`${side}.t${i}`)}
          </div>
      `
    }
    return html`
      <div class="not-content ${side}">
        <span class="not-content H3">${side}'s Layers</span>
        ${result}
      </div>
    `
  }

  render() {
    let ttr = html``;
    for (let i = 15; i > 0; i--) {
      ttr = html`
        ${ttr}
        <div id="t${i}" class="not-content divTableHeadTop ">T${i}</div>
      `
    }
    ttr=html`
      <div class="not-content divTableHeading">
        ${ttr}
      </div>
    `
    let row2 = html``
    for (let i = 15; i > 0; i--) {
      row2 = html`
        ${row2}
        <div id="T${i}Siege"   class="not-content divTableHead">Siege</div>
        <div id="T${i}Archers" class="not-content divTableHead">Archers</div>
        <div id="T${i}Ground"  class="not-content divTableHead">Ground</div>
        <div id="T${i}Mounted" class="not-content divTableHead">Mounted</div>  
      `
    }
    ttr=html`
      ${ttr}
      <div class="not-content divTableHeading">
        ${row2}
      </div>
    `
    let ast = html``;
    for (let i = 15; i > 0; i--) {
      if(this._attackerSiegeTiers[i] !== null && this._attackerSiegeTiers[i] !== undefined) {
        const cst = this._attackerSiegeTiers[i];
        ast = html`${ast}
          <evony-siege tier=${cst.tier} count=${cst.count}></evony-siege>
        `
      } else {
        ast = html`${ast}
          <evony-siege id=t${i}Siege tier="t${i}" count=0 class="divTableCell"></evony-siege>
        `
      }
      ast = html`${ast}
        <div id=t${i}Archers class="not-content divTableCell">0</div>
      `
      ast = html`${ast}
        <div id=t${i}Ground class="not-content divTableCell">0</div>
      `
      ast = html`${ast}
        <div id=t${i}Mounted class="not-content divTableCell">0</div>
      `
    }
    return html`
      <div class="not-content BattleProperties">
        ${this.renderBuffSelector()}
        ${this.renderLayersSelector('Attacker')}
        ${this.renderLayersSelector('Defender')}
      </div>
      <div class="not-content Results">
        <div class="not-content metadata">
          <span class="not-content bold">Battlefield Size:</span> ${this._battlefieldSize}
        </div>
        <div class="not-content divTable troops">
            ${ttr}
            <div class="not-content divTableBody AttackersTroops">
              <div class="not-content divTableRow">
                ${ast}
              </div>
            </div>
        </div>
      </div>
    `
  }

}
if (!customElements.get('evony-battle')) {
  customElements.define('evony-battle', EvonyBattle)
}
