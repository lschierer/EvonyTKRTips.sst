import {z} from 'zod';

import { Buff, BuffParams, type BuffParamsType, type BuffType, Condition } from '@schemas/baseSchemas.ts';

const DEBUGC = false;

export const checkInvalidConditions = z
  .function()
  .args(Buff, BuffParams)
  .returns(z.boolean())
  .implement((tb: BuffType, iv: BuffParamsType) => {
    if (tb.condition !== undefined && tb.condition !== null) {
      if (DEBUGC) {
        console.log(`null condition detected: ${JSON.stringify(tb)}`);
      }
      if (
        tb.condition.includes(Condition.enum['Against Monsters']) ||
        tb.condition.includes(Condition.enum.Reduces_Monster) ||
        tb.condition.includes(Condition.enum.In_Main_City) ||
        tb.condition.includes(Condition.enum.Reinforcing) ||
        tb.condition.includes(
          Condition.enum.When_Defending_Outside_The_Main_City,
        ) ||
        tb.condition.includes(Condition.enum.When_City_Mayor) ||
        tb.condition.includes(
          Condition.enum.When_City_Mayor_for_this_SubCity,
        ) ||
        tb.condition.includes(Condition.enum['When not mine']) ||
        tb.condition.includes(Condition.enum.When_an_officer)
      ) {
        //none of These apply to PvP attacking
        if (DEBUGC) {
          console.log(`buff with inapplicable attribute `);
          console.log(JSON.stringify(tb));
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
    return false;
  });