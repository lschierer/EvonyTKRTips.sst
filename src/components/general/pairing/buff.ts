
const DEBUG = false;

import * as b from '@schemas/baseSchemas';

import {
    type AscendingType,
    type GeneralClassType,
    generalUseCase,
    type generalUseCaseType
} from '@schemas/generalsSchema'

import {
    Speciality,
    type SpecialityType
} from '@schemas/specialitySchema'


import { type generalInvestment, } from './selectionStore'


export const buffAdverbs: { [key in generalUseCaseType]: b.BuffAdverbArrayType } = {
    [generalUseCase.enum.all]: [
        b.Condition.enum.Attacking,
        b.Condition.enum.Marching,
        b.Condition.enum.When_Rallying,
        b.Condition.enum.brings_a_dragon,
        b.Condition.enum.dragon_to_the_attack,
        b.Condition.enum.brings_dragon_or_beast_to_attack,
        b.Condition.enum.leading_the_army_to_attack,
        b.Condition.enum.Reinforcing,
        b.Condition.enum.Defending,
        b.Condition.enum.When_Defending_Outside_The_Main_City,
    ],
    [generalUseCase.enum.Monsters]: [
        b.Condition.enum.Attacking,
        b.Condition.enum.Marching,
        b.Condition.enum.When_Rallying,
        b.Condition.enum.brings_a_dragon,
        b.Condition.enum.dragon_to_the_attack,
        b.Condition.enum.leading_the_army_to_attack,
        b.Condition.enum.Against_Monsters,
        b.Condition.enum.Reduces_Monster,
    ],
    [generalUseCase.enum.Attack]: [
        b.Condition.enum.Attacking,
        b.Condition.enum.Marching,
        b.Condition.enum.brings_a_dragon,
        b.Condition.enum.dragon_to_the_attack,
        b.Condition.enum.brings_dragon_or_beast_to_attack,
        b.Condition.enum.leading_the_army_to_attack,
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Reduces_Enemy_in_Attack,
        b.Condition.enum.Reduces_Enemy_with_a_Dragon,
        b.Condition.enum.Enemy,
    ],
    [generalUseCase.enum.Defense]: [
        b.Condition.enum.Reinforcing,
        b.Condition.enum.Defending,
        b.Condition.enum.brings_a_dragon,
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Reduces_Enemy_with_a_Dragon,
        b.Condition.enum.Enemy,
        b.Condition.enum.When_Defending_Outside_The_Main_City,
    ],
    [generalUseCase.enum.Overall]: [
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Enemy,
        b.Condition.enum.Reduces_Enemy_with_a_Dragon,
    ],
    [generalUseCase.enum.Wall]: [
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Enemy,
        b.Condition.enum.Defending,
        b.Condition.enum.When_The_Main_Defense_General,
        b.Condition.enum.In_City,
    ],
    [generalUseCase.enum.Mayor]: [
        b.Condition.enum.Reduces_Enemy,
        b.Condition.enum.Enemy,
        b.Condition.enum.When_City_Mayor,
        b.Condition.enum.When_City_Mayor_for_this_SubCity,
    ],
}

function yieldToMain() {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    });
}

