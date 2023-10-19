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
    skillBook,
    type skillBookType,
    type specialtyIncrementType,
    type specialtyType
} from '@schemas/evonySchemas.ts';

function buffFilter(b: buff, general: General,score_for?: BuffAttributesType, situations?: BuffAdverbArrayType) {
    if (b.condition !== undefined && b.condition !== null) {
        if(situations !== null && situations !== undefined && (!(situations.includes(b.condition)))) {
            return false;
        }
    }
    if ((b.class !== undefined && b.class !== null) && score_for !== undefined && score_for !== null) {
        return (!b.class.localeCompare(score_for));
    }
    return false;
}

export function attack_buff(eg: General, situations: BuffAdverbArrayType){
    console.log(`attack_buff`)
    let attack = 0;
    let totalBuff = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        attack = (general.attack + (general.attack_increment * 45 ));
        if(general.specialities !== undefined && general.specialities !== null) {
            console.log(`attack_buff; speciality buffs`)
            general.specialities.map((s: specialtyType) => {
                s.attribute.map((sa) => {
                    const buff: buff[] = [sa.buff].flat()
                    buff.map((b) => {
                        if(b !== undefined && b !== null) {
                            const apply = buffFilter(b, general,BuffAttributes.enum.Attack,situations );
                            if (apply && b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff + b.value.number
                                }
                            }
                        }
                    })
                })
            })
        }
        if(general.books !== undefined && general.books !== null) {
            console.log(`attack_buff; book buffs`)
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const apply = buffFilter(b, general,BuffAttributes.enum.Attack,[
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
                const buff: buff[] = [ga.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const apply = buffFilter(b, general,BuffAttributes.enum.Attack,[
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
