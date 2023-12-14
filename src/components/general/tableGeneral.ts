import {
  Condition,
  type ConditionType,
  type BuffAdverbArrayType,
  GeneralClass,
  type GeneralClassType,
  type GeneralPairType,
  generalUseCase,
  GeneralPair,
  type generalUseCaseType,
  GeneralElement,
  type GeneralElementType,
  levels,
  type levelsType,
  qualityColor,
  type qualityColorType,
  type standardSkillBookType,
  ClassEnum,
  type ClassEnumType,
  AttributeSchema,
  type Attribute,
} from "@schemas/index";

import {buff} from "@components/general/buff.ts";
import {z} from "zod";

const BuffAdverbs: {[key in generalUseCaseType]: BuffAdverbArrayType} = {
  [generalUseCase.enum.all]: [
    Condition.enum.Attacking,
    Condition.enum.Marching,
    Condition.enum.When_Rallying,
    Condition.enum.dragon_to_the_attack,
    Condition.enum.leading_the_army_to_attack,
    Condition.enum.Reinforcing,
    Condition.enum.Defending,
  ],
  [generalUseCase.enum.Monsters]: [
    Condition.enum.Attacking,
    Condition.enum.Marching,
    Condition.enum.When_Rallying,
    Condition.enum.dragon_to_the_attack,
    Condition.enum.leading_the_army_to_attack,
    Condition.enum.Against_Monsters,
    Condition.enum.Reduces_Monster,
  ],
  [generalUseCase.enum.Attack]: [
    Condition.enum.Attacking,
    Condition.enum.Marching,
    Condition.enum.dragon_to_the_attack,
    Condition.enum.leading_the_army_to_attack,
    Condition.enum.Reduces_Enemy,
    Condition.enum.Enemy,
  ],
  [generalUseCase.enum.Defense]: [
    Condition.enum.Reinforcing,
    Condition.enum.Defending,
    Condition.enum.Reduces_Enemy,
    Condition.enum.Enemy,
  ],
  [generalUseCase.enum.Overall]: [
    Condition.enum.Reduces_Enemy,
    Condition.enum.Enemy,
  ],
  [generalUseCase.enum.Wall]: [
    Condition.enum.Reduces_Enemy,
    Condition.enum.Enemy,
    Condition.enum.Defending,
    Condition.enum.When_The_Main_Defense_General,
    Condition.enum.In_City,
  ],
  [generalUseCase.enum.Mayor]: [
    Condition.enum.Reduces_Enemy,
    Condition.enum.Enemy,
    Condition.enum.When_City_Mayor,
    Condition.enum.When_City_Mayor_for_this_SubCity,
  ],
}

const generalArray = z.array(GeneralElement).nullish();
type generalArrayType = z.infer<typeof generalArray>;

export class tableGeneral {
  readonly name: string;
  private dragon: boolean = false;
  private beast: boolean = false;
  private attack: number;
  private defense: number;
  private hp: number;
  private _attackBuff: number;
  private _hpBuff: number;
  private _defenseBuff: number;
  private unitClass: ClassEnumType | string;
  readonly general: GeneralClassType | null;
  private adverbs: BuffAdverbArrayType = BuffAdverbs[generalUseCase.enum.all];
  
  getIntrinsic() {
    return {attack: this.attack, defense: this.defense, hp: this.hp};
  }

  set attackBuff(n) {
    this._attackBuff = n;
  }
  get attackBuff() {
    return this._attackBuff;
  }

  set hpBuff(n: number) {
    this._hpBuff = n;
  }

  get hpBuff() {
    return this._hpBuff;
  }

  set defenseBuff(n: number) {
    this._defenseBuff = n;
  }

  get defenseBuff() {
    return this._defenseBuff;
  }

  getClass(){
    return this.unitClass;
  }
  
  public constructor(g:  GeneralClassType, useCase: generalUseCaseType ) {
    const validation = GeneralClass.safeParse(g);
    if(validation.success) {
      this.name = validation.data.name;
      this.general = g;
      this.attack = (validation.data.attack + validation.data.attack_increment * 45);
      this.defense = (validation.data.defense + validation.data.defense_increment * 45);
      this.hp = (validation.data.leadership + validation.data.leadership_increment * 45);
      this.unitClass = validation.data.score_as ? validation.data.score_as  : 'all';
      this._attackBuff = 0;
      this._hpBuff = 0;
      this._defenseBuff = 0;
      this.attackBuff = 0;
      this.hpBuff = 0;
      this.defenseBuff = 0;
      this.adverbs = BuffAdverbs[useCase];
      
    } else {
      console.error(`invalid general`);
      this.name = '';
      this.general = null;
      this.attack = 0;
      this.defense = 0;
      this.hp = 0;
      this._attackBuff = 0;
      this._hpBuff = 0;
      this._defenseBuff = 0;
      this.unitClass = 'all';
    }
  }
  
  public setAdverbs(useCase: generalUseCaseType) {
    this.adverbs = BuffAdverbs[useCase];
  }
  
  public computeBuffs(props: {dragon: boolean, beast: boolean, ascending: levelsType, speciality1: qualityColorType, speciality2: qualityColorType, speciality3: qualityColorType, speciality4: qualityColorType, extraBooks: standardSkillBookType[] }) {
    if(this.general !== null && this.general !== undefined) {
      const {attackBuff, defenseBuff, hpBuff} = buff(this.general,this.adverbs, props);
      this.attackBuff = attackBuff;
      this.defenseBuff = defenseBuff;
      this.hpBuff = hpBuff;
    }
    
  }
  
}
