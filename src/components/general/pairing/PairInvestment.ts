import { nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { z } from 'zod';

import {
  SizedMixin,
  SpectrumElement,
  type CSSResultArray,
  type CSSResult,
  html,
  css,
  unsafeCSS,
  type PropertyValues,
} from '@spectrum-web-components/base';

import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/radio/sp-radio.js';
import '@spectrum-web-components/radio/sp-radio-group.js';
import '@spectrum-web-components/slider/sp-slider.js';

import SpectrumTypography from '@spectrum-web-components/styles/typography.css?inline';
import SpectrumScaleMedium from '@spectrum-web-components/styles/scale-medium.css?inline';
import SpectrumTokens from '@spectrum-css/page/dist/index.css?inline';
import '@spectrum-css/page/dist/index.css';


import { Picker } from '@spectrum-web-components/picker';
import {
  RadioGroup,
} from '@spectrum-web-components/radio';
import { Slider } from '@spectrum-web-components/slider';

import { AscendingLevels, type BuffParamsType, qualityColor, type qualityColorType } from '@schemas/baseSchemas.ts';

import { animal, type animalType } from '@schemas/beastSchemas';

const DEBUG = true;

@customElement('pair-investment')
export class PairInvestment extends SizedMixin(SpectrumElement, {
  noDefaultSize: true,
}) {

  @property({
    type: Object,
    reflect: true,
  })
  public PrimaryInvestmentLevel: BuffParamsType = {
    special1: qualityColor.enum.Disabled,
    special2: qualityColor.enum.Disabled,
    special3: qualityColor.enum.Disabled,
    special4: qualityColor.enum.Disabled,
    special5: qualityColor.enum.Disabled,
    stars: AscendingLevels.enum['0'],
    dragon: false,
    beast: false,
  };

  @property({
    type: Object,
    reflect: true,
  })
  public SecondaryInvestmentLevel: BuffParamsType = {
    special1: qualityColor.enum.Disabled,
    special2: qualityColor.enum.Disabled,
    special3: qualityColor.enum.Disabled,
    special4: qualityColor.enum.Disabled,
    special5: qualityColor.enum.Disabled,
    stars: AscendingLevels.enum['0'],
    dragon: false,
    beast: false,
  };

  private MutationObserver: MutationObserver;

  handleMutation(): void {
    return;
  }

  constructor() {
    super();

    this.MutationObserver = new MutationObserver(() => {
      this.handleMutation();
    });
  }

  protected override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('PrimaryInvestmentLevel') || changedProperties.has('SecondaryInvestmentLevel')) {
      this.dispatchEvent(new CustomEvent('InvestmentLevelUpdate', { bubbles: true, composed: true }));
    }
  }

  private ascendingHandler(e: CustomEvent) {
    let num = (e.target as Slider).value;
    if (num > 0) {
      num += 5;
    }
    const v = AscendingLevels.safeParse(`${num}`);
    if (v.success) {
      if (DEBUG) {
        console.log(`new ascending level is ${v.data}`);
      }
      this.PrimaryInvestmentLevel.stars = v.data;
    } else {
      if (DEBUG) {
        console.log(`invalid value ${(e.target as Slider).value}`);
      }
    }
  }

  private animalHandler(e: CustomEvent) {
    const na = (e.target as RadioGroup).selected;
    const v = animal.safeParse(na);
    if (v.success) {
      if (!(e.target as RadioGroup).name.localeCompare('PrimaryBeastSelector')) {
        if (!v.data.localeCompare(animal.enum.dragon)) {
          this.PrimaryInvestmentLevel.dragon = true;
          this.PrimaryInvestmentLevel.beast = false;
        } else if (!v.data.localeCompare(animal.enum.beast)) {
          this.PrimaryInvestmentLevel.dragon = false;
          this.PrimaryInvestmentLevel.beast = true;
        } else {
          this.PrimaryInvestmentLevel.dragon = false;
          this.PrimaryInvestmentLevel.beast = false;
        }
      }
    }
  }

  private disablePrimarySpeciality = (index: number): boolean => {
    const v = z.number().positive().gte(4).lte(5).safeParse(index);
    if (!v.success) {
      console.log(`disablePrimarySpeciality: ${index}, skipping`);
    } else {
      //then I can trust index, and it is easier to use than v.data;
      if (qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special1)) {
        return true;
      } else if (qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special2)) {
        return true;
      } else if (qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special3)) {
        return true;
      } else if (index > 4) {
        if (qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special4)) {
          return true;
        }
      } else {
        return false;
      }
    }
    return false;
  };

  private disableSecondarySpeciality = (index: number): boolean => {
    const v = z.number().positive().gte(4).lte(5).safeParse(index);
    if (!v.success) {
      console.log(`disableSecondarySpeciality: ${index}, skipping`);
    } else {
      //then I can trust index, and it is easier to use than v.data;
      if (qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special1)) {
        return true;
      } else if (qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special2)) {
        return true;
      } else if (qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special3)) {
        return true;
      } else if (index > 4) {
        if (qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special4)) {
          return true;
        }
      } else {
        return false;
      }
    }
    return false;
  };

  private primarySpecialityLevel = (index: number): qualityColorType => {
    const v = z.number().positive().gte(1).lte(5).safeParse(index);
    if (!v.success) {
      console.log(`invalid value for primarySpecialityLevel: ${index}`);
      console.log(v.error.message);
    } else {
      const testable = v.data;
      if (testable === 1) {
        if (DEBUG) {
          console.log(`primarySpecialityLevel returning for #1`);
        }
        return this.PrimaryInvestmentLevel.special1;
      } else if (testable === 2) {
        if (DEBUG) {
          console.log(`primarySpecialityLevel returning for #2`);
        }
        return this.PrimaryInvestmentLevel.special2;
      } else if (testable === 3) {
        if (DEBUG) {
          console.log(`primarySpecialityLevel returning for #3`);
        }
        return this.PrimaryInvestmentLevel.special3;
      } else if (testable === 4) {
        if (DEBUG) {
          console.log(`primarySpecialityLevel returning for #4`);
        }
        if (
          !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special1) &&
          !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special2) &&
          !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special3)
        ) {
          if (!qualityColor.enum.Disabled.localeCompare(this.PrimaryInvestmentLevel.special4)) {
            this.PrimaryInvestmentLevel.special4 = qualityColor.enum.Green;
            return qualityColor.enum.Green;
          }
        }
        return this.PrimaryInvestmentLevel.special4;
      } else if (testable === 5) {
        if (DEBUG) {
          console.log(`primarySpecialityLevel returning for #5`);
        }
        return this.PrimaryInvestmentLevel.special5;
      }
    }
    return qualityColor.enum.Disabled;
  };

  private secondarySpecialityLevel = (index: number): qualityColorType => {
    const v = z.number().positive().gte(1).lte(5).safeParse(index);
    if (!v.success) {
      console.log(`invalid value for secondarySpecialityLevel: ${index}`);
      console.log(v.error.message);
    } else {
      const testable = v.data;
      if (testable === 1) {
        if (DEBUG) {
          console.log(`secondarySpecialityLevel returning for #1`);
        }
        return this.SecondaryInvestmentLevel.special1;
      } else if (testable === 2) {
        if (DEBUG) {
          console.log(`secondarySpecialityLevel returning for #2`);
        }
        return this.SecondaryInvestmentLevel.special2;
      } else if (testable === 3) {
        if (DEBUG) {
          console.log(`secondarySpecialityLevel returning for #3`);
        }
        return this.SecondaryInvestmentLevel.special3;
      } else if (testable === 4) {
        if (DEBUG) {
          console.log(`secondarySpecialityLevel returning for #4`);
        }
        if (
          !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special1) &&
          !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special2) &&
          !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special3)
        ) {
          if (!qualityColor.enum.Disabled.localeCompare(this.SecondaryInvestmentLevel.special4)) {
            this.SecondaryInvestmentLevel.special4 = qualityColor.enum.Green;
            return qualityColor.enum.Green;
          }
        }
        return this.SecondaryInvestmentLevel.special4;
      } else if (testable === 5) {
        if (DEBUG) {
          console.log(`secondarySpecialityLevel returning for #5`);
        }
        return this.SecondaryInvestmentLevel.special5;
      }
    }
    return qualityColor.enum.Disabled;
  };

  private SpecialityHandler(e: CustomEvent) {
    const picker = (e.target as Picker);
    const v = qualityColor.safeParse(picker.value);
    if (!v.success) {
      if (DEBUG) {
        console.log(`error parsing quality color ${picker.value} for ${picker.id}`);
        console.log(v.error.message);
      }
    } else {
      const value = v.data;
      if (picker.id.includes('Primary')) {
        if (picker.id.includes('1')) {
          this.PrimaryInvestmentLevel.special1 = value;
          if (qualityColor.enum.Gold.localeCompare(value)) {
            this.PrimaryInvestmentLevel.special4 = qualityColor.enum.Disabled;
            this.PrimaryInvestmentLevel.special5 = qualityColor.enum.Disabled;
          } else if (
            !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special2) &&
            !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special3)
          ) {
            this.PrimaryInvestmentLevel.special4 = qualityColor.enum.Green;
          }
        } else if (picker.id.includes('2')) {
          this.PrimaryInvestmentLevel.special2 = value;
          if (qualityColor.enum.Gold.localeCompare(value)) {
            this.PrimaryInvestmentLevel.special4 = qualityColor.enum.Disabled;
            this.PrimaryInvestmentLevel.special5 = qualityColor.enum.Disabled;
          } else if (
            !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special1) &&
            !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special3)
          ) {
            this.PrimaryInvestmentLevel.special4 = qualityColor.enum.Green;
          }
        } else if (picker.id.includes('3')) {
          this.PrimaryInvestmentLevel.special3 = value;
          if (qualityColor.enum.Gold.localeCompare(value)) {
            this.PrimaryInvestmentLevel.special4 = qualityColor.enum.Disabled;
            this.PrimaryInvestmentLevel.special5 = qualityColor.enum.Disabled;
          } else if (
            !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special2) &&
            !qualityColor.enum.Gold.localeCompare(this.PrimaryInvestmentLevel.special1)
          ) {
            this.PrimaryInvestmentLevel.special4 = qualityColor.enum.Green;
          }
        } else if (picker.id.includes('4')) {
          this.PrimaryInvestmentLevel.special4 = value;
          if (qualityColor.enum.Gold.localeCompare(value)) {
            this.PrimaryInvestmentLevel.special5 = qualityColor.enum.Disabled;
          }
        } else if (picker.id.includes('5')) {
          this.PrimaryInvestmentLevel.special5 = value;
        }
        this.requestUpdate('PrimaryInvestmentLevel');
      } else if (picker.id.includes('Secondary')) {
        if (picker.id.includes('1')) {
          this.SecondaryInvestmentLevel.special1 = value;
          if (qualityColor.enum.Gold.localeCompare(value)) {
            this.SecondaryInvestmentLevel.special4 = qualityColor.enum.Disabled;
            this.SecondaryInvestmentLevel.special5 = qualityColor.enum.Disabled;
          } else if (
            !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special2) &&
            !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special3)
          ) {
            this.SecondaryInvestmentLevel.special4 = qualityColor.enum.Green;
          }
        } else if (picker.id.includes('2')) {
          this.SecondaryInvestmentLevel.special2 = value;
          if (qualityColor.enum.Gold.localeCompare(value)) {
            this.SecondaryInvestmentLevel.special4 = qualityColor.enum.Disabled;
            this.SecondaryInvestmentLevel.special5 = qualityColor.enum.Disabled;
          } else if (
            !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special1) &&
            !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special3)
          ) {
            this.SecondaryInvestmentLevel.special4 = qualityColor.enum.Green;
          }
        } else if (picker.id.includes('3')) {
          this.SecondaryInvestmentLevel.special3 = value;
          if (qualityColor.enum.Gold.localeCompare(value)) {
            this.SecondaryInvestmentLevel.special4 = qualityColor.enum.Disabled;
            this.SecondaryInvestmentLevel.special5 = qualityColor.enum.Disabled;
          } else if (
            !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special2) &&
            !qualityColor.enum.Gold.localeCompare(this.SecondaryInvestmentLevel.special1)
          ) {
            this.SecondaryInvestmentLevel.special4 = qualityColor.enum.Green;
          }
        } else if (picker.id.includes('4')) {
          this.SecondaryInvestmentLevel.special4 = value;
          if (qualityColor.enum.Gold.localeCompare(value)) {
            this.SecondaryInvestmentLevel.special5 = qualityColor.enum.Disabled;
          }
        } else if (picker.id.includes('5')) {
          this.SecondaryInvestmentLevel.special5 = value;
        }
        this.requestUpdate('SecondaryInvestmentLevel');
      }
    }
  }

  public static override get styles(): CSSResultArray {
    const SpectrumTypographyCSS = unsafeCSS(SpectrumTypography);
    const SpectrumScaleMediumCSS = unsafeCSS(SpectrumScaleMedium);
    const SpectrumTokensCSS = unsafeCSS(SpectrumTokens);
    const localStyle = css`
      
      .GeneralOptions {
        border-top: var(--spectrum-border-width-100) solid var(--sl-color-gray-5);
        border-right: var(--spectrum-border-width-100) solid var(--sl-color-gray-5);
        border-left: var(--spectrum-border-width-100) solid var(--sl-color-gray-5);
        padding-left: var(--spectrum-spacing-75);
        padding-right: var(--spectrum-spacing-75);
        padding-bottom: var(--spectrum-spacing-75);
      }
      
      .row1, .row2 {
        width: 100%;
        display: grid;
        grid-auto-rows: auto;
        grid-template-columns: repeat(4, 1fr);
        column-gap: 1rem;
        align-content: start;
        justify-content: space-around;
      }
      
      .BeastSelector {
        grid-column-end: span 2;
      }
      
      sp-picker {
        width: 100%;
      }
      
      .hidden {
        display: block;
      }
    `;

    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [...super.styles, SpectrumTypographyCSS, SpectrumScaleMediumCSS, SpectrumTokensCSS, localStyle];
    } else {
      return [SpectrumTypographyCSS, SpectrumScaleMediumCSS, SpectrumTokensCSS, localStyle];
    }
  }

  protected override render() {

    let primarySpecialityPickers = html``;
    for (let index = 1; index < 5; index++) {
      primarySpecialityPickers = html`${primarySpecialityPickers}
      <div class="Speciality">
        <sp-field-label for=${`PrimarySpeciality${index}`}>${`Speciality ${index}`}</sp-field-label>
        <sp-picker
          id=${`PrimarySpeciality${index}`}
          size="m"
          value=${this.primarySpecialityLevel(index)}
          @change=${this.SpecialityHandler}
          ?disabled=${this.disablePrimarySpeciality(index)}
        >
          ${qualityColor.options.map((ql) => {
            return html`
              <sp-menu-item value=${ql}>${ql}</sp-menu-item>
            `;
          })}
        </sp-picker>
      </div>
      `;
    }

    let secondarySpecialityPickers = html``;
    for (let index = 1; index < 5; index++) {
      secondarySpecialityPickers = html`${secondarySpecialityPickers}
      <div class="Speciality">
        <sp-field-label for=${`SecondarySpeciality${index}`}>${`Speciality ${index}`}</sp-field-label>
        <sp-picker
          id=${`SecondarySpeciality${index}`}
          size="m"
          value=${this.secondarySpecialityLevel(index)}
          @change=${this.SpecialityHandler}
          ?disabled=${this.disableSecondarySpeciality(index)}
        >
          ${qualityColor.options.map((ql) => {
            return html`
              <sp-menu-item value=${ql}>${ql}</sp-menu-item>
            `;
          })}
        </sp-picker>
      </div>
      `;
    }

    return html`
      <div class='PairInvestment'>
        
        <div class='GeneralOptions' id="Primary General">
          <sp-field-label for="PrimaryInvestmentLevelGroup" class="spectrum-Heading spectrum-Heading--sizeS">Primary
            General
          </sp-field-label>
          <sp-field-group id="PrimaryInvestmentLevelGroup">
            
            <div class="row1">
              <sp-slider
                label="Ascending Level"
                max="5"
                min="0"
                step="1"
                value=${this.PrimaryInvestmentLevel.stars}
                @change=${this.ascendingHandler}
              ></sp-slider>
              <div class="BeastSelector non-content">
                <sp-field-label for="PrimaryBeastSelector">Primary Beast/Dragon:</sp-field-label>
                <sp-radio-group
                  id="PrimaryBeastSelector"
                  horizontal
                  name="PrimaryBeastSelector"
                  selected=${this.PrimaryInvestmentLevel.dragon ? this.PrimaryInvestmentLevel.dragon : this.PrimaryInvestmentLevel.beast ? this.PrimaryInvestmentLevel.beast : animal.enum.none}
                  @change=${this.animalHandler}
                >
                  ${animal.options.map((ta) => {
                    return html`
                      <sp-radio value=${ta}>${ta}</sp-radio>
                    `;
                  })}
                </sp-radio-group>
              </div>
            </div>
            
            <div class="row2">
              ${primarySpecialityPickers}
            </div>
          
          </sp-field-group>
        </div>
        
        <div class='GeneralOptions' id="Secondary General">
        <sp-field-label for="SecondaryInvestmentLevelGroup" class="spectrum-Heading spectrum-Heading--sizeS">Secondary
          General
        </sp-field-label>
        <sp-field-group id="SecondaryInvestmentLevelGroup">
          
            <div class="row1">
              <div class="BeastSelector non-content">
                <sp-field-label for="SecondaryBeastSelector">Secondary Beast/Dragon*:</sp-field-label>
                <sp-radio-group
                  id="SecondaryBeastSelector"
                  horizontal
                  name="SecondaryBeastSelector"
                  selected=${this.SecondaryInvestmentLevel.dragon ? this.SecondaryInvestmentLevel.dragon : this.SecondaryInvestmentLevel.beast ? this.SecondaryInvestmentLevel.beast : animal.enum.none}
                  @change=${this.animalHandler}
                >
                  ${animal.options.map((ta) => {
                    return html`
                      <sp-radio value=${ta}>${ta}</sp-radio>
                    `;
                  })}
                </sp-radio-group>
              </div>
            </div>
            <div class="row2">
              ${secondarySpecialityPickers}
            </div>
          
          <sp-help-text slot="help-text">*Note that a Secondary General's dragon or beast is used only to activate
            buffs, not to provide them itself.
          </sp-help-text>
        </sp-field-group>
        </div>
      </div>
    `;
  }
}