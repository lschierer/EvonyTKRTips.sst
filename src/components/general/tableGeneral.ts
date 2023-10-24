import {
  BuffAdverbs,
  type BuffAdverbsType,
  type BuffAdverbArrayType,
  generalUseCase,
  type generalUseCaseType,
  generalSchema,
  type General,
  generalObjectSchema,
  type generalObject,
  levelSchema,
  type levelSchemaType,
  qualitySchema,
  type qualitySchemaType,
  troopClass,
  type troopClassType,
} from "@schemas/evonySchemas.ts";

import {buff} from "@components/general/buff.ts";
import {z} from "zod";

const buffAdverbs: {[key in generalUseCaseType]: BuffAdverbArrayType} = {
  [generalUseCase.enum.all]: [
    BuffAdverbs.enum.Attacking,
    BuffAdverbs.enum.Marching,
    BuffAdverbs.enum.When_Rallying,
    BuffAdverbs.enum.dragon_to_the_attack,
    BuffAdverbs.enum.leading_the_army_to_attack,
    BuffAdverbs.enum.Reinforcing,
    BuffAdverbs.enum.Defending,
  ],
  [generalUseCase.enum.Monsters]: [
    BuffAdverbs.enum.Attacking,
    BuffAdverbs.enum.Marching,
    BuffAdverbs.enum.When_Rallying,
    BuffAdverbs.enum.dragon_to_the_attack,
    BuffAdverbs.enum.leading_the_army_to_attack,
    BuffAdverbs.enum.Against_Monsters,
    BuffAdverbs.enum.Reduces_Monster,
  ],
  [generalUseCase.enum.Attack]: [
    BuffAdverbs.enum.Attacking,
    BuffAdverbs.enum.Marching,
    BuffAdverbs.enum.dragon_to_the_attack,
    BuffAdverbs.enum.leading_the_army_to_attack,
    BuffAdverbs.enum.Reduces_Enemy,
    BuffAdverbs.enum.Enemy,
  ],
  [generalUseCase.enum.Defense]: [
    BuffAdverbs.enum.Reinforcing,
    BuffAdverbs.enum.Defending,
    BuffAdverbs.enum.Reduces_Enemy,
    BuffAdverbs.enum.Enemy,
  ],
  [generalUseCase.enum.Overall]: [
    BuffAdverbs.enum.Reduces_Enemy,
    BuffAdverbs.enum.Enemy,
  ],
  [generalUseCase.enum.Wall]: [
    BuffAdverbs.enum.Reduces_Enemy,
    BuffAdverbs.enum.Enemy,
    BuffAdverbs.enum.Defending,
    BuffAdverbs.enum.When_The_Main_Defense_General,
    BuffAdverbs.enum.In_City,
  ],
  [generalUseCase.enum.Mayors]: [
    BuffAdverbs.enum.Reduces_Enemy,
    BuffAdverbs.enum.Enemy,
    BuffAdverbs.enum.When_the_City_Mayor,
  ],
}

const generalArray = z.array(generalObjectSchema).nullish();
type generalArrayType = z.infer<typeof generalArray>;

export class tableGeneral {
  readonly name: string;
  private attack: number;
  private defense: number;
  private hp: number;
  private attackBuff: number;
  private hpBuff: number;
  private defenseBuff: number;
  private unitClass: troopClassType | string;
  readonly general: General | null;
  private adverbs: BuffAdverbArrayType = buffAdverbs[generalUseCase.enum.all];
  
  getIntrinsic() {
    return {attack: this.attack, defense: this.defense, hp: this.hp};
  }
  
  getBuffs() {
    return {attackBuff: this.attackBuff, defenseBuff: this.defenseBuff, hpBuff: this.hpBuff};
  }
  
  getClass(){
    return this.unitClass;
  }
  
  public constructor(g:  General, useCase: generalUseCaseType ) {
    const validation = generalSchema.safeParse(g);
    if(validation.success) {
      this.name = validation.data.name;
      this.general = g;
      this.attack = (validation.data.attack + validation.data.attack_increment * 45);
      this.defense = (validation.data.defense + validation.data.defense_increment * 45);
      this.hp = (validation.data.leadership + validation.data.leadership_increment * 45);
      this.unitClass = validation.data.score_as ? validation.data.score_as  : 'all';
      this.attackBuff = 0;
      this.hpBuff = 0;
      this.defenseBuff = 0;
      this.adverbs = buffAdverbs[useCase];
      
    } else {
      console.error(`invalid general`);
      this.name = '';
      this.general = null;
      this.attack = 0;
      this.defense = 0;
      this.hp = 0;
      this.attackBuff = 0;
      this.hpBuff = 0;
      this.defenseBuff = 0;
      this.unitClass = 'all';
    }
  }
  
  public setAdverbs(useCase: generalUseCaseType) {
    this.adverbs = buffAdverbs[useCase];
  }
  
  public computeBuffs(props: {ascending: levelSchemaType, Speciality1: qualitySchemaType, Speciality2: qualitySchemaType, Speciality3: qualitySchemaType, Speciality4: qualitySchemaType}) {
    if(this.general !== null) {
      const {attackBuff, defenseBuff, hpBuff} = buff(this.general,this.adverbs, props);
      this.attackBuff = attackBuff;
      this.defenseBuff = defenseBuff;
      this.hpBuff = hpBuff;
      console.log(`computeBuffs; ${this.name}; attackBuff now ${this.attackBuff} set from ${attackBuff}`)
    }
    
  }
  
}
