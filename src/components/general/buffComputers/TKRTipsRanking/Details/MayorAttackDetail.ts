import { DefenseBuff } from '@components/general/buffComputers/TKRTipsRanking/Details/DefenseBuff.ts';

const DEBUG = false;

import { z } from 'zod';

import { ExtendedGeneral, type ExtendedGeneralType } from '@schemas/ExtendedGeneral.ts';
import {
  AscendingLevels,
  BuffParams,
  type BuffParamsType,
} from '@schemas/baseSchemas.ts';
import {
  generalUseCase,
} from '@schemas/generalsSchema.ts';
import {AttributeMultipliers, type AttributeMultipliersType} from '@schemas/EvAns.zod.ts';

import { AttackBuff } from './AttackBuff'

const Basic = z
  .function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType, am: AttributeMultipliersType) => {
    let AES_adjustment = 0;
    switch (bp.stars) {
      case AscendingLevels.enum['0stars']:
        break;
      case AscendingLevels.enum['1red']:
        AES_adjustment = 10;
        break;
      case AscendingLevels.enum['2red']:
        AES_adjustment = 20;
        break;
      case AscendingLevels.enum['3red']:
        AES_adjustment = 30;
        break;
      case AscendingLevels.enum['4red']:
        AES_adjustment = 40;
        break;
      case AscendingLevels.enum['5red']:
        AES_adjustment = 50;
        break;
      default:
        console.log(`this should not happen!!!`);
    }

    let BasicAttack = eg.attack + 45 * eg.attack_increment;
    if(DEBUG) {
      console.log(`BasicAttack step1: ${BasicAttack}`)
    }

    BasicAttack += 500;
    if(DEBUG) {
      console.log(`BasicAttack with cultivation: ${BasicAttack}`)
    }
    BasicAttack += AES_adjustment;
    if(DEBUG) {
      console.log(`BasicAttack with AES`)
    }
    if(BasicAttack < 900){
      BasicAttack = BasicAttack * 0.1
      if(DEBUG ) {
        console.log(`BasicAttack less than 900, now ${BasicAttack}`)
      }
    } else {
      BasicAttack = 90 + (BasicAttack -900)*.2;
      if(DEBUG) {
        console.log(`BasicAttack > 900, now ${BasicAttack}`)
      }
    }
    const multiplier = am.Offensive.AllTroopAttack;

    const BAS = Math.floor(BasicAttack * multiplier);
    if(DEBUG){
      console.log(`returning BAS: ${BAS} for ${eg.name}`)
    }

    return BAS;
})

import { AscendingBuffs } from './AES_SingleScope.ts';
import { SpecialityBuffs } from './Speciality_SingleScope.ts';
import { SkillBookBuffs } from './SkillBook_SingleScore';

export const MayorAttackDetail = z.function()
  .args(ExtendedGeneral, BuffParams, AttributeMultipliers)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType, am: AttributeMultipliersType) => {

    const bas = Basic(eg, bp, am);
    const bss =  SkillBookBuffs(eg, generalUseCase.enum.Mayor, bp, am, AttackBuff);
    const speciality = SpecialityBuffs(eg, generalUseCase.enum.Mayor, bp, am, AttackBuff);
    const aes = AscendingBuffs(eg, generalUseCase.enum.Mayor, bp, am, DefenseBuff);

    return bas + bss + speciality + aes;
  })