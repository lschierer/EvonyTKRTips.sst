import {z} from 'zod';

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
  generalUseCase,
  type generalUseCaseType,
  type generalSpecialistsType,
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

import {GroundPvPDefense} from './Ground/PvPBase'
import { ArchersPvPDefense } from "./Archers/PvPBase";
import { MountedPvPDefense} from './Mounted/PvPBase';
import { SiegePvPDefense } from "./Siege/PvPBase";

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

export const DEBUG = false;

export const ScoreComputer = z
  .function()
  .args(generalUseCase, ExtendedGeneral, Display, BuffParams)
  .returns(z.number())
  .implement(
    (
      UseCase: generalUseCaseType,
      eg: ExtendedGeneralType,
      display: DisplayType,
      bp: BuffParamsType
    ) => {
      if(!UseCase.localeCompare(generalUseCase.enum.Attack)){
        if(DEBUG) {
          console.log(`called for Attack use case`)
        }
        if(generalSpecialists.enum.Archers.localeCompare(eg.general.score_as)){
          return ArchersPvPDefense(eg, display, bp)
        }
        if(generalSpecialists.enum.Ground.localeCompare(eg.general.score_as)) {
          return GroundPvPDefense(eg, display, bp)
        }
        if(generalSpecialists.enum.Mounted.localeCompare(eg.general.score_as)) {
          return MountedPvPDefense(eg, display, bp)
        }
        if(generalSpecialists.enum.Siege.localeCompare(eg.general.score_as)) {
          return SiegePvPDefense(eg, display, bp)
        }
        
      } else {
        console.log(`not called for Attack use case`)
      }
      console.log(`${eg.general.name} did not match any scoring function`)
      return -7;
    }
  );
