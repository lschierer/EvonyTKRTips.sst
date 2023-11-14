import { css, html, type CSSResultArray, type PropertyValueMap, type TemplateResult, nothing } from "lit";
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';

import { withStores } from "@nanostores/lit";



const DEBUG = true;


import { SpectrumElement } from '@spectrum-web-components/base';

import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/help-text/sp-help-text.js';
import '@spectrum-web-components/menu/sp-menu-divider.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/number-field/sp-number-field.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/split-view/sp-split-view.js';
import '@spectrum-web-components/status-light/sp-status-light.js';
import '@spectrum-web-components/switch/sp-switch.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import { NumberField } from '@spectrum-web-components/number-field';
import { Picker } from '@spectrum-web-components/picker';
import { Switch } from '@spectrum-web-components/switch';




import {addValue, formValues } from '../formValueStore';

export class MarchCalc extends withStores(SpectrumElement, [formValues]) {

    connectedCallback(): void {
        super.connectedCallback();

        formValues.subscribe((fv) => {
            if(DEBUG) {console.log(`index formValues subscribe`) }
        })
    }
  
    @state()
    private baseMarch: number = 0;

    @state()
    private rallySpotSize = 1;

    @state()
    private TH_S3: boolean = false;

    @state()
    private TH_S4: boolean = false;

    static RallySpotSize = new Map(Object.entries({
        1:800,
        2:1200,
        3:2000,
        4:3200,
        5:4600,
        6:6400,
        7:8400,
        8:10800,
        9:13600,
        10:16600,
        11:20000,
        12:23600,
        13:27600,
        14:32000,
        15:36600,
        16:41600,
        17:46800,
        18:52400,
        19:58400,
        20:64600,
        21:71200,
        22:78000,
        23:85200,
        24:92800,
        25:100000,
        26:110000,
        27:125000,
        28:145000,
        29:170000,
        30:200000,
        31:225000,
        32:250000,
        33:285000,
        34:315000,
        35:350000,
        36:385000,
        37:420000,
        38:460000,
        39:500000,
        40:550000,
        41:600000,
        42:660000,
        43:720000,
        44:790000,
        45:860000,
    }))
    
    static WarHorn = new Map(Object.entries({
        0:0,
        1:2000,
        2:4000,
        3:6000,
        4:8000,
        5:10400,
        6:13200,
        7:16400,
        8:20000,
        9:24000,
        10:28400,
        11:33200,
        12:38400,
        13:44000,
        14:50000,
        15:60000,
    }))

    static Rank = new Map(Object.entries({
        'knight':   5000,
        'baron':    10000,
        'viscount': 15000,
        'earl':     20000,
        'duke':     30000,
        'archduke': 50000,
        'regent':   100000,
    }))

    static VIP = new Map(Object.entries({
        0:       0,
        4:    4000,
        5:    6000,
        6:    8000,
        7:   10000,
        8:   10000,
        9:   10000,
        10:  10000,
        11:  10000,
        12:  10000,
        13:  10000,
        14:  15000,
        15:  20000,
        16:  30000,
        17:  35000,
        18:  40000,
        19:  45000,
        20:  50000,
        21:  72000,
        22:  94000,
        23: 116000,
        24: 138000,
        25: 160000,
    }))

    static DutyOfficer = new Map(Object.entries({
        'Junior': {
            p: 0.05,
            s: 0,
        },
        'Medium': {
            p: 0.1,
            s: 0,
        },
        'Senior': {
            p: 0.15,
            s: 20000,
        },
        'Special': {
            p: 0.25,
            s: 50000,
        },
        'Super': {
            p: 0.30,
            s: 70000,
        }
    }))

    static ImperialSeat = new Map(Object.entries({
        0: 0,
        1: 0.03,
        2: 0.075,
        3: 0.15,
        4: 0.225,
        5: 0.3,
    }))

