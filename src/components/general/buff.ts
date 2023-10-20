import {
    type ascendingAttributesType,
    type ascendingIncrementType,
    type buff,
    BuffAttributes,
    type BuffAdverbsType,
    type BuffAdverbArrayType,
    type BuffAttributesType,
    buffSchema,
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
    type qualitySchemaType
} from '@schemas/evonySchemas.ts';

interface Props {
    ascending: levelSchemaType,
    Speciality1: qualitySchemaType,
    Speciality2: qualitySchemaType,
    Speciality3: qualitySchemaType,
    Speciality4: qualitySchemaType,
}
function buffFilter(b: buff, score_as: troopClassType, score_for: BuffAttributesType, situations?: BuffAdverbArrayType) {
    console.log(`bufFilter start ----${JSON.stringify(b)}----`)
    let toReturn = false;

    if (b.condition !== undefined && b.condition !== null) {
        console.log(`buffFilter; condition ${b.condition}`)
        const condition: BuffAdverbsType[] = [b.condition].flat();
        if(situations !== null && situations !== undefined && condition !== null && condition !== undefined) {
            const intersection = situations.filter(x => condition.includes(x));
            if (condition.length > intersection.length) {
                return false;
            }
        } else {
            toReturn = true;
        }
    }
    console.log(`buffFilter; after first if, return value ${toReturn}`)

    if (b.class !== undefined && b.class !== null){
        console.log(`buffFilter; class ${b.class} score_as ${JSON.stringify(score_as)}`)
        const result =  (!b.class.localeCompare(score_as));
        if(!result) {
            return false;
        }
        toReturn = result;
    }


    if(b.attribute !== undefined && b.attribute !== null) {
        console.log(`buffFilter; checking attribute ${b.attribute}`)
        toReturn = (!score_for.localeCompare(b.attribute));
    }
    console.log(`buffFilter; after 2nd if, return value ${toReturn}`)




    console.log(`buffFilter; after 3rd if, return value ${toReturn}`)

    return toReturn;
}

export function attack_buff(eg: General, situations: BuffAdverbArrayType, props: Props){
    const saLevels = [props.Speciality1, props.Speciality2, props.Speciality3, props.Speciality4]
    console.log(`attack_buff; general is ${eg.name}`)
    let attack = 0;
    let totalBuff = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        if(general.specialities !== undefined && general.specialities !== null) {
            console.log(`attack_buff; speciality buffs;`)
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
                        console.log(`attack_buff; speciality buffs; i is ${i} proceed on ${sa.level}`)
                        const buff: buff[] = [sa.buff].flat()
                        buff.map((b) => {
                            if(b !== undefined && b !== null && general.score_as !== undefined) {
                                const apply = buffFilter(b, general.score_as,BuffAttributes.enum.Attack,situations);
                                console.log(`attack_buff; speciality buffs; apply is ${apply}`);
                                if (apply && b.value !== undefined && b.value !== null) {
                                    const buff_type = b.value.unit;
                                    if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                        totalBuff = totalBuff + b.value.number
                                        console.log(`attack_buff; specialities; total: ${totalBuff}`)
                                    }
                                }
                            } else {
                                console.log(`attack_buff; speciality buffs; buff is undefined`)
                            }
                        })
                    } else {
                        console.log(`attack_buff; speciality buffs; i is ${i} ${saLevels[i]} did not match ${sa.level}`)
                    }

                })
            })
        }
        if(general.books !== undefined && general.books !== null) {
            console.log(`attack_buff; book buffs`)
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null && general.score_as !== undefined) {
                        const apply = buffFilter(b, general.score_as,BuffAttributes.enum.Attack,[
                            'Attacking',
                            'Marching',
                            'When Rallying',
                            'leading the army to attack',
                            'Reinforcing',
                            'Defending',
                        ] );
                        if (apply && b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + b.value.number
                            }
                        }
                    }

                })
            })
        }
        if(general.ascending !== undefined && general.ascending !== null) {
            console.log(`attack_buff; ascending buffs`);
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
                        if(b !== undefined && b !== null && general.score_as) {
                            const apply = buffFilter(b, general.score_as,BuffAttributes.enum.Attack,[
                                'Attacking',
                                'Marching',
                                'When Rallying',
                                'leading the army to attack',
                                'Reinforcing',
                                'Defending',
                            ] );
                            if (apply && b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff + b.value.number
                                }
                            }
                        }
                    })
                }

            })
        }
    }
    console.log(`attack_buff; total buff is ${totalBuff}`)
    
    return totalBuff;
}
/*
export function defense_score(eg: General){
    let defense = 0;
    let totalBuff = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        defense = (general.defense + (general.defense_increment * 45))
        if(general.specialities !== undefined && general.specialities !== null) {
            general.specialities.map((s: specialtyType) => {
                s.attribute.map((sa: specialtyIncrementType) => {
                    const buff: buff[] = [sa.buff].flat()
                    buff.map((b) => {
                        if (b.condition !== undefined && b.condition !== null) {
                            const m = multiplier(b, general, BuffAttributes.enum.Defense);
                            if (b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff + (b.value.number * m);
                                } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                    defense = defense + b.value.number;
                                }
                            }
                        }
                    })

                })
            })
        }
        if(general.books !== undefined && general.books !== null) {
            console.log(`book buffs`)
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.Defense);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                defense = defense + b.value.number;
                            }
                        }
                    }

                })
            })
        }
        if(general.ascending !== undefined && general.ascending !== null) {
            console.log(`ascending buffs`);
            general.ascending.map((ga: ascendingIncrementType) => {
                const buff: buff[] = [ga.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.Defense);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                defense = defense + b.value.number;
                            }
                        }
                    }
                })
            })
        }
    }
    console.log(`total buff is ${totalBuff}`)
    totalBuff = totalBuff / 100; //make it a percent;
    defense = defense + (defense * totalBuff );
    return [totalBuff,defense];
}
export function hp_score(eg: General){
    let hp = 0;
    let totalBuff = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        hp = (general.leadership + (general.leadership_increment * 45))
        if(general.specialities !== undefined && general.specialities !== null) {
            general.specialities.map((s) => {
                s.attribute.map((sa) => {
                    const buff = [sa.buff].flat()
                    buff.map((b) => {
                        if (b.condition !== undefined && b.condition !== null) {
                            const m = multiplier(b, general, BuffAttributes.enum.Attack);
                            if (b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff + (b.value.number * m);
                                } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                    hp = hp + b.value.number;
                                }
                            }
                        }
                    })

                })
            })
        }
        if(general.books !== undefined && general.books !== null) {
            console.log(`book buffs`)
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.HP);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                hp = hp + b.value.number;
                            }
                        }
                    }

                })
            })
        }
        if(general.ascending !== undefined && general.ascending !== null) {
            console.log(`ascending buffs`);
            general.ascending.map((ga: ascendingIncrementType) => {
                const buff: buff[] = [ga.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.HP);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                hp = hp + b.value.number;
                            }
                        }
                    }
                })
            })
        }
    }
    console.log(`total buff is ${totalBuff}`)
    totalBuff = totalBuff / 100; //make it a percent;
    hp = hp + (hp * totalBuff );
    return [totalBuff,hp];
}
*/
