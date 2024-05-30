import { customElement, property, state } from "lit/decorators.js";

import { z } from 'zod'

import { delay } from 'nanodelay'

import {
  SizedMixin,
  SpectrumElement,
  type CSSResultArray,
  css,
  unsafeCSS,
  type PropertyValues,
} from "@spectrum-web-components/base";

import SpectrumTokens from "@spectrum-css/tokens/dist/index.css?inline";
import SpectrumTypography from "@spectrum-css/typography/dist/index.css?inline";
import SpectrumIcon from "@spectrum-css/icon/dist/index.css?inline";
import SpectrumTable from "@spectrum-css/table/dist/index.css?inline";

import {
  BuffParams,
  type BuffParamsType,
} from "@schemas/baseSchemas";

import {
  Speciality,
  type SpecialityType,
} from "@schemas/specialitySchema";

import {
  specialSkillBook,
  type BookType,
  type specialSkillBookType,
  type standardSkillBookType,
} from "@schemas/bookSchemas";


import {
  Display,
  GeneralClass,
  type GeneralClassType,
  generalUseCase,
} from '@schemas/generalsSchema'

import {
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type ExtendedGeneralStatusType,
  type RankInstanceType,
} from "@schemas/ExtendedGeneral";

import { EvAnsScoreComputer } from "./buffComputers/EvAnsRanking/EvAnsScoreComputer";
import { ScoreComputer as AttackScoreComputer } from './buffComputers/AttackRanking/ScoreComputer';
import { ScoreComputer as ToughnessScoreComputer } from './buffComputers/ToughnessRanking/ScoreComputer';

const DEBUG = true;

