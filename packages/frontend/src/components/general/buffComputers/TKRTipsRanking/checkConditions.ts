import { z } from 'zod';
import {
  Buff,
  BuffParams,
  type BuffParamsType,
  type BuffType,
  Condition,
  type ConditionType,
} from '@schemas/baseSchemas';
import {
  generalUseCase,
  type generalUseCaseType,
} from '@schemas/generalsSchema';

const DEBUGC = false;

export const checkInvalidConditions = z
  .function()
  .args(Buff, BuffParams, generalUseCase, z.boolean())
  .returns(z.boolean())
  .implement(
    (
      tb: BuffType,
      iv: BuffParamsType,
      useCase: generalUseCaseType,
      debuff: boolean,
    ) => {
      if (tb.condition !== undefined && tb.condition !== null) {
        if (DEBUGC) {
          console.log(`condition detected: ${JSON.stringify(tb)}`);
        }
        const InvalidConditions = Array<ConditionType>();
        const debuffConditions = Array<ConditionType>();
        if (!useCase.localeCompare(generalUseCase.enum.Attack)) {
          InvalidConditions.push(Condition.enum['Against Monsters']);
          InvalidConditions.push(Condition.enum.Defending);
          InvalidConditions.push(Condition.enum.In_City);
          InvalidConditions.push(Condition.enum.In_Main_City);
          InvalidConditions.push(Condition.enum.Reinforcing);
          InvalidConditions.push(Condition.enum.When_City_Mayor);
          InvalidConditions.push(
            Condition.enum.When_City_Mayor_for_this_SubCity,
          );
          InvalidConditions.push(
            Condition.enum.When_Defending_Outside_The_Main_City,
          );
          InvalidConditions.push(Condition.enum.When_The_Main_Defense_General);
          InvalidConditions.push(Condition.enum.When_an_officer);
          debuffConditions.push(Condition.enum.Enemy);
          debuffConditions.push(Condition.enum.Enemy_In_City);
          debuffConditions.push(Condition.enum.Reduces_Enemy);
          debuffConditions.push(Condition.enum.Reduces_Enemy_in_Attack);
          debuffConditions.push(Condition.enum.Reduces_Enemy_with_a_Dragon);
          InvalidConditions.push(Condition.enum['Reduces Monster']); //while this is for debuffs, it is _invalid_
        } else if (!useCase.localeCompare(generalUseCase.enum.Monsters)) {
          InvalidConditions.push(Condition.enum.Defending);
          InvalidConditions.push(Condition.enum.In_City);
          InvalidConditions.push(Condition.enum.In_Main_City);
          InvalidConditions.push(Condition.enum.Reinforcing);
          InvalidConditions.push(Condition.enum.When_City_Mayor);
          InvalidConditions.push(
            Condition.enum.When_City_Mayor_for_this_SubCity,
          );
          InvalidConditions.push(
            Condition.enum.When_Defending_Outside_The_Main_City,
          );
          InvalidConditions.push(Condition.enum.When_The_Main_Defense_General);
          InvalidConditions.push(Condition.enum.When_an_officer);
          debuffConditions.push(Condition.enum.Enemy);
          debuffConditions.push(Condition.enum.Enemy_In_City);
          debuffConditions.push(Condition.enum.Reduces_Enemy);
          debuffConditions.push(Condition.enum.Reduces_Enemy_in_Attack);
          debuffConditions.push(Condition.enum.Reduces_Enemy_with_a_Dragon);
        } else if (!useCase.localeCompare(generalUseCase.enum.Reinforcement)) {
          InvalidConditions.push(Condition.enum['Against Monsters']);
          InvalidConditions.push(Condition.enum.Marching);
          InvalidConditions.push(Condition.enum.When_City_Mayor);
          InvalidConditions.push(
            Condition.enum.When_City_Mayor_for_this_SubCity,
          );
          InvalidConditions.push(Condition.enum.When_Rallying);
          InvalidConditions.push(Condition.enum.When_The_Main_Defense_General);
          InvalidConditions.push(Condition.enum.When_an_officer);
          InvalidConditions.push(
            Condition.enum.brings_dragon_or_beast_to_attack,
          );
          InvalidConditions.push(Condition.enum.dragon_to_the_attack);
          InvalidConditions.push(Condition.enum.leading_the_army_to_attack);
          InvalidConditions.push(Condition.enum.Enemy);
          InvalidConditions.push(Condition.enum.Enemy_In_City);
          InvalidConditions.push(Condition.enum.Reduces_Enemy);
          InvalidConditions.push(Condition.enum.Reduces_Enemy_in_Attack);
          InvalidConditions.push(Condition.enum.Reduces_Enemy_with_a_Dragon);
          debuffConditions.push(Condition.enum['Reduces Monster']);
        } else if (!useCase.localeCompare(generalUseCase.enum.Mayor)) {
          InvalidConditions.push(Condition.enum['Against Monsters']);
          InvalidConditions.push(Condition.enum.Attacking);
          InvalidConditions.push(Condition.enum.Defending);
          InvalidConditions.push(Condition.enum.In_City);
          InvalidConditions.push(Condition.enum.In_Main_City);
          InvalidConditions.push(Condition.enum.Marching);
          InvalidConditions.push(Condition.enum.Reinforcing);
          InvalidConditions.push(
            Condition.enum.When_Defending_Outside_The_Main_City,
          );
          InvalidConditions.push(Condition.enum.When_Rallying);
          InvalidConditions.push(Condition.enum.When_The_Main_Defense_General);
          InvalidConditions.push(Condition.enum.When_an_officer);
          InvalidConditions.push(
            Condition.enum.brings_dragon_or_beast_to_attack,
          );
          InvalidConditions.push(Condition.enum.dragon_to_the_attack);
          InvalidConditions.push(Condition.enum.leading_the_army_to_attack);
          debuffConditions.push(Condition.enum.Enemy);
          InvalidConditions.push(Condition.enum.Enemy_In_City);
          debuffConditions.push(Condition.enum.Reduces_Enemy);
          InvalidConditions.push(Condition.enum.Reduces_Enemy_in_Attack);
          debuffConditions.push(Condition.enum.Reduces_Enemy_with_a_Dragon);
          InvalidConditions.push(Condition.enum['Reduces Monster']);
        } else {
          console.log(`no list of conditions for this use case`);
          return false;
        }

        const IhaveValidConditions1 = InvalidConditions.map((c) => {
          //c is an invalid condition, return true if I _don't_ have it.
          return !tb.condition?.includes(c);
        });
        const DebuffsPresent = debuffConditions.map((dc) => {
          if (dc === undefined || tb.condition === undefined) {
            return true;
          } else {
            return tb.condition.includes(dc);
          }
          return true;
        });
        if (IhaveValidConditions1.includes(false)) {
          if (DEBUGC) {
            if (IhaveValidConditions1.includes(false)) {
              console.log(`r1 returning false ${useCase}`);
            }
          }
          return false;
        }
        if (DebuffsPresent.includes(true)) {
          if (debuff) {
            if (DEBUGC) {
              console.log(`I am lookikng for debuffs and I found one`);
            }
            return true;
          } else {
            if (DEBUGC) {
              console.log(`Debuff is Invalid per debuff parameter`);
            }
            return false;
          }
        } else if (debuff) {
          if (DEBUGC) {
            console.log(`I am looking for debuffs and did not find one`);
          }
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
      if (DEBUGC) {
        console.log(`no conditions to check for ${JSON.stringify(tb)}`);
      }
      return false;
    },
  );
