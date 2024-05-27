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

import {EvAnsGroundPvPAttack} from './Ground/AttackPvPBase';
import {EvAnsArchersPvPAttack} from './Archers/AttackPvPBase';
import {EvAnsMountedPvPAttack} from './Mounted/AttackPvPBase';
import {EvAnsSiegePvPAttack} from './Siege/AttackPvPBase';

/*******************
 * this is derived by reverse engineering the formula from
 * the reasonably detailed but slight incomplete description
 * at https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
 * with some details filled in by
 * https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
 */

const DEBUG = false;

export const EvAnsScoreComputer = z
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
          return EvAnsArchersPvPAttack(eg, display, bp)
        }
        if(generalSpecialists.enum.Ground.localeCompare(eg.general.score_as)) {
          return EvAnsGroundPvPAttack(eg, display, bp)
        }
        if(generalSpecialists.enum.Mounted.localeCompare(eg.general.score_as)) {
          return EvAnsMountedPvPAttack(eg, display, bp)
        }
        if(generalSpecialists.enum.Siege.localeCompare(eg.general.score_as)) {
          return EvAnsSiegePvPAttack(eg, display, bp)
        }
        
      } else {
        console.log(`not called for Attack use case`)
      }
      console.log(`${eg.general.name} did not match any scoring function`)
      return -7;
    }
  );
