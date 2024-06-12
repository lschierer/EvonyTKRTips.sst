import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type PropertyValues } from 'lit';

import { delay } from 'nanodelay';

import {
  SizedMixin,
  type CSSResultArray,
  html,
  css,
  unsafeCSS,
  type TemplateResult,
} from '@spectrum-web-components/base';

import SpectrumTokens from '@spectrum-css/tokens/dist/index.css?inline';
import SpectrumTypography from '@spectrum-css/typography/dist/index.css?inline';
import SpectrumIcon from '@spectrum-css/icon/dist/index.css?inline';
import SpectrumTable from '@spectrum-css/table/dist/index.css?inline';
import 'iconify-icon';

import {
  AscendingLevels,
  type BuffParamsType,
  qualityColor,
  type BuffType,
  UnitSchema,
} from '@schemas/baseSchemas';

import {
  Display,
  GeneralClass,
  type GeneralClassType,
  generalUseCase,
} from '@schemas/generalsSchema';

import { ExtendedGeneralStatus } from '@schemas/ExtendedGeneral';

import { BaseGeneral } from './BaseGeneral';

const DEBUG = false;

@customElement('detail-view')
export class DetailView extends SizedMixin(BaseGeneral, {
  noDefaultSize: true,
}) {
  @state()
  private EvAnsRanking = 0;

  constructor() {
    super();
  }

  static InvestmentLevel: BuffParamsType = {
    special1: qualityColor.enum.Gold,
    special2: qualityColor.enum.Gold,
    special3: qualityColor.enum.Gold,
    special4: qualityColor.enum.Gold,
    special5: qualityColor.enum.Disabled,
    stars: AscendingLevels.enum['5red'],
    dragon: true,
    beast: true,
  };

  protected async willUpdate (_changedProperties: PropertyValues): Promise<void> {
    if(DEBUG) {
      console.log(`DetailView willUpdate`)
    }
    await super.willUpdate(_changedProperties);
    if (_changedProperties.has('general')) {
      if (DEBUG) {
        console.log(`DetailView willUpdate general`);
      }
      let InComplete = true;
      do {
        if (!this.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
          InComplete = false;
          const result = this.GeneralBuffs(
            Display.enum.summary,
            DetailView.InvestmentLevel
          );
          if (result) {
            this.EvAnsRanking =
              this.computedBuffs.get(
                BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
              )?.EvAnsRanking ?? -7;
          }
        } else {
          await delay(10);
        }
      } while (InComplete);
    }
  }

  public static override get styles(): CSSResultArray {
    const SpectrumIconCSS = unsafeCSS(SpectrumIcon);
    const SpectrumTableCSS = unsafeCSS(SpectrumTable);
    const localStyle = css`
      div.GeneralDetails {
        display: flex;
        flex-direction: column;

        & ul {
          margin: 0;
          padding-top: 0;
          padding-left: 1rem;

          & li {
            padding-top: 0;
            padding-bottom: 0;
            margin-top: 0;
            margin-bottom: 0;
            margin-left: 0.5rem;
          }
        }

        :is(div) {
          align-content: center;
          justify-content: center;
          margin: 0.1px;
        }

        & .spectrum-Heading {
          color: var(--sl-color-text-accent);
        }

        & .center {
          align-self: center;
        }

        & .label {
          color: var(--sl-color-text-accent);
        }

        & .Stars {
          display: flex;
          flex-direction: row;
          justify-content: center;
        }

        & .IntrinsicAttributes {
          columns: 4;
          white-space: pre-line;
        }

        & .Books {
          margin: 1px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          column-gap: 2px;
          align-items: start;

          & [class^='Book'] {
            grid-column-end: span 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        & .Specialities {
          margin: 1px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          column-gap: 2px;
          align-items: start;

          & [class^='Speciality'] {
            grid-column-end: span 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          & .Green {
            background-color: var(--spectrum-celery-400);
          }

          & .Blue {
            background-color: var(--spectrum-blue-400);
          }

          & .Purple {
            background-color: var(--spectrum-purple-400);
          }

          & .Orange {
            background-color: var(--spectrum-orange-400);
          }

          & .Gold {
            background-color: var(--spectrum-yellow-400);
          }
        }

        & .AscendingAttributes {
          margin: 1px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          column-gap: 2px;
          align-items: start;

          & [class^='AscendingAttribute'] {
            grid-column-end: span 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
      }
    `;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [...super.styles, SpectrumIconCSS, SpectrumTableCSS, localStyle];
    } else {
      return [SpectrumIconCSS, SpectrumTableCSS, localStyle];
    }
  }

  private renderStars() {
    let starsHtml = html``;
    if(this.general !== null && this.general.stars !== null && this.general.stars !== undefined) {
      for (let i = 1; i <= 5; i++) {
        let starColor = 'var(--spectrum-yellow-400)';
        if (!AscendingLevels.enum['5red'].localeCompare((this.general.stars))) {
          starColor = 'var(--spectrum-red-900)';
        } else if (!AscendingLevels.enum['4red'].localeCompare((this.general.stars)) && i <= 4) {
          starColor = 'var(--spectrum-red-900)';
        } else if (!AscendingLevels.enum['3red'].localeCompare((this.general.stars)) && i <= 3) {
          starColor = 'var(--spectrum-red-900)';
        } else if (!AscendingLevels.enum['2red'].localeCompare((this.general.stars)) && i <= 2) {
          starColor = 'var(--spectrum-red-900)';
        } else if (!AscendingLevels.enum['1red'].localeCompare((this.general.stars)) && i <= 1) {
          starColor = 'var(--spectrum-red-900)';
        } else if (!AscendingLevels.enum['5purple'].localeCompare((this.general.stars))) {
          starColor = 'var(--spectrum-purple-900)';
        } else if (!AscendingLevels.enum['4purple'].localeCompare((this.general.stars)) && i <= 4) {
          starColor = 'var(--spectrum-purple-900)';
        } else if (!AscendingLevels.enum['3purple'].localeCompare((this.general.stars)) && i <= 3) {
          starColor = 'var(--spectrum-purple-900)';
        } else if (!AscendingLevels.enum['2purple'].localeCompare((this.general.stars)) && i <= 2) {
          starColor = 'var(--spectrum-purple-900)';
        } else if (!AscendingLevels.enum['1purple'].localeCompare((this.general.stars)) && i <= 1) {
          starColor = 'var(--spectrum-purple-900)';
        }
        starsHtml = html`${starsHtml}
      <iconify-icon
        style="color: ${starColor}"
        icon="mdi:star"
      ></iconify-icon>`;
      }
    }
    return starsHtml;
  }

  private renderBasicStats() {
    let debugHTML = html``;
    if (DEBUG) {
      debugHTML = html`
        Summary EvAns:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.EvAnsRanking}<br />
        Summary Attack:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.AttackRanking}<br />
        Summary Tough:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.ToughnessRanking}<br />
      `;
      this.GeneralBuffs(Display.enum.primary, DetailView.InvestmentLevel);
      debugHTML = html`
        ${debugHTML}<br />
        Primary EvAns:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.EvAnsRanking}<br />
        Primary Attack:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.AttackRanking}<br />
        Primary Tough:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.ToughnessRanking}<br />
      `;
      this.GeneralBuffs(Display.enum.secondary, DetailView.InvestmentLevel);
      debugHTML = html`
        ${debugHTML}<br />
        Assistant EvAns:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.EvAnsRanking}<br />
        Assistant Attack:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.AttackRanking}<br />
        Assistant Tough:
        ${this.computedBuffs.get(
          BaseGeneral.InvestmentOptions2Key(DetailView.InvestmentLevel)
        )?.ToughnessRanking}<br />
      `;
    }
    return html`
      ${DEBUG ? html`${debugHTML}` : html``}
      <span class="label spectrum-Heading spectrum-Heading--sizeM"
        >Basic Statistics</span
      ><br />
      <div class="IntrinsicAttributes">
        <div class="Leadership">
          <span class="label spectrum-Heading spectrum-Heading--sizeS"
            ><strong>Leadership:</strong></span
          ><br />
          <span class="spectrum-Body spectrum-Body--sizeS"
            ><strong>Base Intrinsic Ability:</strong> ${this.general
              ?.leadership ?? 0}</span
          ><br />
          <span class="spectrum-Body spectrum-Body--sizeS"
            ><strong>Growth per Level:</strong> ${this.general
              ?.leadership_increment ?? 0}</span
          ><br />
          <span class="spectrum-Body spectrum-Body--sizeS"
            ><strong>Total Before Ascending:</strong> ${this.general
              ? Math.floor(
                  this.general.leadership +
                    this.general.leadership_increment * 45
                )
              : 0}</span
          ><br />
          <span class="spectrum-Body spectrum-Body--sizeS"
            ><strong>Total with Ascending:</strong> ${this.general
              ? Math.floor(
                  50 +
                    this.general.leadership +
                    this.general.leadership_increment * 45
                )
              : 0}</span
          ><br />
        </div>
        <div class="Attack">
          <span class="label spectrum-Heading spectrum-Heading--sizeS"
            ><strong>Attack:</strong></span
          ><br />
          <span class="spectrum-Body spectrum-Body--sizeS"
            ><strong>Base Intrinsic Ability:</strong> ${this.general?.attack ??
            0}</span
          ><br />
          <span class="spectrum-Body spectrum-Body--sizeS"
            ><strong>Growth per Level:</strong> ${this.general
              ?.attack_increment ?? 0}</span
          ><br />
          <span class="spectrum-Body spectrum-Body--sizeS"
            ><strong>Total Before Ascending:</strong> ${this.general
              ? Math.floor(
                  this.general.attack + this.general.attack_increment * 45
                )
              : 0}</span
          ><br />
          <span class="spectrum-Body spectrum-Body--sizeS"
            ><strong>Total with Ascending:</strong> ${this.general
              ? Math.floor(
                  50 + this.general.attack + this.general.attack_increment * 45
                )
              : 0}</span
          ><br />
          <div class="Defense">
            <span class="label spectrum-Heading spectrum-Heading--sizeS"
              ><strong>Defense:</strong></span
            ><br />
            <span class="spectrum-Body spectrum-Body--sizeS"
              ><strong>Base Intrinsic Ability:</strong> ${this.general
                ?.defense ?? 0}</span
            ><br />
            <span class="spectrum-Body spectrum-Body--sizeS"
              ><strong>Growth per Level:</strong> ${this.general
                ?.defense_increment ?? 0}</span
            ><br />
            <span class="spectrum-Body spectrum-Body--sizeS"
              ><strong>Total Before Ascending:</strong> ${this.general
                ? Math.floor(
                    this.general.defense + this.general.defense_increment * 45
                  )
                : 0}</span
            ><br />
            <span class="spectrum-Body spectrum-Body--sizeS"
              ><strong>Total with Ascending:</strong> ${this.general
                ? Math.floor(
                    50 +
                      this.general.defense +
                      this.general.defense_increment * 45
                  )
                : 0}</span
            ><br />
          </div>
          <div class="Politics">
            <span class="label spectrum-Heading spectrum-Heading--sizeS"
              ><strong>Politics:</strong></span
            ><br />
            <span class="spectrum-Body spectrum-Body--sizeS"
              ><strong>Base Intrinsic Ability:</strong> ${this.general
                ?.politics ?? 0}</span
            ><br />
            <span class="spectrum-Body spectrum-Body--sizeS"
              ><strong>Growth per Level:</strong> ${this.general
                ?.politics_increment ?? 0}</span
            ><br />
            <span class="spectrum-Body spectrum-Body--sizeS"
              ><strong>Total Before Ascending:</strong> ${this.general
                ? Math.floor(
                    this.general.politics + this.general.politics_increment * 45
                  )
                : 0}</span
            ><br />
            <span class="spectrum-Body spectrum-Body--sizeS"
              ><strong>Total with Ascending:</strong> ${this.general
                ? Math.floor(
                    50 +
                      this.general.politics +
                      this.general.politics_increment * 45
                  )
                : 0}</span
            ><br />
          </div>
        </div>
      </div>
    `;
  }

  private renderBooks() {
    if (
      !Array.isArray(this.general?.books) ||
      this.general.books.length === 0
    ) {
      if (DEBUG) {
        console.log(`renderBooks called with no books`);
      }
      return html``;
    } else {
      if (DEBUG) {
        console.log(
          `renderBooks for ${this.general?.name}; ${this.general.books.length} Books`
        );
      }

      const a1 = this.general.books.map((gb, index) => {
        const a3 = gb.buff.map((b: BuffType) => {
          return html`
            <li>
              ${b.condition ? b.condition.join(' ').replaceAll(/_/g, ' ') : ''}
              ${b.class !== 'all' ? b.class : 'all troops '}
              ${b.attribute ? b.attribute.replaceAll(/_/g, ' ') : ''}
              ${b.value!.number}${!b.value!.unit.localeCompare(
                UnitSchema.enum.percentage
              )
                ? '%'
                : ''}
            </li>
          `;
        });
        return html`
          <div class=${`Book${index}  non-content`}>
            <div class=${`BookName${index} non-content`}>
              <span class="label spectrum-Heading spectrum-Heading--sizeXXS">
                ${gb.name}
              </span>
            </div>
            <div class=${`BookContents${index}non-content`}>
              <ul>
                ${a3}
              </ul>
            </div>
          </div>
        `;
      });
      return html` <div class="Books non-content">${a1}</div> `;
    }
  }

  private renderSpecialities() {
    if (
      !Array.isArray(this.general?.specialities) ||
      this.general.specialities.length === 0
    ) {
      if (DEBUG) {
        console.log(`renderSpecialities called with no specialities`);
      }
      return html``;
    } else {
      if (DEBUG) {
        console.log(
          `renderSpecialities for ${this.general?.name}; ${this.general.specialities.length} Specialities`
        );
      }

      const a1 = this.general.specialities.map((gs, index) => {
        return html`
          <div class=${`SpecialityName${index} non-content`}>
            <span class="label spectrum-Heading spectrum-Heading--sizeXXS">
              ${gs.name}
            </span>
          </div>
        `;
      });
      const a2 = this.general.specialities.map((gs, index) => {
        const a3 = gs.attribute.map((s) => {
          const a4 = s.buff.map((b: BuffType) => {
            return html`
              <li>
                ${b.condition
                  ? b.condition.join(' ').replaceAll(/_/g, ' ')
                  : ''}
                ${b.class !== 'all' ? b.class : 'all troops '}
                ${b.attribute ? b.attribute.replaceAll(/_/g, ' ') : ''}
                ${b.value!.number}${!b.value!.unit.localeCompare(
                  UnitSchema.enum.percentage
                )
                  ? '%'
                  : ''}
              </li>
            `;
          });
          return html`
            <div class=${`non-content ${s.level}`}>
              <span class="label spectrum-Body spectrum-Body--sizeM">
                ${s.level} Level:
              </span>
              <ul>
                ${a4}
              </ul>
            </div>
          `;
        });
        return html`
          <div class=${`Speciality${index}  non-content`}>${a3}</div>
        `;
      });
      if (this.general.specialities.length === 4) {
        return html` <div class="Specialities non-content">${a1} ${a2}</div> `;
      } else {
        return html`
          <div class="Specialities non-content">
            ${a1}
            <div class="SpecialityName4 non-content">&nbsp;</div>
            ${a2}
            <div class="Speciality4 non-content">&nbsp;</div>
          </div>
        `;
      }
    }
  }

  private renderAscending() {
    if (
      this.general === null ||
      this.general === undefined ||
      (this.general &&
        (!Array.isArray(this.general.ascending) ||
          this.general.ascending.length === 0))
    ) {
      if (DEBUG) {
        console.log(`renderAscending called with no ascending attributes`);
        console.log(JSON.stringify(this.general));
      }
      return html``;
    } else {
      if (
        this.general.ascending === null ||
        this.general.ascending === undefined
      ) {
        return html``;
      } else {
        if (DEBUG) {
          console.log(
            `renderAscending for ${this.general?.name}; ${this.general.ascending?.length ?? 0} Ascending Attributes`
          );
        }

        const a1 = this.general.ascending.map((gaa, index) => {
          return html`
            <div class=${`AscendingAttributeName${index} non-content`}>
              <span class="label spectrum-Heading spectrum-Heading--sizeXXS">
                ${index + 1} Star
              </span>
            </div>
          `;
        });
        const a2 = this.general.ascending.map((gaa, index) => {
          const a4 = gaa.buff.map((b: BuffType) => {
            return html`
              <li>
                ${b.condition
                  ? b.condition.join(' ').replaceAll(/_/g, ' ')
                  : ''}
                ${b.class !== 'all' ? b.class : 'all troops '}
                ${b.attribute ? b.attribute.replaceAll(/_/g, ' ') : ''}
                ${b.value!.number}${!b.value!.unit.localeCompare(
                  UnitSchema.enum.percentage
                )
                  ? '%'
                  : ''}
              </li>
            `;
          });

          return html`
            <div class=${`AscendingAttribute${index}  non-content`}>
              <ul>
                ${a4}
              </ul>
            </div>
          `;
        });
        return html`
          <span class="label spectrum-Heading spectrum-Heading--sizeM"
            >Ascending Attributes</span
          >
          <div class="AscendingAttributes non-content">${a1} ${a2}</div>
        `;
      }
    }
  }

  protected override render(): TemplateResult {
    if (this.general === null || this.general === undefined) {
      return html`no general present`;
    }
    return html`
      <div
        class="GeneralDetails not-content"
        id=${ifDefined(this.general?.name.replaceAll(' ', ''))}
      >
        <div class="not-content Stars">${this.renderStars()}</div>
        <br />
        <div class="BasicStats">${this.renderBasicStats()}</div>
        <br />
        <div class="BooksContainer">
          <span class="label spectrum-Heading spectrum-Heading--sizeM"
            >Skill Books and Clothing Buffs</span
          >
          ${this.renderBooks()}
        </div>
        <div class="SpecialitiesContainer">
          <span class="label spectrum-Heading spectrum-Heading--sizeM"
            >Specialities</span
          >
          ${this.renderSpecialities()}
        </div>
        <div class="AscendingContainer">${this.renderAscending()}</div>
      </div>
    `;
  }
}