@customElement("base-general")
export class BaseGeneral extends SizedMixin(SpectrumElement, {
  noDefaultSize: true,
}) {

  @property({type: String})
  public generalId = '';

  @state()
  public general: GeneralClassType | null = null;
  
  @property({
    type: Object,
    reflect: true
  })
  public computedBuffs: Map<string, RankInstanceType> = new Map<string, RankInstanceType>();
  
  @property({
    type: String,
    reflect: true
  })
  public status: ExtendedGeneralStatusType = ExtendedGeneralStatus.enum.created;

  @property({
    type: Object,
    attribute: false
  })
  protected _eg: ExtendedGeneralType | null = null;

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

  static InvestmentOptionsRE = /[[\]'",]/g;

  static InvestmentOptions2Key = z
    .function()
    .args(BuffParams)
    .returns(z.string())
    .implement((BP: BuffParamsType) => {
      return JSON.stringify(BP).replace(BaseGeneral.InvestmentOptionsRE, "");
  });

  private getSpecialities = async () => {
    if(this.general === null || 
      this._eg === null || 
      this._eg === undefined ||
      !Array.isArray(this.general.specialities)) {
      return
    } else {
      this.status = ExtendedGeneralStatus.enum.fetching;
      const currentPage = `${document.location.protocol}//${document.location.host}`
      await Promise.all(this.general.specialities.map(async (sn) => {
        
        const sURL = new URL(`/specialities/${sn}.json`,currentPage)
        if(DEBUG) {
          console.log(`GridGeneral: sURL: ${sURL.toString()}`)
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data = await fetch(sURL).then((response) => {
            if(response.ok) return response.json();
            else throw new Error('Status code error :' + response.status)
          }).catch((error) => {
            console.error(JSON.stringify(error))
          })
          const v1 = Speciality.safeParse(data)
          if(v1.success && this._eg !== null ){
            const sd = this._eg.specialities.some((ts) => {
              if(!ts.name.localeCompare(v1.data.name)) {
                return true;
              }
              return false;
            })
            if(sd) {
              return false
            } else {
              this._eg.specialities.push(v1.data)
              this.requestUpdate('_eg');
            }
          } else {
            //the general could not have been null, I already tested for that
            console.log(`invalid special detected for ${this.general?.name}`)
            console.log(JSON.stringify(data))
          }
      }))
    }
  }



  private getBooks =  () => {
    if(this.general === null || 
      this._eg === null || 
      this._eg === undefined ||
      !Array.isArray(this.general.books)) {
      return
    } else {
      this.status = ExtendedGeneralStatus.enum.fetching;
      const currentPage = `${document.location.protocol}//${document.location.host}`
      void this.general.books.map(async (bn) => {
        const bURL = new URL(`/books/${bn}.json`, currentPage)
        if(DEBUG) {
          console.log(`GridGeneral: bURL: ${bURL.toString()}`)
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await fetch(bURL).then((response) => {
          if(response.ok) return response.json();
          else throw new Error('Status code error :' + response.status)
        }).catch((error) => {
          console.error(JSON.stringify(error))
        })
        const v2 = specialSkillBook.safeParse(data)
        if(v2.success && this._eg !== null) {
          const bd = this._eg.books.some((tb) => {
            if(!tb.name.localeCompare(v2.data.name)) {
              return true;
            }
            return false;
          })
          if(bd) {
            return
          } else {
            this._eg.books.push(v2.data)
            this.requestUpdate('_eg');
          }
        } else {
          // the general could not have been null, I already tested for that
          console.log(`invalid book detected for ${this.general?.name}`)
        }
      })
    }
  }

  private getGeneral = async () => {
    this.status = ExtendedGeneralStatus.enum.fetching;
    const currentPage = `${document.location.protocol}//${document.location.host}`
    if(this.generalId.length > 0) {
      const gURL = new URL(`/generals/${this.generalId}.json`,currentPage)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await fetch(gURL).then((response) => {
        if(response.ok) return response.json();
        else throw new Error('Status code error :' + response.status);
      }).catch((error) => {
        console.error(JSON.stringify(error))
      })
      const v3 = GeneralClass.safeParse(data)
      if(v3.success){
        this.general = v3.data
        this.dispatchEvent(new CustomEvent('GeneralSet', {composed: false, bubbles: true}))
        this.requestUpdate('general');
      } else {
        if(DEBUG) {
          console.log(`retrieved invalid general for ${this.generalId} from ${gURL.toString()}`)
        }
      }
    }
  }

  //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
  public GeneralBuffs = z
  .function()
  .args(Display, BuffParams)
  .returns(z.boolean())
  .implement(( display, BP: BuffParamsType) => {
    if(this.general === null || this._eg === null) {
      return false;
    }  else {
      if (DEBUG) console.log(`EvAnsBuff starting for ${this.general.name}`);
      //figure out my state engine here

      const EvAnsRankScore = EvAnsScoreComputer(
        generalUseCase.enum.Attack,
        this._eg,
        display,
        BP
      );

      const AttackRank = AttackScoreComputer(
        generalUseCase.enum.Attack,
        this._eg,
        display,
        BP
      );
      const ToughnessRank = ToughnessScoreComputer(
        generalUseCase.enum.Attack,
        this._eg,
        display,
        BP
      );

      const hashKey = BaseGeneral.InvestmentOptions2Key(BP);

      this.computedBuffs.set(hashKey,{
        EvAnsRanking: EvAnsRankScore,
        AttackRanking: AttackRank,
        ToughnessRanking: ToughnessRank,
      })

      if (DEBUG) {
        console.log(
          `in GeneralBuffs, got scores: ${EvAnsRankScore} ${AttackRank} for ${this.general.name}`
        );
        console.log(`${hashKey}: ${JSON.stringify(this.computedBuffs)}`)
      }
      return true;
    }
  });
 
  protected async willUpdate(_changedProperties: PropertyValues  ): Promise<void> {
    super.willUpdate(_changedProperties)
    if(DEBUG) {console.log(`BaseGeneral willUpdate started`)}
    if(_changedProperties.has('generalId')){
      await Promise.all([
        this.getGeneral(),
        delay(10)
      ])
      this.requestUpdate('_eg');
    }
    if(_changedProperties.has('general')){
      if(this.general !== null) {
        const v = GeneralClass.safeParse(this.general)
        if(!v.success){
          console.error(`General must be a valid general`)
        } else {
          this._eg = {
            general: this.general,
            specialities: new Array<SpecialityType>(),
            books: new Array<BookType|specialSkillBookType|standardSkillBookType>(),
          }
          await Promise.all([
            this.getSpecialities(),
            this.getBooks(),
            delay(10)
          ])
        }
      }
    }
    if(_changedProperties.has('_eg')){
      if(DEBUG) {
        console.log(`BaseGeneral change for _eg detected`)
      }
      if(
        Array.isArray(this._eg?.books) &&
        this._eg.books.length > 0 && 
        Array.isArray(this._eg.specialities) &&
        this._eg.specialities.length > 0
      ) {
        this.status = ExtendedGeneralStatus.enum.complete
      } else {
        this.status = ExtendedGeneralStatus.enum.processing
      }
    }
  }

  public static override get styles(): CSSResultArray {
    const SpectrumTokensCSS = unsafeCSS(SpectrumTokens)
    const SpectrumTypographyCSS = unsafeCSS(SpectrumTypography)
    const SpectrumIconCSS = unsafeCSS(SpectrumIcon)
    const SpectrumTableCSS = unsafeCSS(SpectrumTable)
    const localStyle = css``;
    if (super.styles !== undefined && Array.isArray(super.styles)) {
      return [
        ...super.styles,
        SpectrumTokensCSS,
        SpectrumTypographyCSS,
        SpectrumIconCSS,
        SpectrumTableCSS,
        localStyle
      ]
    } else {
      return [
        SpectrumTokensCSS,
        SpectrumTypographyCSS,
        SpectrumIconCSS,
        SpectrumTableCSS,
        localStyle
      ]
    }
  }
  
}