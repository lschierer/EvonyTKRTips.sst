import {
    type General
} from '@schemas/evonySchemas.ts';

export function attack_score(eg: General){
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
                                switch (general.score_as) {
                                    case 'Ground':
                                    case 'Mounted':
                                    case 'Archers':
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
                                multiplier = 0;
                            }
                        }
                        if(b.value[2] === 'percentage') {
                            attack = attack + (attack * (b.value[1] * multiplier));
                        } else if( b.value[2] === 'flat' && multiplier) {
                            attack = attack + b.value[1];
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
                        if(b.value[2] === 'percentage') {
                            defense = defense + (defense * (b.value[1] * multiplier));
                        } else if( b.value[2] === 'flat' && multiplier) {
                            defense = defense + b.value[1];
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
                        if(b.value[2] === 'percentage') {
                            hp = hp + (hp * (b.value[1] * multiplier));
                        } else if( b.value[2] === 'flat' && multiplier) {
                            hp = hp + b.value[1];
                        }
                    }
                })
            })
        })
    }
    return hp;
}
