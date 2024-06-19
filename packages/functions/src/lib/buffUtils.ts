import {
  ActivationSituations,
  type ActivationSituationsType,
  Condition,
  type ConditionType,
} from '@schemas/baseSchemas';

type BuffEffectiveMap = Record<
  ActivationSituationsType,
  (condition: ConditionType) => boolean
>;

const BuffEffectiveMap: BuffEffectiveMap = {
  [ActivationSituations.enum['Defense of Buildings']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.Defending,
      Condition.enum.During_SvS,
      Condition.enum.Enemy,
      Condition.enum.Enemy_In_City,
      Condition.enum.Marching,
      Condition.enum.Reduces_Enemy,
      Condition.enum.Reduces_Enemy_in_Attack,
      Condition.enum.Reduces_Enemy_with_a_Dragon,
      Condition.enum.When_Defending_Outside_The_Main_City,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Defense of Camp']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.During_SvS,
      Condition.enum.Enemy,
      Condition.enum.Enemy_In_City,
      Condition.enum.Marching,
      Condition.enum.Reduces_Enemy,
      Condition.enum.Reduces_Enemy_in_Attack,
      Condition.enum.Reduces_Enemy_with_a_Dragon,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Defense of Self']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Defending,
      Condition.enum.During_SvS,
      Condition.enum.Enemy,
      Condition.enum.Enemy_In_City,
      Condition.enum.Reduces_Enemy,
      Condition.enum.Reduces_Enemy_with_a_Dragon,
      Condition.enum.brings_a_dragon,
      Condition.enum.In_City,
      Condition.enum.In_Main_City,
      Condition.enum.When_The_Main_Defense_General,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Solo PvP']]: (condition: ConditionType) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.During_SvS,
      Condition.enum.Enemy,
      Condition.enum.Enemy_In_City,
      Condition.enum.Marching,
      Condition.enum.Reduces_Enemy,
      Condition.enum.Reduces_Enemy_in_Attack,
      Condition.enum.Reduces_Enemy_with_a_Dragon,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Rally Owner PvP']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.During_SvS,
      Condition.enum.Enemy,
      Condition.enum.Enemy_In_City,
      Condition.enum.Marching,
      Condition.enum.Reduces_Enemy,
      Condition.enum.Reduces_Enemy_in_Attack,
      Condition.enum.Reduces_Enemy_with_a_Dragon,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
      Condition.enum.When_Rallying,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Rally Participant PvP']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.During_SvS,
      Condition.enum.Marching,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Reinforcement of Buildings']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.Defending,
      Condition.enum.During_SvS,
      Condition.enum.Enemy,
      Condition.enum.Enemy_In_City,
      Condition.enum.Marching,
      Condition.enum.Reduces_Enemy,
      Condition.enum.Reduces_Enemy_in_Attack,
      Condition.enum.Reduces_Enemy_with_a_Dragon,
      Condition.enum.When_Defending_Outside_The_Main_City,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Reinforcement of Others']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Defending,
      Condition.enum.During_SvS,
      Condition.enum.Enemy,
      Condition.enum.Enemy_In_City,
      Condition.enum.Reduces_Enemy,
      Condition.enum.Reduces_Enemy_with_a_Dragon,
      Condition.enum.brings_a_dragon,
      Condition.enum.In_City,
      Condition.enum.In_Main_City,
      Condition.enum.Reinforcing,
      Condition.enum.When_Defending_Outside_The_Main_City,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Solo Monster']]: (condition: ConditionType) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.During_SvS,
      Condition.enum.Marching,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
      Condition.enum['Against Monsters'],
      Condition.enum['Reduces Monster'],
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Rally Owner Monster']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.During_SvS,
      Condition.enum.Marching,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
      Condition.enum['Against Monsters'],
      Condition.enum['Reduces Monster'],
      Condition.enum.When_Rallying,
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
  [ActivationSituations.enum['Rally Participant Monster']]: (
    condition: ConditionType
  ) => {
    const trueCases: ConditionType[] = [
      Condition.enum.Attacking,
      Condition.enum.During_SvS,
      Condition.enum.Marching,
      Condition.enum.brings_a_dragon,
      Condition.enum.brings_dragon_or_beast_to_attack,
      Condition.enum.dragon_to_the_attack,
      Condition.enum.leading_the_army_to_attack,
      Condition.enum['Against Monsters'],
    ];
    if (trueCases.includes(condition)) {
      return true;
    }
    return false;
  },
};

export const isBuffEffective = (
  situation: ActivationSituationsType,
  condition: ConditionType
) => {
  return BuffEffectiveMap[situation](condition);
};
