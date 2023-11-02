import {
    type ascendingAttributesType,
    type ascendingIncrementType,
    type buff,
    BuffAttributes,
    type BuffAdverbsType,
    type BuffAdverbArrayType,
    type BuffAttributesType,
    type buffType,
    buffTypeEnum,
    buffValueSchema,
    type General,
    type levelSchemaType,
    skillBook,
    type skillBookType,
    type specialtyAttributeType,
    type specialtyType,
    type troopClassType,
    type qualitySchemaType, BuffAdverbs
} from '@schemas/evonySchemas.ts';

interface Props {
    dragon: boolean,
    beast: boolean,
    ascending: levelSchemaType,
    Speciality1: qualitySchemaType,
    Speciality2: qualitySchemaType,
    Speciality3: qualitySchemaType,
    Speciality4: qualitySchemaType,
}
function buffFilter(b: buff, general: General, score_for: BuffAttributesType,  props: Props, situations?: BuffAdverbArrayType,) {
    const name = general.name;
    let toReturn = false;
    const dragon = props.dragon;
    const beast = props.beast;

    if (b.condition !== undefined && b.condition !== null) {
        const condition: BuffAdverbsType[] = [b.condition].flat();
        if(!dragon) {
            if(condition.includes(BuffAdverbs.enum.dragon_to_the_attack)) {
                return false;
            }
            if(!beast) {
                if(condition.includes(BuffAdverbs.enum.brings_dragon_or_beast_to_attack)) {
                    return false;
                }
            }
        }


        //special case conditions
        if(condition.includes(BuffAdverbs.enum.Reduces_Monster)) {
            if(situations !== null && situations !== undefined && situations.includes(BuffAdverbs.enum.Reduces_Monster)) {
                if(b.attribute === BuffAttributes.enum.Attack && score_for === BuffAttributes.enum.Defense) {
                    return true;
                }
                if((b.attribute === BuffAttributes.enum.Defense || b.attribute === BuffAttributes.enum.HP) &&
                    score_for === BuffAttributes.enum.Attack) {
                    return true;
                }
            }
            return false;
        }
        if(condition.includes(BuffAdverbs.enum.Reduces_Enemy)) {
            if(situations !== null && situations !== undefined && (! (situations.includes(BuffAdverbs.enum.Reduces_Monster) || situations.includes(BuffAdverbs.enum.When_an_officer)))) {
                if(b.attribute === BuffAttributes.enum.Attack && score_for === BuffAttributes.enum.Defense) {
                    return true
                }
                if((b.attribute === BuffAttributes.enum.Defense || b.attribute === BuffAttributes.enum.HP) &&
                    score_for === BuffAttributes.enum.Attack) {
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

    if(general.score_as !== undefined && general.score_as !== null ) {
        const score_as = general.score_as;
        if (b.class !== undefined && b.class !== null){
            const result =  (!b.class.localeCompare(score_as));
            if(!result) {
                return false;
            }
            toReturn = result;
        }
    }

    if(b.attribute !== undefined && b.attribute !== null) {
        toReturn = (!score_for.localeCompare(b.attribute));
    }

    return toReturn;
}

const ascendingLevel: { [key: string]: boolean} = {
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

export function buff(eg: General, situations: BuffAdverbArrayType, props: Props){
    const saLevels = [props.Speciality1, props.Speciality2, props.Speciality3, props.Speciality4]
    let attack = 0;
    let hp = 0;
    let defense = 0;
    let rally = 0;
    let march = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        if(general.books !== undefined && general.books !== null) {
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null && general !== undefined) {
                        let apply = buffFilter(b, general,BuffAttributes.enum.Attack,props, situations );
                        if (apply && b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if((b.condition !== null && b.condition !== undefined) &&
                                (
                                    ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                    ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                )
                            ) {
                                attack = attack + Math.abs(b.value.number);
                            }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                attack = attack + b.value.number
                            }
                        }
                        apply = buffFilter(b,general, BuffAttributes.enum.Defense,props, situations);
                        if (apply && b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if((b.condition !== null && b.condition !== undefined) &&
                                (
                                    ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                    ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                )
                            ) {
                                defense = defense + Math.abs(b.value.number);
                            }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                defense = defense + b.value.number
                            }
                        }
                        apply = buffFilter(b,general, BuffAttributes.enum.HP, props,situations);
                        if (apply && b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                hp = hp + b.value.number
                            }
                        }
                    }
                    
                })
            })
        }

        if(general.specialities !== undefined && general.specialities !== null) {
            general.specialities.forEach((s: specialtyType, i) => {
                s.attribute.map((sa) => {
                    let proceed = false;
                    switch(saLevels[i]){
                        case 'Gold':
                            if(!sa.level.localeCompare('Gold')) {
                                proceed = true;
                                break;
                            }
                        case 'Orange':
                            if(!sa.level.localeCompare('Orange')) {
                                proceed = true;
                                break;
                            }
                        case 'Purple':
                            if(!sa.level.localeCompare('Purple')) {
                                proceed = true;
                                break;
                            }
                        case 'Blue':
                            if(!sa.level.localeCompare('Blue')) {
                                proceed = true;
                                break;
                            }
                        case 'Green':
                            if(!sa.level.localeCompare('Green')) {
                                proceed = true;
                                break;
                            }
                        default:
                            proceed = false;
                    }
                    if(proceed) {
                        const buff: buff[] = [sa.buff].flat()
                        buff.map((b) => {
                            if(b !== undefined && b !== null && general !== undefined) {
                                let apply = buffFilter(b, general,BuffAttributes.enum.Attack,props, situations);
                                if (apply && b.value !== undefined && b.value !== null) {
                                    const buff_type = b.value.unit;
                                    if((b.condition !== null && b.condition !== undefined) &&
                                        (
                                            ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                            ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                        )
                                    ) {
                                        attack = attack + Math.abs(b.value.number);
                                    }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                        attack = attack + b.value.number
                                    }
                                }
                                apply = buffFilter(b,general, BuffAttributes.enum.Defense,props, situations);
                                if (apply && b.value !== undefined && b.value !== null) {
                                    const buff_type = b.value.unit;
                                    if((b.condition !== null && b.condition !== undefined) &&
                                        (
                                            ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                            ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                        )
                                    ) {
                                        defense = defense + Math.abs(b.value.number);
                                    }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                        defense = defense + b.value.number
                                    }
                                }
                                apply = buffFilter(b,general, BuffAttributes.enum.HP, props,situations);
                                if (apply && b.value !== undefined && b.value !== null) {
                                    const buff_type = b.value.unit;
                                    if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                        hp = hp + b.value.number
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

        if(general.ascending !== undefined && general.ascending !== null && ascendingLevel[props.ascending]) {
            general.ascending.map((ga: ascendingIncrementType) => {
                let proceed = false;
                switch(props.ascending) {
                    case '10':
                        if(!ga.level.localeCompare('10')) {
                            proceed = true;
                            break;
                        }
                    case '9':
                        if(!ga.level.localeCompare('9')) {
                            proceed = true;
                            break;
                        }
                    case '8':
                        if(!ga.level.localeCompare('8')) {
                            proceed = true;
                            break;
                        }
                    case '7':
                        if(!ga.level.localeCompare('7')) {
                            proceed = true;
                            break;
                        }
                    case '6':
                        if(!ga.level.localeCompare('6')) {
                            proceed = true;
                            break;
                        }
                    default:
                        proceed = false;
                }
                if(proceed) {
                    const buff: buff[] = [ga.buff].flat();
                    buff.map((b) => {
                        if(b !== undefined && b !== null && general) {
                            let apply = buffFilter(b, general,BuffAttributes.enum.Attack, props,situations);
                            if (apply && b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if((b.condition !== null && b.condition !== undefined) &&
                                    (
                                        ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                        ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                    )
                                ) {
                                    attack = attack + Math.abs(b.value.number);
                                }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    attack = attack + b.value.number
                                }
                            }
                            apply = buffFilter(b,general, BuffAttributes.enum.Defense, props,situations);
                            if (apply && b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if((b.condition !== null && b.condition !== undefined) &&
                                    (
                                        ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                        ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                    )
                                ) {
                                    defense = defense + Math.abs(b.value.number);
                                }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    defense = defense + b.value.number
                                }
                            }
                            apply = buffFilter(b,general, BuffAttributes.enum.HP, props,situations);
                            if (apply && b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    hp = hp + b.value.number
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


    
    return {attackBuff: attack, defenseBuff: defense, hpBuff: hp};
}

