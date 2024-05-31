import { LitElement, html, type PropertyValueMap, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { provide } from '@lit/context';

import { type generalInvestment, generalsContext } from './contexts';

import { qualityColor, levels } from '@schemas/baseSchemas';

import {
  GeneralArray,
  type GeneralArrayType,
  type GeneralElementType,
} from '@schemas/generalsSchema';

@customElement('table-container')
export class TableContainer extends LitElement {
  @provide({ context: generalsContext })
  @property({ attribute: false })
  theGenerals: GeneralArrayType | undefined = undefined;

  @property({ type: String })
  public allGenerals: string | null = null;

  @property({ attribute: false })
  primaryInvestment: generalInvestment = {
    dragon: false,
    beast: false,
    ascending: levels.enum[0],
    speciality1: qualityColor.enum.Gold,
    speciality2: qualityColor.enum.Gold,
    speciality3: qualityColor.enum.Gold,
    speciality4: qualityColor.enum.Gold,
    extraBooks: [],
  };

  @property({ attribute: false })
  secondaryInvestment: generalInvestment = {
    dragon: false,
    beast: false,
    ascending: levels.enum[0],
    speciality1: qualityColor.enum.Gold,
    speciality2: qualityColor.enum.Gold,
    speciality3: qualityColor.enum.Gold,
    speciality4: qualityColor.enum.Gold,
    extraBooks: [],
  };

  accessor tableName: string = '';

  constructor() {
    super();
  }

  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    super.willUpdate(changedProperties);
    console.log(`tableContainer willUpdate`);
    if (changedProperties.has('allGenerals')) {
      console.log(`change to allGenerals detected`);
      if (this.allGenerals !== null) {
        const go = JSON.parse(this.allGenerals);
        const result = GeneralArray.safeParse(go);
        if (result.success) {
          console.log(`success`);
          this.theGenerals = result.data;
        } else {
          console.error(`${result.error}`);
        }
      } else {
        console.log(`allGenerals is null`);
      }
    }
  }

  public render() {
    return html`
      test2
      ${when(
        this.theGenerals !== undefined,
        () => {
          let t = html``;
          this.theGenerals!.forEach((g: GeneralElementType) => {
            t = html`${t} ${g.general.name}<br /> `;
          });
          return html`
            ${t}<br />
            ${this.theGenerals !== undefined
              ? html`<general-table />`
              : nothing}
          `;
        },
        () => nothing
      )}
    `;
  }
}
