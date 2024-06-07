import {z} from 'zod';
import { Buff, BuffParams, type BuffParamsType, type BuffType, Condition, type ConditionType } from '@schemas/baseSchemas';
import { generalUseCase, type generalUseCaseType } from '@schemas/generalsSchema';

const DEBUGC = false;

export const checkInvalidConditions = z
  .function()
  .args(Buff, BuffParams, generalUseCase)
  .returns(z.boolean())
  .implement((tb: BuffType, iv: BuffParamsType,am: generalUseCaseType) => {
    if (tb.condition !== undefined && tb.condition !== null) {
      if (DEBUGC) {
        console.log(`null condition detected: ${JSON.stringify(tb)}`);
      }
      const conditions = Array<ConditionType>();
      const debuffConditions = Array<ConditionType>();
      if(!am.localeCompare(generalUseCase.enum.Attack)) {
        conditions.push(Condition.enum['Against Monsters']);
        conditions.push(Condition.enum.Defending);
        conditions.push(Condition.enum.In_City);
        conditions.push(Condition.enum.In_Main_City);
        conditions.push(Condition.enum.Reduces_Monster);
        conditions.push(Condition.enum.Reinforcing);
        conditions.push(Condition.enum['When not mine']);
        conditions.push(Condition.enum.When_City_Mayor);
        conditions.push(Condition.enum.When_City_Mayor_for_this_SubCity);
        conditions.push(Condition.enum.When_Defending_Outside_The_Main_City);
        conditions.push(Condition.enum.When_The_Main_Defense_General);
        conditions.push(Condition.enum.When_an_officer);
        debuffConditions.push(Condition.enum.Enemy);
        debuffConditions.push(Condition.enum.Enemy_In_City);
        debuffConditions.push(Condition.enum.Reduces_Enemy);
        debuffConditions.push(Condition.enum.Reduces_Enemy_in_Attack)
        debuffConditions.push(Condition.enum.Reduces_Enemy_with_a_Dragon);
        debuffConditions.push(Condition.enum.Reduces_Monster);
      } else if (!am.localeCompare(generalUseCase.enum.Monsters)) {
        conditions.push(Condition.enum.Defending);
        conditions.push(Condition.enum.In_City);
        conditions.push(Condition.enum.In_Main_City);
        conditions.push(Condition.enum.Reinforcing);
        conditions.push(Condition.enum['When not mine']);
        conditions.push(Condition.enum.When_City_Mayor);
        conditions.push(Condition.enum.When_City_Mayor_for_this_SubCity);
        conditions.push(Condition.enum.When_Defending_Outside_The_Main_City);
        conditions.push(Condition.enum.When_The_Main_Defense_General);
        conditions.push(Condition.enum.When_an_officer);
        debuffConditions.push(Condition.enum.Enemy);
        debuffConditions.push(Condition.enum.Enemy_In_City);
        debuffConditions.push(Condition.enum.Reduces_Enemy);
        debuffConditions.push(Condition.enum.Reduces_Enemy_in_Attack)
        debuffConditions.push(Condition.enum.Reduces_Enemy_with_a_Dragon);
      } else if(!am.localeCompare(generalUseCase.enum.Reinforcement)){
        conditions.push(Condition.enum['Against Monsters']);
        conditions.push(Condition.enum.Marching);
        conditions.push(Condition.enum['When not mine']);
        conditions.push(Condition.enum.When_City_Mayor);
        conditions.push(Condition.enum.When_City_Mayor_for_this_SubCity);
        conditions.push(Condition.enum.When_Rallying);
        conditions.push(Condition.enum.When_The_Main_Defense_General);
        conditions.push(Condition.enum.When_an_officer);
        conditions.push(Condition.enum.brings_dragon_or_beast_to_attack);
        conditions.push(Condition.enum.leading_the_army_to_attack);
        debuffConditions.push(Condition.enum.Enemy);
        debuffConditions.push(Condition.enum.Reduces_Enemy);
        debuffConditions.push(Condition.enum.Reduces_Enemy_with_a_Dragon);
        debuffConditions.push(Condition.enum.Reduces_Monster);
      }else {
        console.log(`no list of conditions for this use case`)
        return false;
      }

      const r1 = conditions.map((c)=> {
        return !(tb.condition?.includes(c));
      })
      const r2 = debuffConditions.map((dc) => {
        return !(tb.condition?.includes(dc));
      })
      if(r1.includes(false) || r2.includes(false)) {
        return false;
      }

      //check for dragon and beast buffs
      if (
        (tb.condition.includes(Condition.enum.Reduces_Enemy_with_a_Dragon) ||
          tb.condition.includes(Condition.enum.brings_a_dragon) ||
          tb.condition.includes(Condition.enum.dragon_to_the_attack)) &&
        iv.dragon !== true
      ) {
        return false;
      }
      if (
        tb.condition.includes(
          Condition.enum.brings_dragon_or_beast_to_attack,
        ) &&
        !(iv.dragon === true || iv.beast === true)
      ) {
        return false;
      }
      return true;
    }
    return false;
  });