
const DEBUG = false;

import * as b from '@schemas/baseSchemas.ts';

import {
    type AscendingType,
    type GeneralClassType,
    generalUseCase,
    type generalUseCaseType
} from '@schemas/generalsSchema.ts'

import {
    Speciality,
    type SpecialityType
} from '@schemas/specialitySchema.ts'

import { type generalInvestment, } from './generalInvestmentStore'

export const buffAdverbs: { [key in generalUseCaseType]: b.BuffAdverbArrayType } = {
    [generalUseCase.enum.all]: [
        b.Condition.enum.Attacking,
        b.Condition.enum.Marching,
        b.Condition.enum.When_Rallying,
        b.Condition.enum.dragon_to_the_attack,
        b.Condition.enum.brings_dragon_or_beast_to_attack,
        b.Condition.enum.leading_the_army_to_attack,
        b.Condition.enum.Reinforcing,
        b.Condition.enum.Defending,
    ],
    [generalUseCase.enum.Monsters]: [
        b.Condition.enum.Attacking,
        b.Condition.enum.Marching,
        b.Condition.enum.When_Rallying,
        b.Condition.enum.dragon_to_the_attack,
        b.Condition.enum.leading_the_army_to_attack,
        b.Condition.enum.Against_Monsters,
        b.Condition.enum.Reduces_Monster,
    ],
    [generalUseCase.enum.Attack]: [
        b.Condition.enum.Attacking,
        b.Condition.enum.Marching,
        b.Condition.enum.dragon_to_the_attack,
        b.Condition.enum.brings_dragon_or_beast_to_attack,
        b.Condition.enum.leading_the_army_to_attack,
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Enemy,
    ],
    [generalUseCase.enum.Defense]: [
        b.Condition.enum.Reinforcing,
        b.Condition.enum.Defending,
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Enemy,
    ],
    [generalUseCase.enum.Overall]: [
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Enemy,
    ],
    [generalUseCase.enum.Wall]: [
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Enemy,
        b.Condition.enum.Defending,
        b.Condition.enum.When_The_Main_Defense_General,
        b.Condition.enum.In_City,
    ],
    [generalUseCase.enum.Mayors]: [
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Enemy,
        b.Condition.enum.When_the_City_Mayor,
    ],
}

function buffFilter(current: b.Buff, general: GeneralClassType, score_for: b.Attribute, props: generalInvestment, situations?: b.BuffAdverbArrayType,) {
    const name = general.name;
    let toReturn = false;
    const dragon = props.dragon;
    const beast = props.beast;

    if (current.condition !== undefined && current.condition !== null) {
        const condition: b.BuffAdverbArrayType = [current.condition].flat();
        if (!dragon) {
            if (DEBUG) { console.log(`${name} doesn't have a dragon`) }
            if (condition.includes(b.Condition.enum.dragon_to_the_attack)) {
                if (DEBUG) { console.log(`${name} returning false on buff requiring a dragon`) }
                return false;
            }
            if (!beast) {
                if (DEBUG) { console.log(`${name} has neither dragon or beast`) }
                if (condition.includes(b.Condition.enum.brings_dragon_or_beast_to_attack)) {
                    if (DEBUG) { console.log(`${name} returning false on buff that requires b or dragon`) }
                    return false;
                }
            } else {
                if (DEBUG) { console.log(`${name} has a beast, I care about buffs that have dragons but not those that accept beasts`) }
            }
        } else {
            if (DEBUG) { console.log(`${name} has a dragon, I no longer care if the buff requires one`) }
        }


        //special case conditions
        if (condition.includes(b.Condition.enum.Reduces_Monster)) {
            if (situations !== null && situations !== undefined && situations.includes(b.Condition.enum.Reduces_Monster)) {
                if (current.attribute === b.AttributeSchema.enum.Attack && score_for === b.AttributeSchema.enum.Defense) {
                    return true;
                }
                if ((current.attribute === b.AttributeSchema.enum.Defense || current.attribute === b.AttributeSchema.enum.HP) &&
                    score_for === b.AttributeSchema.enum.Attack) {
                    return true;
                }
            }
            return false;
        }
        if (condition.includes(b.Condition.enum.Reduces_Enemy)) {
            if (situations !== null && situations !== undefined && (!(situations.includes(b.Condition.enum.Reduces_Monster) || situations.includes(b.Condition.enum.When_an_officer)))) {
                if (current.attribute === b.AttributeSchema.enum.Attack && score_for === b.AttributeSchema.enum.Defense) {
                    return true
                }
                if ((current.attribute === b.AttributeSchema.enum.Defense || current.attribute === b.AttributeSchema.enum.HP) &&
                    score_for === b.AttributeSchema.enum.Attack) {
                    return true;
                }
            }
            return false;
        }

        if (situations !== null && situations !== undefined && condition !== null && condition !== undefined) {
            const intersection = situations.filter(x => condition.includes(x));
            if (condition.length > intersection.length) {
                return false;
            } else {
                toReturn = true;
            }
        } else {
            toReturn = true;
        }
    } else {
    }

    if (general.score_as !== undefined && general.score_as !== null) {
        const score_as = general.score_as;
        if (current.class !== undefined && current.class !== null) {
            const result = (!current.class.localeCompare(score_as));
            if (!result) {
                return false;
            }
            toReturn = result;
        }
    }

    if (current.attribute !== undefined && current.attribute !== null) {
        toReturn = (!score_for.localeCompare(current.attribute));
    }

    return toReturn;
}

