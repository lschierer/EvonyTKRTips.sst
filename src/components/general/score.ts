import {
    buffSchema,
    type buffType, buffTypeEnum,
    buffValueSchema,
    type General
} from '@schemas/evonySchemas.ts';

export function attack_score(eg: General){
    console.log(`attack_score`)
    let attack = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        attack = (general.attack + (general.attack_increment * 45 ));
        general.specialities.map((s) => {
            s.attribute.map((sa) => {
                const buff = [sa.buff].flat()
                buff.map((b) => {
                    if(b.attribute === 'Attack') {
                        let multiplier = 1;
                        if(b.condition !== undefined && b.condition !== null) {
                            if((b.condition === 'Attacking') ||
                                (b.condition === 'Marching') ||
                                (b.condition === 'When Rallying')||
                                (b.condition === 'leading the army to attack')) {
                                console.log(`Attacking buff detected`)
                                switch (general.score_as) {
                                    case 'Ground':
                                    case 'Mounted':
                                    case 'Archers':
                                        console.log(`score_as matched`)
                                        multiplier = 0.5;
                                        break;
                                    case 'Siege':
                                        multiplier = 0.25;
                                        break;
                                    default:
                                        multiplier = 0;
                                }

                            } else if(b.condition === 'Reduces Enemy') {
                                multiplier = 1; // see my explanation
                            } else {
                                multiplier = 0;
                            }
                        }
                        if(b.class !== undefined && b.class !== null) {
                            if (b.class !== 'Ground') {
                                console.log(`class was ${b.class}`)
                                multiplier = 0;
                            }
                        }
                        if(b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if(!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                attack = attack + (attack * (b.value.number * multiplier));
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                attack = attack + attack;
                            }
                        }
                    }
                })
            })
        })
    }
    return attack;
}

export function defense_score(eg: General){
    let defense = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        defense = (eg.defense + (eg.defense_increment * 45))
        eg.specialities.map((s) => {
            s.attribute.map((sa) => {
                const buff = [sa.buff].flat()
                buff.map((b) => {
                    if(b.attribute === 'Defense') {
                        let multiplier = 1;
                        if(b.condition !== undefined && b.condition !== null) {
                            if((b.condition === 'Attacking') ||
                                (b.condition === 'Marching') ||
                                (b.condition === 'When Rallying')||
                                (b.condition === 'leading the army to attack')||
                                (b.condition === 'When an officer')||
                                (b.condition === 'When the Main Defense General')||
                                (b.condition === 'When the City Mayor')||
                                (b.condition === 'Against Monsters')||
                                (b.condition === 'Reduces Monster')||
                                (b.condition === 'During SvS')||
                                (b.condition === 'WHen an officer')) {
                                multiplier = 0;

                            } else if(b.condition === 'Reduces Enemy') {
                                multiplier = 1.5; // see my explanation
                            } else {
                                multiplier = 1;
                            }
                        }
                        if(b.class !== undefined && b.class !== null) {
                            if (b.class !== 'Ground') {
                                multiplier = 0;
                            }
                        }
                        if(b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if(!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                defense = defense + (defense * (b.value.number * multiplier));
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                defense = defense + defense;
                            }
                        }
                    }
                })
            })
        })
    }
    return defense;
}

export function hp_score(eg: General){
    let hp = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        hp = (eg.leadership + (eg.leadership_increment * 45))
        eg.specialities.map((s) => {
            s.attribute.map((sa) => {
                const buff = [sa.buff].flat()
                buff.map((b) => {
                    if(b.attribute === 'HP') {
                        let multiplier = 1;
                        if(b.condition !== undefined && b.condition !== null) {
                            if((b.condition === 'Attacking') ||
                                (b.condition === 'Marching') ||
                                (b.condition === 'When Rallying')||
                                (b.condition === 'leading the army to attack')||
                                (b.condition === 'When an officer')||
                                (b.condition === 'When the Main Defense General')||
                                (b.condition === 'When the City Mayor')||
                                (b.condition === 'Against Monsters')||
                                (b.condition === 'Reduces Monster')||
                                (b.condition === 'During SvS')||
                                (b.condition === 'WHen an officer')) {
                                multiplier = 0;

                            } else if(b.condition === 'Reduces Enemy') {
                                multiplier = 1.5; // see my explanation
                            } else {
                                multiplier = 1;
                            }
                        }
                        if(b.class !== undefined && b.class !== null) {
                            if (b.class !== 'Ground') {
                                multiplier = 0;
                            }
                        }
                        if(b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if(!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                hp = hp + (hp * (b.value.number * multiplier));
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                hp = hp + hp;
                            }
                        }
                    }
                })
            })
        })
    }
    return hp;
}