function buffFilter(current: b.BuffType, general: GeneralClassType, score_for: b.AttributeType, props: generalInvestment, situations?: b.BuffAdverbArrayType,) {
    const name = general.name;
    let toReturn = false;
    const dragon = props.dragon;
    const beast = props.beast;
    const condition = current.condition || null;
    //if(DEBUG) {console.log(`g is ${name}, current is ${JSON.stringify(current)}`)};
    if (current.condition !== undefined && current.condition !== null) {
        const condition: b.BuffAdverbArrayType = [current.condition].flat();

        if (!dragon) {
            if (DEBUG) { console.log(`${name} doesn't have a dragon`) }
            if (condition.includes(b.Condition.enum.dragon_to_the_attack)) {
                if (DEBUG) { console.log(`${name} returning false on buff requiring a dragon`) }
                return false;
            }
            if (condition.includes(b.Condition.enum.brings_a_dragon)) {
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

        yieldToMain();

        //special case conditions
        if (condition.includes(b.Condition.enum.Reduces_Monster)) {
            if (situations !== null && situations !== undefined && situations.includes(b.Condition.enum.Reduces_Monster)) {
                if (current.attribute === b.Attribute.enum.Attack && score_for === b.Attribute.enum.Defense) {
                    return true;
                }
                if ((current.attribute === b.Attribute.enum.Defense || current.attribute === b.Attribute.enum.HP) &&
                    score_for === b.Attribute.enum.Attack) {
                    return true;
                }
            }
            return false;
        }
        if (
            (condition.includes(b.Condition.enum.Reduces_Enemy)) ||
            (condition.includes(b.Condition.enum.Reduces_Enemy_in_Attack)) 
            ) {
            if (situations !== null && situations !== undefined && (!(situations.includes(b.Condition.enum.Reduces_Monster) || situations.includes(b.Condition.enum.When_an_officer)))) {
                if (current.attribute === b.Attribute.enum.Attack && score_for === b.Attribute.enum.Defense) {
                    return true
                }
                if ((current.attribute === b.Attribute.enum.Defense || current.attribute === b.Attribute.enum.HP) &&
                    score_for === b.Attribute.enum.Attack) {
                    return true;
                }
            }
            return false;
        }
        yieldToMain();


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

const ascendingLevel: Record<string, boolean> = {
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
    const rally = 0;
    let march = 0;
    if (eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        if (general.books !== undefined && general.books !== null) {
            general.books.map((bb) => {
                const buff: b.BuffType[] = [bb.buff].flat();
                buff.map((current) => {
                    if (current !== undefined && current !== null && general !== undefined) {
                        let apply = buffFilter(current, general, b.Attribute.enum.Attack, props, situations);
                        if (apply && current.value !== undefined && current.value !== null) {
                            if (DEBUG) { console.log(`applying ${JSON.stringify(current)} to ${general.name}`) }
                            const buff_type = current.value.unit;
                            //we apply the anti-defense and anti-hp to the attack
                            if (
                                (props.debuffLead !== undefined && props.debuffLead !== null && props.debuffLead === true) && 
                                (current.condition !== null && current.condition !== undefined) &&
                                (
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy)) ||
                                    (([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy_with_a_Dragon)) && (props.dragon === true))
                                )
                            ) {
                                attack = attack + Math.abs(current.value.number);
                                if (DEBUG) { console.log(`${general.name} a ${attack}`) }
                            } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                attack = attack + current.value.number
                            }
                        } else if (current.condition !== null && current.condition !== undefined && current.condition === b.Condition.enum.brings_dragon_or_beast_to_attack) {
                            if (DEBUG) { console.log(`not applying ${JSON.stringify(current)} to ${general.name}`) }
                        }
                        apply = buffFilter(current, general, b.Attribute.enum.Defense, props, situations);
                        if (apply && current.value !== undefined && current.value !== null) {
                            const buff_type = current.value.unit;
                            //we apply the anti-attack here to the defense
                            if ((props.debuffLead !== undefined && props.debuffLead !== null && props.debuffLead === true) && (current.condition !== null && current.condition !== undefined) &&
                                (
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy)) ||
                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy_in_Attack)) ||
                                    (([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy_with_a_Dragon)) && (props.dragon === true))
                                )
                            ) {
                                defense = defense + Math.abs(current.value.number);
                            } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                defense = defense + current.value.number
                            }
                        }
                        //which leaves the HP calcultion much simplier by default
                        apply = buffFilter(current, general, b.Attribute.enum.HP, props, situations);
                        if (apply && current.value !== undefined && current.value !== null) {
                            const buff_type = current.value.unit;
                            if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                hp = hp + current.value.number
                            }
                        }
                        apply = buffFilter(current,general, b.Attribute.enum.March_Size_Capacity, props, situations);
                        if(apply && current.value !== undefined && current.value !== null ) {
                            const buff_type = current.value.unit;
                            if(!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                march = march + current.value.number;
                            }
                        }
                    }

                })
            })
        }

        if (general.specialities !== undefined && general.specialities !== null) {
            let fourth = true;
            fourth = fourth && (!saLevels.includes(b.qualityColor.enum.Disabled))
            fourth = fourth && (!saLevels.includes(b.qualityColor.enum.Green))
            fourth = fourth && (!saLevels.includes(b.qualityColor.enum.Blue))
            fourth = fourth && (!saLevels.includes(b.qualityColor.enum.Purple))
            fourth = fourth && (!saLevels.includes(b.qualityColor.enum.Orange))
            for(let i = 0; i < (fourth ? 4 : 3); i++) {
                const s = general.specialities[i];
                if(s !== undefined && s !== null ) {
                    if(!(Object.prototype.toString.call(s) === "[object String]")) {
                        (s as SpecialityType).attribute.map((sa) => {
                            let proceed = false;
                            const curSaL = saLevels[i];
                            if(curSaL !== undefined && curSaL !== null) {
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
                            }
                            if (proceed) {
                                const buff: b.BuffType[] = [sa.buff].flat()
                                buff.map((current) => {
                                    if (current !== undefined && current !== null && general !== undefined) {
                                        let apply = buffFilter(current, general, b.Attribute.enum.Attack, props, situations);
                                        if (apply && current.value !== undefined && current.value !== null) {
                                            const buff_type = current.value.unit;
                                            if ((current.condition !== null && current.condition !== undefined) &&
                                                (
                                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy)) ||
                                                    (([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy_with_a_Dragon)) && (props.dragon === true))
                                                )
                                            ) {
                                                attack = attack + Math.abs(current.value.number);
                                            } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                                attack = attack + current.value.number
                                            }
                                        }
                                        apply = buffFilter(current, general, b.Attribute.enum.Defense, props, situations);
                                        if (apply && current.value !== undefined && current.value !== null) {
                                            const buff_type = current.value.unit;
                                            if ((current.condition !== null && current.condition !== undefined) &&
                                                (
                                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy)) ||
                                                    ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy_in_Attack)) ||
                                                    (([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy_with_a_Dragon)) && (props.dragon === true))
                                                )
                                            ) {
                                                defense = defense + Math.abs(current.value.number);
                                            } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                                defense = defense + current.value.number
                                            }
                                        }
                                        apply = buffFilter(current, general, b.Attribute.enum.HP, props, situations);
                                        if (apply && current.value !== undefined && current.value !== null) {
                                            const buff_type = current.value.unit;
                                            if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                                hp = hp + current.value.number
                                            }
                                        }
                                        apply = buffFilter(current,general, b.Attribute.enum.March_Size_Capacity, props, situations);
                                        if(apply && current.value !== undefined && current.value !== null ) {
                                            const buff_type = current.value.unit;
                                            if(!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                                march = march + current.value.number;
                                            }
                                        }
                                    } else {
                                    }
                                })
                            } else {
                            }
        
                        })
                    }
                    
                }
            }
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
                    const buff: b.BuffType[] = [ga.buff].flat();
                    buff.map((current) => {
                        if (current !== undefined && current !== null && general) {
                            let apply = buffFilter(current, general, b.Attribute.enum.Attack, props, situations);
                            if (apply && current.value !== undefined && current.value !== null) {
                                const buff_type = current.value.unit;
                                if ((current.condition !== null && current.condition !== undefined) &&
                                    (
                                        ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                        ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy)) ||
                                        (([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy_with_a_Dragon)) && (props.dragon === true))
                                    )
                                ) {
                                    attack = attack + Math.abs(current.value.number);
                                } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                    attack = attack + current.value.number
                                }
                            }
                            apply = buffFilter(current, general, b.Attribute.enum.Defense, props, situations);
                            if (apply && current.value !== undefined && current.value !== null) {
                                const buff_type = current.value.unit;
                                if ((current.condition !== null && current.condition !== undefined) &&
                                    (
                                        ([current.condition].flat().includes(b.Condition.enum.Reduces_Monster)) ||
                                        ([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy)) ||
                                        (([current.condition].flat().includes(b.Condition.enum.Reduces_Enemy_with_a_Dragon)) && (props.dragon === true))
                                    )
                                ) {
                                    defense = defense + Math.abs(current.value.number);
                                } else if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                    defense = defense + current.value.number
                                }
                            }
                            apply = buffFilter(current, general, b.Attribute.enum.HP, props, situations);
                            if (apply && current.value !== undefined && current.value !== null) {
                                const buff_type = current.value.unit;
                                if (!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                    hp = hp + current.value.number
                                }
                            }
                            apply = buffFilter(current,general, b.Attribute.enum.March_Size_Capacity, props, situations);
                            if(apply && current.value !== undefined && current.value !== null ) {
                                const buff_type = current.value.unit;
                                if(!buff_type.localeCompare(b.UnitSchema.enum.percentage)) {
                                    march = march + current.value.number;
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



    return { attackBuff: attack, defenseBuff: defense, hpBuff: hp, marchBuff: march };
}