    static Research = new Map(Object.entries({
        "Military": {
            'Coordination': {
                0:    0,
                1: 1000,
                2: 2000,
                3: 3000,
                4: 4000,
                5: 5000,
                6: 6000,
                7: 7000,
                8: 8000,
                9: 9000,
                10: 10000
            },
            'AdvancedCordination' : {
                0:  0,
                1:  0.01,
                2:  0.10,
                3:  0.15,
                4:  0.20,
                5:  0.25,
                6:  0.30,
                7:  0.35,
                8:  0.40,
                9:  0.45,
                10: 0.50,
                11: 0.55,
                12: 0.60,
                13: 0.65,
                14: 0.70,
                15: 0.75,
                16: 0.80,
                17: 0.85,
                18: 0.90,
                19: 0.95,
                20: 1.00,              
            },
            'SuperCoordination' : {
                0:      0,
                1:   9250,
                2:   9500,
                3:   9750,
                4:  10000,
                5:  12500,
                6:  15000,
                7:  17500,
                8:  20000,
                9:  22500,
                10: 25000,
                11: 27500,
                12: 30000,
                13: 32500,
                14: 35000,
                15: 37500,
                16: 40000,
                17: 42500,
                18: 45000,
                19: 47500,
                20: 50000,
            },
            'SupremeCoordination' : {
                0:  0,
                1:  0.01,
                2:  0.05125,
                3:  0.09250,
                4:  0.13375,
                5:  0.17500,
                6:  0.21625,
                7:  0.25750,
                8:  0.29875,
                9:  0.34000,
                10: 0.38125,
                11: 0.42250,
                12: 0.46375,
                13: 0.50500,
                14: 0.54625,
                15: 0.58750,
                16: 0.62875,
                17: 0.67000,
                18: 0.71125,
                19: 0.75250,
                20: 0.79375,
                21: 0.83500,
                22: 0.87625,
                23: 0.91750,
                24: 0.95875,
                25: 1.00000,
                
            }
        },
        'MilitaryAdvance': {
            'Prestige': {
                0:      0,
                1:   2500,
                2:   5000,
                3:   7500,
                4:  10000,
                5:  12500,
                6:  15000,
                7:  17500,
                8:  20000,
                9:  22500,
                10: 25000,
                11: 27500,
                12: 30000,
                13: 32500,
                14: 35000,
                15: 37500,
                16: 40000,
                17: 42500,
                18: 45000,
                19: 47500,
                20: 50000,
            },
            'AdvancedPrestige': {
                0:       0,
                1:    4000,
                2:    8000,
                3:   12000,
                4:   16000,
                5:   20000,
                6:   24000,
                7:   28000,
                8:   32000,
                9:   36000,
                10:  40000,
                11:  44000,
                12:  48000,
                13:  52000,
                14:  56000,
                15:  60000,
                16:  64000,
                17:  68000,
                18:  72000,
                19:  76000,
                20:  80000,
                21:  84000,
                22:  88000,
                23:  92000,
                24:  96000,
                25: 100000,
            },
        },
        'MilitaryAcademy': {
            'Strike I': {
                0: 0,
                1: 0.005
            }
        }
    }))

    static idealLand = new Map(Object.entries({
        'RoseSpring': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'DrinkingFountain': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'Crane': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'RedDemon': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'Gondola': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'HeavenlyFire': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'Fountain': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'Windmill': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'Banquet': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'StMartin': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
        'Dracula': {
            1:   250,
            2:   500,
            3:   750,
            4:  1000,
            5:  1500,
            6:  2000,
            7:  2500,
            8:  3000,
            9:  4000,
            10: 5000,
        },
    }));

    protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        if(DEBUG) {console.log(`index willupdate`)}
        super.willUpdate(_changedProperties);
        if(formValues.value !== null && formValues.value !== undefined) {
            const base = formValues.value.get('keepSize')
            if(base !== undefined) {
                this.rallySpotSize = base as number;
                if(DEBUG) {console.log(`rs size is ${this.rallySpotSize}`)}
                if(this.rallySpotSize < 35) {
                    this.TH_S3 = false;
                    this.TH_S4 = false;
                } 
                this.baseMarch = (MarchCalc.RallySpotSize.get(base.toString()) !== undefined) ? (MarchCalc.RallySpotSize.get(base.toString()) as number) : 800;
                const mathBase = this.baseMarch;
                const imperialSeat = formValues.value.get('ImperialSeat');
                if(imperialSeat !== undefined) {
                    this.baseMarch = this.baseMarch + mathBase * ((MarchCalc.ImperialSeat.get(imperialSeat.toString()) !== undefined) ? (MarchCalc.ImperialSeat.get(imperialSeat.toString()) as number): 0)
                }
                const horn = formValues.value.get('WarHorn');
                if(horn !== undefined) {
                    this.baseMarch = this.baseMarch + ((MarchCalc.WarHorn.get(horn.toString()) !== undefined) ? (MarchCalc.WarHorn.get(horn.toString()) as number) : 0)
                }
                const VIP = formValues.value.get('VIP');
                if(VIP !== undefined) {
                    this.baseMarch = this.baseMarch + ((MarchCalc.VIP.get(VIP.toString()) !== undefined) ? (MarchCalc.VIP.get(VIP.toString())as number) : 0)
                }
                const rank = formValues.value.get('rank');
                if(rank !== undefined) {
                    if(!(rank as string).localeCompare('knight')){
                        if(DEBUG) {console.log(`${(MarchCalc.Rank.get(rank as string)! as number)}`)}
                        this.baseMarch = this.baseMarch + (MarchCalc.Rank.get(rank as string)! as number)
                    } else if(!(rank as string).localeCompare('baron')){
                        this.baseMarch = this.baseMarch + (MarchCalc.Rank.get(rank as string))! 
                    } else if(!(rank as string).localeCompare('viscount')){
                        this.baseMarch = this.baseMarch + (MarchCalc.Rank.get(rank as string))! 
                    } else if(!(rank as string).localeCompare('earl')){
                        this.baseMarch = this.baseMarch + (MarchCalc.Rank.get(rank as string))! 
                    } else if(!(rank as string).localeCompare('duke')){
                        this.baseMarch = this.baseMarch + (MarchCalc.Rank.get(rank as string))! 
                    } else if(!(rank as string).localeCompare('archduke')){
                        this.baseMarch = this.baseMarch + (MarchCalc.Rank.get(rank as string))! 
                    } else if(!(rank as string).localeCompare('regent')){
                        this.baseMarch = this.baseMarch + (MarchCalc.Rank.get(rank as string))! 
                    }
                }
                let r = formValues.value.get('Coordination');
                if(r !== undefined && (r as number) > 0) {
                    if(DEBUG) {console.log(`Coordination r is ${r}`)}
                    let v = Object.values(MarchCalc.Research.get('Military')!.Coordination!)[(r as number )] as number
                    if(DEBUG) {console.log(`Coordination v is ${v}`)}
                    if(v !== undefined) {
                        this.baseMarch = this.baseMarch + v;
                    }
                }
                r = formValues.value.get('AdvCoordination');
                if(r !== undefined && (r as number) > 0) {
                    if(DEBUG) {console.log(`AdvCoordination r is ${r}`)}
                    let v = Object.values(MarchCalc.Research.get('Military')!.AdvancedCordination!)[(r as number )] as number
                    if(DEBUG) {console.log(`AdvCoordination v is ${v}`)}
                    if(v !== undefined) {
                        this.baseMarch = this.baseMarch + mathBase * v;
                    }
                }
                r = formValues.value.get('SuperCoordination');
                if(r !== undefined && (r as number) > 0) {
                    if(DEBUG) {console.log(`SuperCoordination r is ${r}`)}
                    let v = Object.values(MarchCalc.Research.get('Military')!.SuperCoordination!)[(r as number )] as number
                    if(DEBUG) {console.log(`SuperCoordination v is ${v}`)}
                    if(v !== undefined) {
                        this.baseMarch = this.baseMarch + v;
                    }
                }
                r = formValues.value.get('SuprCoordination');
                if(r !== undefined && (r as number) > 0) {
                    if(DEBUG) {console.log(`SuprCoordination r is ${r}`)}
                    let v = Object.values(MarchCalc.Research.get('Military')!.SupremeCoordination!)[(r as number )] as number
                    if(DEBUG) {console.log(`SuprCoordination v is ${v}`)}
                    if(v !== undefined) {
                        this.baseMarch = this.baseMarch + mathBase * v;
                    }
                }
                r = formValues.value.get('Prestige');
                if(r !== undefined && (r as number) > 0) {
                    if(DEBUG) {console.log(`Prestige r is ${r}`)}
                    let v = Object.values(MarchCalc.Research.get('MilitaryAdvance')!.Prestige!)[(r as number )] as number
                    if(DEBUG) {console.log(`Prestige v is ${v}`)}
                    if(v !== undefined) {
                        this.baseMarch = this.baseMarch + v;
                    }
                }
                r = formValues.value.get('AdvPrestige');
                if(r !== undefined && (r as number) > 0) {
                    if(DEBUG) {console.log(`AdvPrestige r is ${r}`)}
                    let v = Object.values(MarchCalc.Research.get('MilitaryAdvance')!.AdvancedPrestige!)[(r as number )] as number
                    if(DEBUG) {console.log(`AdvPrestige v is ${v}`)}
                    if(v !== undefined) {
                        this.baseMarch = this.baseMarch + v;
                    }
                }
                r = formValues.value.get('Olevel');
                if(r !== undefined) {
                    if(!(r as string).localeCompare('Junior')) {
                        this.baseMarch = this.baseMarch + mathBase * 0.05;
                    } else if (!(r as string).localeCompare('Medium')) {
                        this.baseMarch = this.baseMarch + mathBase * 0.1;
                    } else if (!(r as string).localeCompare('Senior')) {
                        this.baseMarch = this.baseMarch + 20000 + mathBase * 0.15;
                    } else if (!(r as string).localeCompare('Special')) {
                        this.baseMarch = this.baseMarch + 50000 + mathBase * 0.25;
                    } else if (!(r as string).localeCompare('Super')) {
                        this.baseMarch = this.baseMarch + 70000 + mathBase * 0.3;
                    }
                }
                if(this.rallySpotSize >= 11) {
                    r = formValues.value.get('Banquet');
                    if(r !== undefined) {
                        if(!(r as string).localeCompare('true')){
                            let r2 = formValues.value.get('BNF');
                            if(r2 !== undefined){
                                if(DEBUG) {console.log(`i il bnf r2 defined ${r2 as number}`)}
                                this.baseMarch = this.baseMarch + Object.values(MarchCalc.idealLand.get('Banquet')!)[(r2 as number)-1]
                            } else {
                                if(DEBUG) {console.log(`i il bnf r2 else`)}
                                addValue('BNF', 1)
                            }
                        } else {
                            addValue('BNF', '1');    
                        }
                    } else {
                        addValue('BNF', '1');
                    }
                } else {
                    addValue('Banquet', 'false')
                    addValue('BNF', '1');
                }
                if(this.rallySpotSize >= 35) {
                    r = formValues.value.get('Hideyoshi')
                    if(r !== undefined) {
                        if(!(r as string).localeCompare('checked')) {
                            this.baseMarch = this.baseMarch + mathBase * 0.05;
                            let r2 = formValues.value.get('TH_S3');
                            this.TH_S3 = true;
                            if(r2 !== undefined) {
                                if(!(r2 as string).localeCompare('Green')) {
                                    this.baseMarch = this.baseMarch + mathBase * 0.01;
                                    this.TH_S4 = false;
                                } else if(!(r2 as string).localeCompare('Blue')) {
                                    this.baseMarch = this.baseMarch + mathBase * 0.02;
                                    this.TH_S4 = false;
                                } else if(!(r2 as string).localeCompare('Purple')) {
                                    this.baseMarch = this.baseMarch + mathBase * 0.03;
                                    this.TH_S4 = false;
                                } else if(!(r2 as string).localeCompare('Orange')) {
                                    this.baseMarch = this.baseMarch + mathBase * 0.04;
                                    this.TH_S4 = false;
                                } else if(!(r2 as string).localeCompare('Gold')) {
                                    this.baseMarch = this.baseMarch + mathBase * 0.06;
                                    this.TH_S4 = true;
                                    let r3 = formValues.value.get('TH_S4');
                                    if(r3 !== undefined) {
                                        if(!(r3 as string).localeCompare('Green')) {
                                            this.baseMarch = this.baseMarch + mathBase * 0.01;
                                        } else if(!(r3 as string).localeCompare('Blue')) {
                                            this.baseMarch = this.baseMarch + mathBase * 0.02;
                                        } else if(!(r3 as string).localeCompare('Purple')) {
                                            this.baseMarch = this.baseMarch + mathBase * 0.04;
                                        } else if(!(r3 as string).localeCompare('Orange')) {
                                            this.baseMarch = this.baseMarch + mathBase * 0.06;
                                        } else if(!(r3 as string).localeCompare('Gold')) {
                                            this.baseMarch = this.baseMarch + mathBase * 0.1;
                                        }
                                    }
                                } else {
                                    this.TH_S4 = false;
                                }
                            }
                        }
                    }
                } else {
                        this.TH_S3 = false;
                        this.TH_S4 = false;
                }
            } else {
                addValue('keepSize',1);
                this.baseMarch = MarchCalc.RallySpotSize.get('1') as number;
            }
        } else {
            addValue('keepSize',1);
        }
        if(this.TH_S3 === false) {
            this.TH_S4 = false;
        }
    }

    public static override get styles(): CSSResultArray {
        const localstyle = css`
            div.CalcSettings {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

            }
            div.CalcResult {
                border-top: solid 1px var(--sl-color-accent-low); 
            }
            span.ClassResult {
                font-weight: bold;
            }
            div.vertical {
                display: flex;
                flex-direction: column;
            }
          `
        if (super.styles !== null && super.styles !== undefined) {
          return [super.styles, localstyle];
        } else return [localstyle];
    
      }

      protected render() {
        const sr = super.render()

        return html`${sr}<br/>
        <div class="not-content MarchSizeCalc">
            <div class="not-content CalcSettings">
                <div>
                    <sp-field-label for="VIP"  >Your VIP Level</sp-field-label>
                    <sp-number-field
                    id="VIP"
                    value="0"
                    min="0"
                    max="25"
                    format-options='{
                        "signDisplay": "never",
                        "maximumFractionDigits": 0
                    }'
                    @change=${(e: CustomEvent) => {addValue("VIP", (e.target as NumberField).value); this.requestUpdate();}}
                    />
                </div>
                <div>
                    <sp-field-label for="rank" size="s" >Your Rank</sp-field-label>
                    <sp-picker id="rank" size="s" label="pick one" 
                        @change=${(e: CustomEvent) => {addValue("rank", (e.target as Picker).value); this.requestUpdate();}}>
                        <sp-menu-item value="knight"  >Knight</sp-menu-item>
                        <sp-menu-item value="baron"   >Baron</sp-menu-item>
                        <sp-menu-item value="viscount">Viscount</sp-menu-item>
                        <sp-menu-item value="earl"    >Earl</sp-menu-item>
                        <sp-menu-item value="duke"    >Duke</sp-menu-item>
                        <sp-menu-item value="archduke">Arch-Duke</sp-menu-item>
                        <sp-menu-item value="regent"  >Regent</sp-menu-item>
                    </sp-picker>
                </div>
                <div>
                    <sp-field-label for="ImperialSeat"  >Imerperial Seat<br/>Civilization Treasure</sp-field-label>
                    <sp-number-field
                    id="ImperialSeat"
                    value="0"
                    min="0"
                    max="5"
                    format-options='{
                        "signDisplay": "never",
                        "maximumFractionDigits": 0
                    }'
                    @change=${(e: CustomEvent) => {addValue("ImperialSeat", (e.target as NumberField).value); this.requestUpdate();}}
                    ></sp-number-field>
                </div>
                <div>
                    <sp-field-label for="keepSize"  >Rally Spot Level</sp-field-label>
                    <sp-number-field
                    id="keepSize"
                    value="1"
                    min="1"
                    max="45"
                    format-options='{
                        "signDisplay": "never",
                        "maximumFractionDigits": 0
                    }'
                    @change=${(e: CustomEvent) => {addValue("keepSize", (e.target as NumberField).value); this.requestUpdate();}}
                    ></sp-number-field>
                </div>
                <div>
                    <sp-field-label for="WarHorn"  >Monarch War Horn Level</sp-field-label>
                    <sp-number-field
                    id="WarHorn"
                    value="0"
                    min="0"
                    max="15"
                    format-options='{
                        "signDisplay": "never",
                        "maximumFractionDigits": 0
                    }'
                    @change=${(e: CustomEvent) => {addValue("WarHorn", (e.target as NumberField).value); this.requestUpdate();}}
                    />
                </div>
                <div>
                    <sp-field-label for="dutyOfficer">Duty Officer</sp-field-label>
                    <sp-field-group horizontal id="dutyOfficer">
                    <div>
                        <sp-field-label for="Olevel" size="s" >Rally Spot Duty Officer Rank</sp-field-label>
                        <sp-picker id="Olevel" size="s" label="pick one" 
                            @change=${(e: CustomEvent) => {addValue("Olevel", (e.target as Picker).value); this.requestUpdate();}}>
                            <sp-menu-item value="Junior"  >Junior</sp-menu-item>
                            <sp-menu-item value="Medium"  >Medium</sp-menu-item>
                            <sp-menu-item value="Senior"  >Senior</sp-menu-item>
                            <sp-menu-item value="Special" >Special</sp-menu-item>
                            <sp-menu-item value="Super"   >Super</sp-menu-item>
                        </sp-picker>
                    </div>
                    <div>
                        <sp-switch 
                            emphasized 
                            id="Hideyoshi" 
                            value="off" 
                            @change=${(e: CustomEvent) => {addValue("Hideyoshi", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                            disabled="${(this.rallySpotSize >= 35) ? nothing : true}"
                            >Toyotomi Hideyoshi is your Rally Spot Duty Officer</sp-switch>
                        <sp-field-label for="TH_S3" size="s" >Toyotomi Hideyoshi's Speciality 3</sp-field-label>
                        <sp-picker id="TH_S3" size="s" label="pick one" 
                            @change=${(e: CustomEvent) => {addValue("TH_S3", (e.target as Picker).value); this.requestUpdate();}}
                            disabled="${this.TH_S3? nothing : true}"
                            >
                            <sp-menu-item value="Green"  >Green</sp-menu-item>
                            <sp-menu-item value="Blue"   >Blue</sp-menu-item>
                            <sp-menu-item value="Purple" >Purple</sp-menu-item>
                            <sp-menu-item value="Orange" >Orange</sp-menu-item>
                            <sp-menu-item value="Gold"   >Gold</sp-menu-item>
                        </sp-picker>
                        <sp-field-label for="TH_S4" size="s" >Toyotomi Hideyoshi's Speciality 4</sp-field-label>
                        <sp-picker id="TH_S4" size="s" label="pick one" 
                            @change=${(e: CustomEvent) => {addValue("TH_S4", (e.target as Picker).value); this.requestUpdate();}}
                            disabled="${this.TH_S4? nothing : true}"
                            >
                            <sp-menu-item value="Green"  >Green</sp-menu-item>
                            <sp-menu-item value="Blue"   >Blue</sp-menu-item>
                            <sp-menu-item value="Purple" >Purple</sp-menu-item>
                            <sp-menu-item value="Orange" >Orange</sp-menu-item>
                            <sp-menu-item value="Gold"   >Gold</sp-menu-item>
                        </sp-picker>
                    </div>
                    </sp-field-group>
                </div>
                <div>
                    <sp-field-label for="land">Ideal Land Buffs</sp-field-label>
                    <sp-field-group horizontal id="land">
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="Banquet" 
                                checked="${((formValues.value!.get('Banquet') !== undefined) && (!(formValues.value!.get('Banquet') as string).localeCompare('true'))) ? formValues.value!.get('Banquet') : nothing}"
                                @change=${(e: CustomEvent) => {addValue("Banquet", (e.target as Switch).checked? 'true': 'false'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Banquet of Dionysus</sp-switch>
                            <sp-number-field
                                id="BNF"
                                value="${(formValues.value!.get('BNF') !== undefined) ? formValues.value!.get('BNF') : 1}"
                                min="1"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('Banquet') !== undefined && (!(formValues.value?.get('Banquet') as string).localeCompare('true'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("BNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="Crane" 
                                checked="${((formValues.value!.get('Crane') !== undefined) && (!(formValues.value!.get('Crane') as string).localeCompare('true'))) ? formValues.value!.get('Crane') : nothing}"
                                @change=${(e: CustomEvent) => {addValue("Crane", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Crane Pavilion</sp-switch>
                            <sp-number-field
                                id="CNF"
                                value="${(formValues.value!.get('CNF') !== undefined) ? formValues.value!.get('CNF') : 1}"
                                min="1"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('Crane') !== undefined && (!(formValues.value?.get('Crane') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("CNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="Dracula" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("Dracula", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Dracula Haunting Night</sp-switch>
                            <sp-number-field
                                id="DNF"
                                value="${(formValues.value!.get('DNF') !== undefined) ? formValues.value!.get('DNF') : 1}"
                                min="1"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('Dracula') !== undefined && (!(formValues.value?.get('Dracula') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("DNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="DrinkingFountain" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("DrinkingFountain", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Drinking Fountain</sp-switch>
                            <sp-number-field
                                id="DFNF"
                                value="${(formValues.value!.get('DFNF') !== undefined) ? formValues.value!.get('DFNF') : 1}"
                                min="1"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('DrinkingFountain') !== undefined && (!(formValues.value?.get('DrinkingFountain') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("DFNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="Fountain" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("Fountain", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Fountain</sp-switch>
                            <sp-number-field
                                id="FNF"
                                value="${(formValues.value!.get('FNF') !== undefined) ? formValues.value!.get('FNF') : 1}"
                                min="1"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('Fountain') !== undefined && (!(formValues.value?.get('Fountain') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("FNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="Gondola" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("Gondola", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Gondola</sp-switch>
                            <sp-number-field
                                id="GNF"
                                value="${(formValues.value!.get('GNF') !== undefined) ? formValues.value!.get('GNF') : 0}"
                                min="0"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('Gondola') !== undefined && (!(formValues.value?.get('Gondola') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("GNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="HeavenlyFire" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("HeavenlyFire", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Heavenly Fire Altar</sp-switch>
                            <sp-number-field
                                id="HFANF"
                                value="${(formValues.value!.get('HFANF') !== undefined) ? formValues.value!.get('HFANF') : 0}"
                                min="0"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('HeavenlyFire') !== undefined && (!(formValues.value?.get('HeavenlyFire') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("HFANF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="RedDemon" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("RedDemon", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Red Demon Statue</sp-switch>
                            <sp-number-field
                                id="RDSNF"
                                value="${(formValues.value!.get('RDSNF') !== undefined) ? formValues.value!.get('RDSNF') : 0}"
                                min="0"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('RedDemon') !== undefined && (!(formValues.value?.get('RedDemon') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("RDSNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="RoseSpring" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("RoseSpring", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Rose Spring</sp-switch>
                            <sp-number-field
                                id="RSNF"
                                value="${(formValues.value!.get('RSNF') !== undefined) ? formValues.value!.get('RSNF') : 0}"
                                min="0"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('RoseSpring') !== undefined && (!(formValues.value?.get('RoseSpring') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("RSNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="StMartin" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("StMartin", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >St. Martin the White Knight</sp-switch>
                            <sp-number-field
                                id="SMNF"
                                value="${(formValues.value!.get('SMNF') !== undefined) ? formValues.value!.get('SMNF') : 0}"
                                min="0"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('StMartin') !== undefined && (!(formValues.value?.get('StMartin') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("SMNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                        <div class="not-content vertical">
                            <sp-switch 
                                emphasized 
                                id="Windmill" 
                                value="off" 
                                @change=${(e: CustomEvent) => {addValue("Windmill", (e.target as Switch).checked? 'checked': 'unchecked'); this.requestUpdate();}}
                                disabled="${(this.rallySpotSize >= 11) ? nothing : true}"
                            >Windmill</sp-switch>
                            <sp-number-field
                                id="WNF"
                                value="${(formValues.value!.get('WNF') !== undefined) ? formValues.value!.get('WNF') : 0}"
                                min="0"
                                max="10"
                                format-options='{
                                    "signDisplay": "never",
                                    "maximumFractionDigits": 0
                                }'
                                disabled="${(formValues.value?.get('Windmill') !== undefined && (!(formValues.value?.get('Windmill') as string).localeCompare('checked'))) ? nothing : true}"
                                @change=${(e: CustomEvent) => {addValue("WNF", (e.target as NumberField).value); this.requestUpdate();}}
                            ></sp-number-field>
                        </div>
                    </sp-field-group>
                </div>
                <div>
                    <sp-field-label for="research"  >Research</sp-field-label>
                    <sp-help-text size="m">For each, select the highest level of research completed.</sp-help-text>
                    <sp-field-group horizontal id="research">
                    <div>
                        <sp-field-label for="Coordination"  >Military: Coordination</sp-field-label>
                        <sp-number-field
                        id="Coordination"
                        value="0"
                        min="0"
                        max="10"
                        format-options='{
                            "signDisplay": "never",
                            "maximumFractionDigits": 0
                        }'
                        @change=${(e: CustomEvent) => {addValue("Coordination", (e.target as NumberField).value); this.requestUpdate();}}
                        />
                    </div>
                    <div>
                        <sp-field-label for="AdvCoordination"  >Military: Advanced Coordination</sp-field-label>
                        <sp-number-field
                        id="AdvCoordination"
                        value="0"
                        min="0"
                        max="20"
                        format-options='{
                            "signDisplay": "never",
                            "maximumFractionDigits": 0
                        }'
                        @change=${(e: CustomEvent) => {addValue("AdvCoordination", (e.target as NumberField).value); this.requestUpdate();}}
                        />
                    </div>
                    <div>
                        <sp-field-label for="SuperCoordination"  >Military: Super Coordination</sp-field-label>
                        <sp-number-field
                        id="SuperCoordination"
                        value="0"
                        min="0"
                        max="20"
                        format-options='{
                            "signDisplay": "never",
                            "maximumFractionDigits": 0
                        }'
                        @change=${(e: CustomEvent) => {addValue("SuperCoordination", (e.target as NumberField).value); this.requestUpdate();}}
                        />
                    </div>
                    <div>
                        <sp-field-label for="SuprCoordination"  >Military: Supreme Coordination</sp-field-label>
                        <sp-number-field
                        id="SuprCoordination"
                        value="0"
                        min="0"
                        max="25"
                        format-options='{
                            "signDisplay": "never",
                            "maximumFractionDigits": 0
                        }'
                        @change=${(e: CustomEvent) => {addValue("SuprCoordination", (e.target as NumberField).value); this.requestUpdate();}}
                        />
                    </div>
                    <div>
                        <sp-field-label for="Prestige"  >Military Advance: Prestige</sp-field-label>
                        <sp-number-field
                        id="Prestige"
                        value="0"
                        min="0"
                        max="25"
                        format-options='{
                            "signDisplay": "never",
                            "maximumFractionDigits": 0
                        }'
                        @change=${(e: CustomEvent) => {addValue("Prestige", (e.target as NumberField).value); this.requestUpdate();}}
                        />
                    </div>
                    <div>
                        <sp-field-label for="AdvPrestige"  >Military Advance: Advanced Prestige</sp-field-label>
                        <sp-number-field
                        id="AdvPrestige"
                        value="0"
                        min="0"
                        max="25"
                        format-options='{
                            "signDisplay": "never",
                            "maximumFractionDigits": 0
                        }'
                        @change=${(e: CustomEvent) => {addValue("AdvPrestige", (e.target as NumberField).value); this.requestUpdate();}}
                        />
                    </div>
                    </sp-field-group>
                </div>
            </div>
            <div class="not-content CalcResult">
                Your base march size, before considering 
                <ul>
                    <li>which generals you have assigned, and how developed they are,</li>
                    <li>the gear on those generals,</li>
                    <li>the march size skill book that may be on your general pair,</li>
                    <li>any march size buffs from a dragon or spiritual beast assigned to your general</li>
                    <li>any temporary march size buffs on your keep</li>
                </ul>
                is: <br/>
                <span class="ClassResult">${this.baseMarch.toFixed(0)}</span>
            </div>
        </div>
        `
          
      }
}
if (!customElements.get('march-calc')) {
    customElements.define('march-calc', MarchCalc)
}