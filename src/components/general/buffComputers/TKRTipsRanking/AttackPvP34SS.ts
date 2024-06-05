import { z } from 'zod';

import {
  BuffParams,
  type BuffParamsType, type BuffType,
  qualityColor,
} from '@schemas/baseSchemas';

import { Speciality, type SpecialityType } from '@schemas/specialitySchema';

import {
  ExtendedGeneral,
  type ExtendedGeneralType,
} from '@schemas/ExtendedGeneral';

import {type BuffFunctionInterface} from '@lib/RankingInterfaces';


const DEBUG_34SS = false;

const buffReductionLogic = (specialB: SpecialityType, eg: ExtendedGeneralType, sb: BuffType, bp: BuffParamsType, tbfo:  BuffFunctionInterface) => {
  let ba = 0;
  let sb_total = tbfo.Attack(
    specialB.name, eg.name, sb, bp);
  if (DEBUG_34SS) {
    console.log(`Attack adding ${sb_total} to: ${ba}`);
  }
  ba += sb_total;
  sb_total = tbfo.MarchSize(
    specialB.name, eg.name, sb, bp);
  if (DEBUG_34SS) {
    console.log(`MarchSize adding ${sb_total} to: ${ba}`);
  }
  ba += sb_total;
  sb_total = tbfo.Range(specialB.name, eg.name, sb, bp);
  if (DEBUG_34SS) {
    console.log(`Range adding ${sb_total} to: ${ba}`);
  }
  ba += sb_total;
  sb_total = tbfo.DeHP(
    specialB.name, eg.name, sb, bp);
  if (DEBUG_34SS) {
    console.log(`DeHP adding ${sb_total} to: ${ba}`);
  }
  ba += sb_total;
  sb_total = tbfo.DeDefense(
    specialB.name, eg.name, sb, bp);
  if (DEBUG_34SS) {
    console.log(`DeDefense adding ${sb_total} to: ${ba}`);
  }
  ba += sb_total;

  return ba;
};

