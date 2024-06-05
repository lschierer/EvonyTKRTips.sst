import { customElement, property, state } from 'lit/decorators.js';

import { z } from 'zod';

import { delay } from 'nanodelay';

import {
  SizedMixin,
  SpectrumElement,
  type CSSResultArray,
  css,
  unsafeCSS,
  type PropertyValues,
} from '@spectrum-web-components/base';

import SpectrumTokens from '@spectrum-css/tokens/dist/index.css?inline';
import SpectrumTypography from '@spectrum-css/typography/dist/index.css?inline';
import SpectrumIcon from '@spectrum-css/icon/dist/index.css?inline';
import SpectrumTable from '@spectrum-css/table/dist/index.css?inline';

import { BuffParams, type BuffParamsType } from '@schemas/baseSchemas';

import {
  Display,
  type DisplayType,
  GeneralClass,
  type GeneralClassType,
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

import {
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type ExtendedGeneralStatusType,
  type RankInstanceType,
  ExtendedGeneral,
} from '@schemas/ExtendedGeneral';

import { EvAnsScoreComputer } from '@components/general/buffComputers/EvAnsRanking/EvAnsScoreComputer';
import { AttackScoreComputer } from '@components/general/buffComputers/TKRTipsRanking/AttackScoreComputer';
import { ToughnessScoreComputer } from '@components/general/buffComputers/TKRTipsRanking/ToughnessScoreComputer';

const DEBUG = true;

@customElement('base-general')
export class BaseGeneral extends SizedMixin(SpectrumElement, {
  noDefaultSize: true,
}) {
  @property({ type: String })
  public generalId = '';

  @state()
  public general: ExtendedGeneralType | null = null;

  @property({
    type: String,
    reflect: true,
  })
  public useCase: generalUseCaseType = generalUseCase.enum.Attack;

  @property({
    type: Object,
    reflect: true,
  })
  public computedBuffs: Map<string, RankInstanceType> = new Map<
    string,
    RankInstanceType
  >();

  @property({
    type: String,
    reflect: true,
  })
  public status: ExtendedGeneralStatusType = ExtendedGeneralStatus.enum.created;

  private MutationObserver: MutationObserver;

  handleMutation(): void {
    return;
  }

  constructor() {
    super();

    this.MutationObserver = new MutationObserver(() => {
      this.handleMutation();
    });

    this.addEventListener('SpecialsComplete', (e: Event) =>
      this.internalEvents(e)
    );
    this.addEventListener('BooksComplete', (e: Event) =>
      this.internalEvents(e)
    );
  }

  private booksDone = false;
  private specialitiesDone = false;

  private internalEvents(event: Event) {
    if (DEBUG) {
      console.log(`BaseGeneral internalEvents ${this.generalId} ${event.type}`);
    }
    if (event.type === 'SpecialsComplete') {
      this.specialitiesDone = true;
    }
    if (event.type === 'BooksComplete') {
      this.booksDone = true;
    }
    if (this.booksDone && this.specialitiesDone) {
      if (DEBUG) {
        console.log(
          `BaseGeneral internalEvents calling requestUpdate ${this.booksDone} ${this.specialitiesDone}`
        );
      }
      this.requestUpdate('general');
    }
  }

  static InvestmentOptionsRE = /[[\]'",]/g;

  static InvestmentOptions2Key = z
    .function()
    .args(BuffParams)
    .returns(z.string())
    .implement((BP: BuffParamsType) => {
      return JSON.stringify(BP).replace(BaseGeneral.InvestmentOptionsRE, '');
    });

  private getBooks = async () => {
    //this needs to eventually handle books not built in.
  };

  private getGeneral = async () => {
    //do not fetch again if I already am.
    if (
      !this.status.localeCompare(ExtendedGeneralStatus.enum.complete) ||
      !this.status.localeCompare(ExtendedGeneralStatus.enum.fetching)
    ) {
      return;
    }
    this.status = ExtendedGeneralStatus.enum.fetching;
    const currentPage = `${document.location.protocol}//${document.location.host}`;
    if (this.generalId.length > 0) {
      const gURL = new URL(`/generals/${this.generalId}.json`, currentPage);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await fetch(gURL)
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error('Status code error :' + response.status);
        })
        .catch((error) => {
          console.error(JSON.stringify(error));
        });
      const v3 = ExtendedGeneral.safeParse(data);
      if (v3.success) {
        this.general = v3.data;
        this.dispatchEvent(
          new CustomEvent('GeneralSet', { composed: false, bubbles: true })
        );
        this.requestUpdate('general');
      } else {
        if (DEBUG) {
          console.log(
            `retrieved invalid general for ${this.generalId} from ${gURL.toString()}`
          );
        }
      }
    }
  };

  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  public GeneralBuffs = z
    .function()
    .args(Display, BuffParams)
    .returns(z.boolean())
    .implement((display: DisplayType, BP: BuffParamsType) => {
      if (
        this.general === null ||
        this.status.localeCompare(ExtendedGeneralStatus.enum.complete)
      ) {
        return false;
      } else {
        if (DEBUG) {
          console.log(`EvAnsBuff starting for ${this.general.name}`);
          console.log(`EvAnsBuff has useCase ${this.useCase}`)
        }
        //figure out my state engine here

        const EvAnsRankScore = EvAnsScoreComputer(
          this.useCase,
          this.general,
          display,
          BP
        );

        const AttackRank = AttackScoreComputer(
          this.useCase,
          this.general,
          display,
          BP
        );
        const ToughnessRank = ToughnessScoreComputer(
          this.useCase,
          this.general,
          display,
          BP
        );

        const hashKey = BaseGeneral.InvestmentOptions2Key(BP);

        this.computedBuffs.set(hashKey, {
          EvAnsRanking: EvAnsRankScore,
          AttackRanking: AttackRank,
          ToughnessRanking: ToughnessRank,
        });

        if (DEBUG) {
          console.log(
            `in GeneralBuffs, got scores: ${EvAnsRankScore} ${AttackRank} for ${this.general.name} ${display}`
          );
          console.log(`${hashKey}: ${JSON.stringify(this.computedBuffs)}`);
        }
        return true;
      }
    });

  protected async firstUpdated(
    _changedProperties: PropertyValues
  ): Promise<void> {
    super.firstUpdated(_changedProperties);
    if (this.generalId.length > 0 && this.general === null) {
      if (DEBUG) {
        console.log(
          `BaseGeneral firstUpdated generalId prop for ${this.generalId ?? ''}`
        );
      }
      if (this.general === null) {
        if (DEBUG) {
          console.log(
            `BaseGeneral firstUpdated generalId needs to getGeneral for ${this.generalId ?? ''}`
          );
        }
        await Promise.all([this.getGeneral(), delay(10)]);
      }
    } else {
      if (DEBUG) {
        console.log(
          `BaseGeneral firstUpdated ${this.generalId} status ${this.status}`
        );
      }
    }
  }

  protected async willUpdate(
    _changedProperties: PropertyValues
  ): Promise<void> {
    super.willUpdate(_changedProperties);
    if (DEBUG) {
      console.log(`BaseGeneral willUpdate started ${this.generalId ?? ''}`);
    }
    if (_changedProperties.has('general')) {
      if (DEBUG) {
        console.log(
          `BaseGeneral willUpdate general prop for ${this.generalId ?? ''}`
        );
      }
      if (this.general !== null) {
        const v = ExtendedGeneral.safeParse(this.general);
        if (!v.success) {
          console.error(`General must be a valid general`);
        } else {
          this.status = ExtendedGeneralStatus.enum.complete;
          this.dispatchEvent(
            new CustomEvent('GeneralComplete', {
              composed: false,
              bubbles: true,
            })
          );
        }
      }
    }
  }

  public static override get styles(): CSSResultArray {
    const SpectrumTokensCSS = unsafeCSS(SpectrumTokens);
    const SpectrumTypographyCSS = unsafeCSS(SpectrumTypography);
    const SpectrumIconCSS = unsafeCSS(SpectrumIcon);
    const SpectrumTableCSS = unsafeCSS(SpectrumTable);
    const localStyle = css``;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [
        ...super.styles,
        SpectrumTokensCSS,
        SpectrumTypographyCSS,
        SpectrumIconCSS,
        SpectrumTableCSS,
        localStyle,
      ];
    } else {
      return [
        SpectrumTokensCSS,
        SpectrumTypographyCSS,
        SpectrumIconCSS,
        SpectrumTableCSS,
        localStyle,
      ];
    }
  }
}
