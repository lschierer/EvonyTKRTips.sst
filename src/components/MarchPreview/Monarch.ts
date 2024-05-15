import { css, html, type CSSResultArray, type PropertyValueMap, type TemplateResult, nothing } from "lit";
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';

import { withStores } from "@nanostores/lit";

import { ulid } from 'ulidx';

import {z} from 'astro:content';

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

import {addValue, formValues } from '../formValueStore';

import * as b from "@schemas/baseSchemas"

export const ViPLevels = z.enum([
  "Zero",
  "One", 
  "Two",
  "Three", 
  "Four", 
  "Five",
  "Six", 
  "Seven", 
  "Eight",
  "Nine", 
  "Ten", 
  "Eleven",
  "Twelve", 
  "Thirteen", 
  "Fourteen",
  "Fifteen", 
  "Sixteen", 
  "Seventeen",
  "Eighteen", 
  "Nineteen",
  "Twenty",
  "Twenty-one",
  "Twenty-two",
  "Twenty-three",
  "Twenty-four",
  "Twenty-five",
])
export type ViPLevelsType = z.infer<typeof ViPLevels>;

const ViPBuffs = z.array(
  z.record(
    ViPLevels, 
    z.record(
      b.Attribute,
      z.tuple([
        z.number(),
        b.UnitSchema,
        b.Condition.optional(),
      ])
    )
  )
);
export type ViPBuffsType = z.infer<typeof ViPBuffs>;

export class MonarchBuffs extends withStores(SpectrumElement, [formValues]) {
  
    readonly myKey: string = ulid();

    @state()
    private _ViPBuffs: ViPBuffsType;

    constructor() {
      super();
      
      //initialize _ViPBuffs
      this._ViPBuffs = [
        {
          [ViPLevels.enum.Zero as ViPLevelsType]: {
            [b.Attribute.enum.Death_to_Soul]: [0, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.March_Size_Capacity]: [0,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [0,b.UnitSchema],
          }
        },
        {
          [ViPLevels.enum.One as ViPLevelsType]: {
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [3, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.March_Size_Capacity]: [0,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [0,b.UnitSchema],
          }
        },
        {
          [ViPLevels.enum.Two as ViPLevelsType]: {
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [3, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.March_Size_Capacity]: [0,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [0,b.UnitSchema],
          }
        },
        {
          [ViPLevels.enum.Three as ViPLevelsType]: {
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [3, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.March_Size_Capacity]: [0,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [0,b.UnitSchema],
          }
        },
        {
          [ViPLevels.enum.Four as ViPLevelsType]: {
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [3, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.March_Size_Capacity]: [4000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [0,b.UnitSchema],
          }
        },
        {
          [ViPLevels.enum.Five as ViPLevelsType]: {
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [3, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.March_Size_Capacity]: [6000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [0,b.UnitSchema],
          }
        },
        {
          [ViPLevels.enum.Six as ViPLevelsType]: {
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [5, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.March_Size_Capacity]: [8000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Seven as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [10000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [5, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [30,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Eight as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [10000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [35,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [5, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Nine as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [10000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [40,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [8, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Ten as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [10000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [45,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [0,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [8, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Eleven as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [10000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [50,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [20,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [8, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Twelve as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [10000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [55,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [22,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [0,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [10, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Thirteen as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [10000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [60,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [24,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [10,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [10, b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [0,b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Fourteen as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [15000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [65,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [27,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [12,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [10,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [10, b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Fifteen as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [20000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [70,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [30,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [15,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [15,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [15,b.UnitSchema],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [15, b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Sixteen as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [30000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [75,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [33,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [18,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [20,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [20,b.UnitSchema],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [15, b.UnitSchema.enum.percentage],
          }
        }, 
        {
          [ViPLevels.enum.Seventeen as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [35000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [80,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [36,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [21,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [25,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [25,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.HP]: [20, b.Attribute.enum.Double_Items_Drop_Rate],
            [b.Attribute.enum.Attack]: [15,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [18, b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Eighteen as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [40000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [85,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [39,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [24,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [30,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [30,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.HP]: [25, b.Attribute.enum.Double_Items_Drop_Rate],
            [b.Attribute.enum.Attack]: [20,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [18, b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Nineteen as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [45000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [90,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [42,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [27,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [35,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [35,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.HP]: [30, b.Attribute.enum.Double_Items_Drop_Rate],
            [b.Attribute.enum.Attack]: [30,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [20, b.UnitSchema.enum.percentage],
          }
        },
        {
          [ViPLevels.enum.Twenty as ViPLevelsType]: {
            [b.Attribute.enum.March_Size_Capacity]: [50000,b.UnitSchema.enum.flat],
            [b.Attribute.enum.Marching_Speed]: [100,b.UnitSchema.enum.percentage,b.Condition.enum.Against_Monsters],
            [b.Attribute.enum.Healing_Speed]: [45,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Marching_Speed]: [30,b.UnitSchema.enum.percentage,],
            [b.Attribute.enum.Double_Items_Drop_Rate]: [40,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Defense]: [40,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.HP]: [40, b.Attribute.enum.Double_Items_Drop_Rate],
            [b.Attribute.enum.Attack]: [40,b.UnitSchema.enum.percentage],
            [b.Attribute.enum.Death_to_Soul as b.AttributeType]: [20, b.UnitSchema.enum.percentage],
          }
        },
      ]
       
    }

    connectedCallback(): void {
        super.connectedCallback();

        formValues.subscribe((fv) => {
            if(DEBUG) {console.log(`index formValues subscribe`) }
        })
    }
    
    public static override get styles(): CSSResultArray {
        const localstyle = css`
            
          `
        if (super.styles !== null && super.styles !== undefined) {
          return [super.styles, localstyle];
        } else return [localstyle];
    
      }
}
if (!customElements.get('monarch-buffs')) {
    customElements.define('monarch-buffs', MonarchBuffs)
}