export const AttackPvP34SS = (eg: ExtendedGeneralType, bp: BuffParamsType, typedBuffFunction: BuffFunctionInterface) => {
    let BSS_Score = 0;

    if (
      eg.specialities !== undefined &&
      Array.isArray(eg.specialities) &&
      eg.specialities.length > 0
    ) {
      const specialities_total = eg.specialities.reduce(
        (a1, special, index1) => {
          if (DEBUG_34SS) {
            console.log('');
            console.log(`--- ${special.name} ---`);
            console.log(JSON.stringify(special.attribute));
            console.log(`accumulator: ${a1}`);
            console.log(`---`);
          }
          if (special === undefined || special === null) {
            return a1;
          } else {
            const v = Speciality.safeParse(special);
            if (v.error) {
              console.log(`${eg.name}: invalid speciality: ${special.name}`);
              return a1;
            } else {
              const specialB: SpecialityType = v.data;
              const AA_total = specialB.attribute.reduce((a2, sa, index2) => {
                if (sa === undefined || sa === null) {
                  return a2;
                } else {
                  if (DEBUG_34SS) {
                    console.log(`---start sa ${index1} ${index2}---`);
                    console.log(JSON.stringify(sa));
                    console.log('--- end sa ---');
                  }
                  if (
                    (!sa.level.localeCompare(qualityColor.enum.Green) &&
                      bp.special1.localeCompare(qualityColor.enum.Disabled) &&
                      index1 === 0) ||
                    (!sa.level.localeCompare(qualityColor.enum.Green) &&
                      bp.special2.localeCompare(qualityColor.enum.Disabled) &&
                      index1 === 1) ||
                    (!sa.level.localeCompare(qualityColor.enum.Green) &&
                      bp.special3.localeCompare(qualityColor.enum.Disabled) &&
                      index1 === 2) ||
                    (!sa.level.localeCompare(qualityColor.enum.Green) &&
                      bp.special4.localeCompare(qualityColor.enum.Disabled) &&
                      index1 === 3) ||
                    (!sa.level.localeCompare(qualityColor.enum.Green) &&
                      bp.special5.localeCompare(qualityColor.enum.Disabled) &&
                      index1 === 4)
                  ) {
                    if (DEBUG_34SS) {
                      console.log(
                        `sa ${index1} ${index2} matches as an enabled green`
                      );
                    }
                    const gt = sa.buff.reduce((aGreen, sb, index3) => {
                      let buff_total = 0;
                      if (sb === undefined || sb === null) {
                        return aGreen;
                      } else {
                        //(tbfo: BuffFunctionInterface, specialB: SpecialityType, eg: ExtendedGeneralType, sb: BuffType, bp: BuffParamsType, ba: number) => {
                        buff_total = buffReductionLogic(specialB, eg, sb, bp, typedBuffFunction);
                      }
                      if (DEBUG_34SS) {
                        console.log(
                          `green ${index3} adding ${buff_total} to ${aGreen}`
                        );
                      }
                      aGreen += buff_total;
                      return aGreen;
                    }, 0);
                    if (DEBUG_34SS) {
                      console.log(`gt adding ${gt} to ${a2}`)
                    }
                    a2 += gt;
                  }

                  if (
                    (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                      (bp.special1.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special1.localeCompare(qualityColor.enum.Green)) &&
                      index1 === 0) ||
                    (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                      (bp.special2.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special2.localeCompare(qualityColor.enum.Green)) &&
                      index1 === 1) ||
                    (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                      (bp.special3.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special3.localeCompare(qualityColor.enum.Green)) &&
                      index1 === 2) ||
                    (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                      (bp.special4.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special4.localeCompare(qualityColor.enum.Green)) &&
                      index1 === 3) ||
                    (!sa.level.localeCompare(qualityColor.enum.Blue) &&
                      (bp.special5.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special5.localeCompare(qualityColor.enum.Green)) &&
                      index1 === 4)
                  ) {
                    if (DEBUG_34SS) {
                      console.log(
                        `sa ${index1} ${index2} matches as an enabled Blue`
                      );
                    }
                    const bt = sa.buff.reduce((aBlue, sb, index3) => {
                      let buff_total = 0;
                      if (sb === undefined || sb === null) {
                        return aBlue;
                      } else {
                        buff_total = buffReductionLogic(specialB, eg, sb, bp, typedBuffFunction);
                      }
                      aBlue += buff_total;
                      return aBlue;
                    }, 0);
                    a2 += bt;
                  }
                  if (
                    (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                      (bp.special1.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special1.localeCompare(qualityColor.enum.Green) ||
                        bp.special1.localeCompare(qualityColor.enum.Blue)) &&
                      index1 === 0) ||
                    (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                      (bp.special2.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special2.localeCompare(qualityColor.enum.Green) ||
                        bp.special2.localeCompare(qualityColor.enum.Blue)) &&
                      index1 === 1) ||
                    (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                      (bp.special3.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special3.localeCompare(qualityColor.enum.Green) ||
                        bp.special3.localeCompare(qualityColor.enum.Blue)) &&
                      index1 === 2) ||
                    (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                      (bp.special4.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special4.localeCompare(qualityColor.enum.Green) ||
                        bp.special4.localeCompare(qualityColor.enum.Blue)) &&
                      index1 === 3) ||
                    (!sa.level.localeCompare(qualityColor.enum.Purple) &&
                      (bp.special5.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special5.localeCompare(qualityColor.enum.Green) ||
                        bp.special5.localeCompare(qualityColor.enum.Blue)) &&
                      index1 === 4)
                  ) {
                    if (DEBUG_34SS) {
                      console.log(
                        `sa ${index1} ${index2} matches as an enabled Purple`
                      );
                    }
                    const pt = sa.buff.reduce((aPurple, sb, index3) => {
                      let buff_total = 0;
                      if (sb === undefined || sb === null) {
                        return aPurple;
                      } else {
                        buff_total = buffReductionLogic(specialB, eg, sb, bp, typedBuffFunction,);
                      }
                      aPurple += buff_total;
                      return aPurple;
                    }, 0);
                    a2 += pt;
                  }
                  if (
                    (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                      (bp.special1.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special1.localeCompare(qualityColor.enum.Green) ||
                        bp.special1.localeCompare(qualityColor.enum.Blue) ||
                        bp.special1.localeCompare(qualityColor.enum.Purple)) &&
                      index1 === 0) ||
                    (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                      (bp.special2.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special2.localeCompare(qualityColor.enum.Green) ||
                        bp.special2.localeCompare(qualityColor.enum.Blue) ||
                        bp.special2.localeCompare(qualityColor.enum.Purple)) &&
                      index1 === 1) ||
                    (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                      (bp.special3.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special3.localeCompare(qualityColor.enum.Green) ||
                        bp.special3.localeCompare(qualityColor.enum.Blue) ||
                        bp.special3.localeCompare(qualityColor.enum.Purple)) &&
                      index1 === 2) ||
                    (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                      (bp.special4.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special4.localeCompare(qualityColor.enum.Green) ||
                        bp.special4.localeCompare(qualityColor.enum.Blue) ||
                        bp.special4.localeCompare(qualityColor.enum.Purple)) &&
                      index1 === 3) ||
                    (!sa.level.localeCompare(qualityColor.enum.Orange) &&
                      (bp.special5.localeCompare(qualityColor.enum.Disabled) ||
                        bp.special5.localeCompare(qualityColor.enum.Green) ||
                        bp.special5.localeCompare(qualityColor.enum.Blue) ||
                        bp.special5.localeCompare(qualityColor.enum.Purple)) &&
                      index1 === 4)
                  ) {
                    if (DEBUG_34SS) {
                      console.log(
                        `sa ${index1} ${index2} matches as an enabled Orange`
                      );
                    }
                    const ot = sa.buff.reduce((aOrange, sb, index3) => {
                      let buff_total = 0;
                      if (sb === undefined || sb === null) {
                        return aOrange;
                      } else {
                        buff_total = buffReductionLogic(specialB, eg, sb, bp, typedBuffFunction);
                      }
                      aOrange += buff_total;
                      return aOrange;
                    }, 0);
                    a2 += ot;
                  }
                  if (
                    (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                      !bp.special1.localeCompare(qualityColor.enum.Gold) &&
                      index1 === 0) ||
                    (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                      !bp.special2.localeCompare(qualityColor.enum.Gold) &&
                      index1 === 1) ||
                    (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                      !bp.special3.localeCompare(qualityColor.enum.Gold) &&
                      index1 === 2) ||
                    (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                      !bp.special4.localeCompare(qualityColor.enum.Gold) &&
                      index1 === 3) ||
                    (!sa.level.localeCompare(qualityColor.enum.Gold) &&
                      !bp.special5.localeCompare(qualityColor.enum.Gold) &&
                      index1 === 4)
                  ) {
                    if (DEBUG_34SS) {
                      console.log(
                        `sa ${index1} ${index2} matches as an enabled Gold`
                      );
                    }
                    const goldT = sa.buff.reduce((aGold, sb, index3) => {
                      let buff_total = 0;
                      if (sb === undefined || sb === null) {
                        return aGold;
                      } else {
                        buff_total = buffReductionLogic(specialB, eg, sb, bp, typedBuffFunction);
                      }
                      aGold += buff_total;
                      return aGold;
                    }, 0);
                    a2 += goldT;
                  }
                }
                if (DEBUG_34SS) {
                  console.log(`a2: ${a2}`);
                  console.log('');
                }
                return a2;
              }, 0);
              a1 += AA_total;
              if (DEBUG_34SS) {
                console.log(`index1: ${index1} total: ${AA_total}; a1: ${a1}`);
              }
              return a1;
            }
          }
        },
        0
      );

      if (DEBUG_34SS) {
        console.log(`${eg.name}: specialities total: ${specialities_total}`);
        console.log('');
      }
      BSS_Score += Math.floor(specialities_total);
    }
    return Math.floor(BSS_Score);
  }