const ascendingLevel: { [key: string]: boolean } = {
    '0': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': true,
    '7': true,
    '8': true,
    '9': true,
    '10': true,
}

export function buff(eg: GeneralClassType, situations: b.BuffAdverbArrayType, props: generalInvestment) {
    const saLevels = [props.speciality1, props.speciality2, props.speciality3, props.speciality4]
    let attack = 0;
    let hp = 0;
    let defense = 0;
    let rally = 0;
    let march = 0;
    if (eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        if (general.books !== undefined && general.books !== null) {
            general.books.map((bb) => {
                const buff: b.Buff[] = [bb.buff].flat();
                buff.map((current) => {
                    if (current !== undefined && current !== null && general !== undefined) {
                        let apply = buffFilter(current, general, b.AttributeSchema.enum.Attack, props, situations);
                        if (apply && current.value !== undefined && current.value !== null) {
                            const buff_type = current.value.unit;
                            if ((current.condition !== null && current.condition !== undefined) &&
                                (
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy))
                                )
                            ) {
                                attack = attack + Math.abs(current.value.number);
                            } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                attack = attack + current.value.number
                            }
                        }
                        apply = buffFilter(current, general, b.AttributeSchema.enum.Defense, props, situations);
                        if (apply && current.value !== undefined && current.value !== null) {
                            const buff_type = current.value.unit;
                            if ((current.condition !== null && current.condition !== undefined) &&
                                (
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy))
                                )
                            ) {
                                defense = defense + Math.abs(current.value.number);
                            } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                defense = defense + current.value.number
                            }
                        }
                        apply = buffFilter(current, general, b.AttributeSchema.enum.HP, props, situations);
                        if (apply && current.value !== undefined && current.value !== null) {
                            const buff_type = current.value.unit;
                            if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                hp = hp + current.value.number
                            }
                        }
                    }

                })
            })
        }

        if (general.specialities !== undefined && general.specialities !== null) {
            general.specialities.forEach((s: SpecialityType, i) => {
                s.attribute.map((sa) => {
                    let proceed = false;
                    switch (saLevels[i]) {
                        case 'Gold':
                            if (!sa.level.localeCompare('Gold')) {
                                proceed = true;
                                break;
                            }
                        case 'Orange':
                            if (!sa.level.localeCompare('Orange')) {
                                proceed = true;
                                break;
                            }
                        case 'Purple':
                            if (!sa.level.localeCompare('Purple')) {
                                proceed = true;
                                break;
                            }
                        case 'Blue':
                            if (!sa.level.localeCompare('Blue')) {
                                proceed = true;
                                break;
                            }
                        case 'Green':
                            if (!sa.level.localeCompare('Green')) {
                                proceed = true;
                                break;
                            }
                        default:
                            proceed = false;
                    }
                    if (proceed) {
                        const buff: b.Buff[] = [sa.buff].flat()
                        buff.map((current) => {
                            if (current !== undefined && current !== null && general !== undefined) {
                                let apply = buffFilter(current, general, b.AttributeSchema.enum.Attack, props, situations);
                                if (apply && current.value !== undefined && current.value !== null) {
                                    const buff_type = current.value.unit;
                                    if ((current.condition !== null && current.condition !== undefined) &&
                                        (
                                            ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                            ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy))
                                        )
                                    ) {
                                        attack = attack + Math.abs(current.value.number);
                                    } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                        attack = attack + current.value.number
                                    }
                                }
                                apply = buffFilter(current, general, b.AttributeSchema.enum.Defense, props, situations);
                                if (apply && current.value !== undefined && current.value !== null) {
                                    const buff_type = current.value.unit;
                                    if ((current.condition !== null && current.condition !== undefined) &&
                                        (
                                            ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                            ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy))
                                        )
                                    ) {
                                        defense = defense + Math.abs(current.value.number);
                                    } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                        defense = defense + current.value.number
                                    }
                                }
                                apply = buffFilter(current, general, b.AttributeSchema.enum.HP, props, situations);
                                if (apply && current.value !== undefined && current.value !== null) {
                                    const buff_type = current.value.unit;
                                    if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                        hp = hp + current.value.number
                                    }
                                }
                            } else {
                            }
                        })
                    } else {
                    }

                })
            })
        }

        if (general.ascending !== undefined && general.ascending !== null && ascendingLevel[props.ascending]) {
            general.ascending.map((ga: AscendingType) => {
                let proceed = false;
                switch (props.ascending) {
                    case '10':
                        if (!ga.level.localeCompare('10')) {
                            proceed = true;
                            break;
                        }
                    case '9':
                        if (!ga.level.localeCompare('9')) {
                            proceed = true;
                            break;
                        }
                    case '8':
                        if (!ga.level.localeCompare('8')) {
                            proceed = true;
                            break;
                        }
                    case '7':
                        if (!ga.level.localeCompare('7')) {
                            proceed = true;
                            break;
                        }
                    case '6':
                        if (!ga.level.localeCompare('6')) {
                            proceed = true;
                            break;
                        }
                    default:
                        proceed = false;
                }
                if (proceed) {
                    const buff: b.Buff[] = [ga.buff].flat();
                    buff.map((current) => {
                        if (current !== undefined && current !== null && general) {
                            let apply = buffFilter(current, general, b.AttributeSchema.enum.Attack, props, situations);
                            if (apply && current.value !== undefined && current.value !== null) {
                                const buff_type = current.value.unit;
                                if ((current.condition !== null && current.condition !== undefined) &&
                                    (
                                        ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                        ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy))
                                    )
                                ) {
                                    attack = attack + Math.abs(current.value.number);
                                } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                    attack = attack + current.value.number
                                }
                            }
                            apply = buffFilter(current, general, b.AttributeSchema.enum.Defense, props, situations);
                            if (apply && current.value !== undefined && current.value !== null) {
                                const buff_type = current.value.unit;
                                if ((current.condition !== null && current.condition !== undefined) &&
                                    (
                                        ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                        ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy))
                                    )
                                ) {
                                    defense = defense + Math.abs(current.value.number);
                                } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                    defense = defense + current.value.number
                                }
                            }
                            apply = buffFilter(current, general, b.AttributeSchema.enum.HP, props, situations);
                            if (apply && current.value !== undefined && current.value !== null) {
                                const buff_type = current.value.unit;
                                if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                    hp = hp + current.value.number
                                }
                            }
                        }
                    })
                } else {
                }
            })
        } else {
        }
    }



    return { attackBuff: attack, defenseBuff: defense, hpBuff: hp };
}

