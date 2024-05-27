import { z } from "astro:content";

import {
  ActivationSituations,
  type ActivationSituationsType,
  AscendingLevels,
  Attribute,
  Buff,
  type BuffType,
  BuffParams,
  type BuffParamsType,
  ClassEnum,
  type ClassEnumType,
  Condition,
  type ConditionType,
  type levelsType,
  qualityColor,
  type qualityColorType,
  syslogSeverity,
  UnitSchema,
} from "@schemas/baseSchemas";

import {
  ConflictArray, 
  ConflictDatum,   
  type bookConflictsType,
  type ConflictDatumType,
 } from '@schemas/conflictSchemas'

 import {
  Note,
  Display,
  type DisplayType,
  type NoteType,
  GeneralArray,
  type GeneralClassType,
  GeneralElement,
  type GeneralArrayType,
  type GeneralElementType,
  generalSpecialists,
  type generalUseCaseType,
 } from '@schemas/generalsSchema'

 import {
  Speciality,
  type SpecialityType,
 } from '@schemas/specialitySchema'

 import { 
  ExtendedGeneral,
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  type GeneralPairType,
  } from "@schemas/ExtendedGeneral";

import { 
  type BookType,
  specialSkillBook,
  standardSkillBook,
  type specialSkillBookType,
  type standardSkillBookType,
 } from "@schemas/bookSchemas";
 
import { PvPBuff } from "./PvPBuff";

const DEBUG_34SS = false;

export const PvP34SS = z
  .function()
  .args(ExtendedGeneral, BuffParams)
  .returns(z.number())
  .implement((eg: ExtendedGeneralType, bp: BuffParamsType) => {
    const gc = eg.general;
    let BSS_Score = 0;

    if (eg.specialities !== undefined &&
      Array.isArray(eg.specialities) &&
      eg.specialities.length > 0) {
      const specialities_total = eg.specialities.reduce((a1, special, index1) => {
        if (DEBUG_34SS) {
          console.log("");
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
            console.log(`${eg.general.name}: invalid speciality: ${special.name}`);
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
                if ((!sa.level.localeCompare(qualityColor.enum.Green) &&
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
                    index1 === 4)) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled green`);
                  }
                  const gt = sa.buff.reduce((aGreen, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aGreen;
                    } else {
                      const sb_total = PvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} to ${aGreen}`);
                      }
                      aGreen += sb_total;
                    }
                    if (DEBUG_34SS) {
                      console.log(`aGeen: ${aGreen} at end of green reduce ${index3}`);
                    }
                    return aGreen;
                  }, 0);
                  a2 += gt;
                }

                if ((!sa.level.localeCompare(qualityColor.enum.Blue) &&
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
                    index1 === 4)) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled Blue`);
                  }
                  const bt = sa.buff.reduce((aBlue, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aBlue;
                    } else {
                      const sb_total = PvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} ${index3}`);
                      }
                      aBlue += sb_total;
                    }
                    return aBlue;
                  }, 0);
                  a2 += bt;
                }
                if ((!sa.level.localeCompare(qualityColor.enum.Purple) &&
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
                    index1 === 4)) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled Purple`);
                  }
                  const pt = sa.buff.reduce((aPurple, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aPurple;
                    } else {
                      const sb_total = PvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} ${index3}`);
                      }
                      aPurple += sb_total;
                    }
                    return aPurple;
                  }, 0);
                  a2 += pt;
                }
                if ((!sa.level.localeCompare(qualityColor.enum.Orange) &&
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
                    index1 === 4)) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled Orange`);
                  }
                  const ot = sa.buff.reduce((aOrange, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aOrange;
                    } else {
                      const sb_total = PvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} ${index3}`);
                      }
                      aOrange += sb_total;
                    }
                    return aOrange;
                  }, 0);
                  a2 += ot;
                }
                if ((!sa.level.localeCompare(qualityColor.enum.Gold) &&
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
                    index1 === 4)) {
                  if (DEBUG_34SS) {
                    console.log(`sa ${index1} ${index2} matches as an enabled Gold`);
                  }
                  const goldT = sa.buff.reduce((aGold, sb, index3) => {
                    if (sb === undefined || sb === null) {
                      return aGold;
                    } else {
                      const sb_total = PvPBuff(specialB.name, gc.name, sb, bp);
                      if (DEBUG_34SS) {
                        console.log(`accumulating ${sb_total} ${index3}`);
                      }
                      aGold += sb_total;
                    }
                    return aGold;
                  }, 0);
                  a2 += goldT;
                }
              }
              if (DEBUG_34SS) {
                console.log(`a2: ${a2}`);
                console.log("");
              }
              return a2;
            }, 0);
            return a1 + AA_total;
          }
        }
        return a1;

      }, 0);

      if (DEBUG_34SS) {
        console.log(`${eg.general.name}: specialities total: ${specialities_total}`);
        console.log('');
      }
      BSS_Score += Math.floor(specialities_total);
    }
    return Math.floor(BSS_Score);
  });
