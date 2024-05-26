import { defineMiddleware } from "astro:middleware";
import { getCollection, getEntry, z } from "astro:content";

import { BaseN } from "js-combinatorics";

import {
  AscendingLevels,
  Book,
  BuffParams,
  type BuffParamsType,
  Display,
  ExtendedGeneral,
  type ExtendedGeneralType,
  ExtendedGeneralStatus,
  GeneralClass,
  generalUseCase,
  qualityColor,
  Speciality,
  type specialSkillBookType,
  type SpecialityType,
  type BookType,
  type standardSkillBookType,
  type ConflictDatumType,
  type GeneralPairType,
  ConflictDatum,
} from "@schemas/index";

import { EvAnsScoreComputer } from "./EvAnsRanking/EvAnsScoreComputer";
import {ScoreComputer as AttackScoreComputer} from './AttackRanking/ScoreComputer';
import {ScoreComputer as DefenseScoreComputer} from './DefenseRanking/ScoreComputer';

const DEBUG = false;

export const DisplayGeneralsMWRoutes = ["/generals/"];

export const DisplayGeneralsMW = defineMiddleware(
  async ({ locals, url }, next) => {
    let continueHandler = false;

    const re = /[[\]'",]/g;

    //define a bunch of functions almost like a class

    const InvestmentOptions2Key = z
      .function()
      .args(BuffParams)
      .returns(z.string())
      .implement((BP: BuffParamsType) => {
        return JSON.stringify(BP).replace(re, "");
      });

    DisplayGeneralsMWRoutes.map((route) => {
      if (url.pathname.startsWith(route)) {
        continueHandler = true;
      }
    });

    //from https://www.evonyanswers.com/post/evony-answers-attribute-methodology-explanation
    const GeneralBuffs = z
      .function()
      .args(z.string(), Display, BuffParams)
      .returns(z.boolean())
      .implement((name, display, BP: BuffParamsType) => {
        if (DEBUG) console.log(`EvAnsBuff starting for ${name}`);
        const eg: ExtendedGeneralType = locals.ExtendedGenerals.find(
          (element: ExtendedGeneralType) => {
            return !name.localeCompare(element.general.name);
          }
        );

        if (!eg.status.localeCompare(ExtendedGeneralStatus.enum.complete)) {
          if (DEBUG) {
            console.log(`${eg.general.name} status is ${eg.status}`);
          }
          return true;
        } else if (
          !eg.status.localeCompare(ExtendedGeneralStatus.enum.created) ||
          !eg.status.localeCompare(ExtendedGeneralStatus.enum.fetching)
        ) {
          if (DEBUG) {
            console.log(`${eg.general.name} status is ${eg.status}`);
            console.log(`called early`);
            return false;
          }
        } else {
          if (DEBUG) {
            console.log(
              `${eg.general.name} GeneralBuffs continuing to call ScoreComputers`
            );
          }
        }

        const _BP: BuffParamsType = {
          special1: BP.special1,
          special2: BP.special2,
          special3: BP.special3,
          special4: BP.special4,
          special5: BP.special5,
          stars: display.localeCompare(Display.enum.assistant)
            ? BP.stars
            : AscendingLevels.enum[0],
          dragon: BP.dragon,
          beast: BP.beast,
        };

        const EvAnsRankScore = EvAnsScoreComputer(
          generalUseCase.enum.Attack,
          eg,
          display,
          _BP
        );
        const AttackRank = AttackScoreComputer(
          generalUseCase.enum.Attack,
          eg,
          display,
          _BP
        );
        const DefenseRank = DefenseScoreComputer(
          generalUseCase.enum.Attack,
          eg,
          display,
          _BP)
        if (DEBUG) {
          console.log(
            `in GeneralBuffs, got scores: ${EvAnsRankScore} ${AttackRank} for ${name}`
          );
        }
        const hashKey = InvestmentOptions2Key(_BP);
        eg.computedBuffs.set(hashKey, {
          EvAns: EvAnsRankScore,
          AttackRank: AttackRank,
          DefenseRank: DefenseRank,
        });
        if (DEBUG) {
          console.log(`hashKey: ${hashKey}`);
          console.log(
            `${eg.general.name}: Scores: ${EvAnsRankScore} ${AttackRank}`
          );
          console.log(
            `computedBuffs: ${JSON.stringify(Array.from(eg.computedBuffs))}`
          );
          console.log(eg.computedBuffs.get(hashKey)?.EvAns);
        }

        return true;
      });

    const enrichGeneral = z
      .function()
      .args(z.string())
      .returns(z.promise(z.boolean()))
      .implement(async (gn) => {
        if (DEBUG) console.log(`starting to enrich ${gn}`);
        const success = true;
        const entry: ExtendedGeneralType | null =
          locals.ExtendedGenerals.find((element) => {
            return !gn.localeCompare(element.general.name);
          }) ?? null;

        if (entry === undefined || entry === null) {
          console.log(`failed to find general ${gn}`);
          return false;
        } else {
          if (
            !entry.status.localeCompare(ExtendedGeneralStatus.enum.complete)
          ) {
            return true;
          } else if (
            !entry.status.localeCompare(ExtendedGeneralStatus.enum.processing)
          ) {
            return false;
          } else if (
            !entry.status.localeCompare(ExtendedGeneralStatus.enum.fetching)
          ) {
            return false;
          } else {
            entry.status = ExtendedGeneralStatus.enum.fetching;
            if (
              !Array.isArray(entry.general.specialities) ||
              entry.general.specialities.length === 0
            ) {
              console.log(`${gn} has no specialities`);
              return false;
            } else {
              await Promise.all(
                entry.general.specialities.map(async (special) => {
                  const sC = await getEntry("specialities", special);
                  if (sC === undefined) {
                    console.log(`failed to fetch special ${special} for ${gn}`);
                    return false;
                  } else {
                    const v = Speciality.safeParse(sC.data);
                    if (v.error) {
                      console.log(
                        `got invalid speciality for ${special} of ${gn}`
                      );
                      return false;
                    } else {
                      if (DEBUG) {
                        console.log(`pushing speciality: ${v.data.name}`);
                      }
                      entry.specialities.push(v.data);
                    }
                  }
                })
              ).then(() => {
                if (
                  Array.isArray(entry.general.specialities) &&
                  entry.general.specialities.length !==
                    entry.specialities.length
                ) {
                  console.log(
                    `specialities for ${entry.general.name}: expected: ${entry.general.specialities.length} have: ${entry.specialities.length}`
                  );
                  return false;
                } else {
                  if (DEBUG)
                    console.log(
                      `enrichGeneral ${gn} specials success ${entry.specialities.length}`
                    );
                }
              });
            }
            if (
              !Array.isArray(entry.general.books) ||
              entry.general.books.length === 0
            ) {
              console.log(`${gn} has no books`);
              return false;
            } else {
              await Promise.all(
                entry.general.books.map(async (book) => {
                  const bC = await getEntry("skillBooks", book);
                  if (bC === undefined) {
                    console.log(`failed to fetch book ${book} for ${gn}`);
                    return false;
                  } else {
                    const v = Book.safeParse(bC.data);
                    if (v.error) {
                      console.log(`got invalid book ${book} for ${gn}`);
                      return false;
                    } else {
                      entry.books.push(v.data);
                    }
                  }
                })
              ).then(() => {
                if (
                  Array.isArray(entry.general.books) &&
                  entry.general.books.length !== entry.books.length
                ) {
                  console.log(
                    `${gn} books: have ${entry.books.length} expected: ${entry.general.books.length}`
                  );
                  return false;
                } else {
                  if (DEBUG) {
                    console.log(
                      `enrichGeneral ${gn} books success ${entry.books.length}`
                    );
                  }
                }
              });
            }
            entry.status = ExtendedGeneralStatus.enum.processing;
            if (DEBUG) {
              console.log(`calling as primary`);
            }
            const pbs = GeneralBuffs(gn, Display.enum.primary, {
              special1: qualityColor.enum.Gold,
              special2: qualityColor.enum.Gold,
              special3: qualityColor.enum.Gold,
              special4: qualityColor.enum.Gold,
              special5: qualityColor.enum.Disabled,
              stars: AscendingLevels.enum[10],
              dragon: true,
              beast: true,
            });
            if (!pbs) {
              console.log(`${gn}: failed to get GeneralBuffs as primary`);
              return false;
            }
            if (DEBUG) {
              console.log(`calling as secondary`);
            }
            const abs = GeneralBuffs(gn, Display.enum.assistant, {
              special1: qualityColor.enum.Gold,
              special2: qualityColor.enum.Gold,
              special3: qualityColor.enum.Gold,
              special4: qualityColor.enum.Gold,
              special5: qualityColor.enum.Disabled,
              stars: AscendingLevels.enum[0],
              dragon: true,
              beast: true,
            });
            if (!abs) {
              console.log(`${gn}: failed to get GeneralBuffs as assistant`);
              return false;
            }
            if (DEBUG) {
              console.log(`calling as summary`);
            }
            const sbs = GeneralBuffs(gn, Display.enum.summary, {
              special1: qualityColor.enum.Gold,
              special2: qualityColor.enum.Gold,
              special3: qualityColor.enum.Gold,
              special4: qualityColor.enum.Gold,
              special5: qualityColor.enum.Disabled,
              stars: AscendingLevels.enum[10],
              dragon: true,
              beast: true,
            });
            if (!sbs) {
              console.log(`${gn}: failed to get GeneralBuffs as summary`);
              return false;
            }
          }
          if (DEBUG) {
            console.log(`setting complete`);
          }
          entry.status = ExtendedGeneralStatus.enum.complete;
          if (DEBUG) {
            console.log(`enrichGeneral work done for ${gn}`);
            console.log(`specials: ${entry.specialities.length}`);
            console.log(`books: ${entry.books.length}`);
            console.log(`computedBuffs: ${entry.computedBuffs.size}`);
            console.log(`status: ${entry.status}`);
          }
          return success;
        }
      });

    const pairGenerals = () => {
        if (locals.ExtendedGenerals.length > 0) {
          const generalBaseN = new BaseN(locals.ExtendedGenerals, 2);
          [...generalBaseN].forEach((pPair) => {
            const primary = pPair[0];
            const secondary = pPair[1];
            if(primary === undefined || secondary === undefined) {
              return;
            }
            if (!primary.general.name.localeCompare(secondary.general.name)) {
              return;
            }
            if (locals.ConflictData.length > 0) {
              const relConflicts = locals.ConflictData.some((cDatum) => {
                const c = Object.values(cDatum.conflicts).flat();
                if (c.includes(primary.general.name)) {
                  if (c.includes(secondary.general.name)) {
                    return true;
                  }
                }
                return false;
              });
              if (!relConflicts) {
                if (
                  !locals.CachedPairs.some((thisPair) => {
                    if (thisPair?.primary?.general?.name !== undefined ) {
                      
                      if (
                        thisPair.primary.general.name.localeCompare(primary.general.name)
                      ) {
                        if (
                          thisPair.secondary.general.name.localeCompare(
                            pPair[1].general.name
                          )
                        ) {
                          return true;
                        }
                      }
                    }
                    return false;
                  })
                ) {
                  const newPair: GeneralPairType = {
                    primary: pPair[0].general.name,
                    secondary: pPair[1].general.name,
                    EvAnsRanking: 0,
                    AttackRanking: 0,
                  }
                  locals.CachedPairs.push(newPair);
                }
              }
            } else {
              if (
                !locals.CachedPairs.some((thisPair) => {
                  if (thisPair !== undefined && thisPair !== null) {
                    if (
                      thisPair.primary.general.name.localeCompare(
                        primary.general.name
                      )
                    ) {
                      if (
                        thisPair.secondary.general.name.localeCompare(
                          secondary.general.name
                        )
                      ) {
                        return true;
                      }
                    }
                  }
                })
              ) {
                const newPair: GeneralPairType = {
                  primary: primary.general.name,
                  secondary: secondary.general.name,
                  EvAnsRanking: 0,
                  AttackRanking: 0,
                }
                locals.CachedPairs.push(newPair);
              
              }
            }
          });
        }
      }

    const addEG2EGS = z
      .function()
      .args(GeneralClass)
      .returns(z.void())
      .implement((general) => {
        if (DEBUG)
          console.log(
            `middleware generals addEG2EGS running for ${general.name}`
          );
        if (locals.ExtendedGenerals.length > 0) {
          if (
            locals.ExtendedGenerals.some((element) => {
              return !general.name.localeCompare(element.general.name);
            })
          )
            return;
        }
        const toAdd: ExtendedGeneralType = {
          general: general,
          specialities: new Array<SpecialityType>(),
          books: new Array<
            BookType | specialSkillBookType | standardSkillBookType
          >(),
          computedBuffs: new Map<
            string,
            {
              EvAns: number;
              AttackRank: number;
              DefenseRank: number;
            }
          >(),
          status: ExtendedGeneralStatus.enum.created,
        };
        const test = ExtendedGeneral.safeParse(toAdd);
        if (test.success) {
          if (DEBUG)
            console.log(
              `addEG2EGS built a valid ExtendedGeneral for ${general.name}`
            );
          if (DEBUG)
            console.log(
              `addEG2EGS: map size: ${locals.ExtendedGenerals.length}`
            );
          if (
            !locals.ExtendedGenerals.some((element) => {
              return !test.data.general.name.localeCompare(
                element.general.name
              );
            })
          ) {
            locals.ExtendedGenerals.push(test.data);
          }
          if (DEBUG)
            console.log(
              `addEG2EGS: map size: ${locals.ExtendedGenerals.length} about to enrich.`
            );
          void enrichGeneral(general.name);
          void pairGenerals();
        } else {
          console.log(
            `addEG2EGS built an invalid ExtendedGeneral for ${general.name}`
          );
        }

        return;
      });

    const HandlerLogic = async (locals: App.Locals) => {
      if (locals.ExtendedGenerals === undefined) {
        locals.ExtendedGenerals = new Array<ExtendedGeneralType>();
      }

      if (locals.ConflictData === undefined) {
        locals.ConflictData = new Array<ConflictDatumType>();

        const ConflictCollection = await getCollection("generalConflictData");
        if (ConflictCollection !== undefined && ConflictCollection !== null) {
          ConflictCollection.forEach((ccEntry) => {
            const v1 = ConflictDatum.safeParse(ccEntry.data);
            if (v1.success) {
              locals.ConflictData.push(v1.data);
            }
          });
          if (DEBUG) {
            console.log(`conflictData is ${locals.ConflictData.length}`);
          }
        }
      }

      if (locals.CachedPairs === undefined) {
        locals.CachedPairs = new Array<GeneralPairType>();
      }

      if (locals.addEG2EGS === undefined) {
        locals.addEG2EGS = addEG2EGS;
      }

      if (locals.GeneralBuffs === undefined) {
        locals.GeneralBuffs = GeneralBuffs;
      }

      if (locals.InvestmentOptions2Key === undefined) {
        locals.InvestmentOptions2Key = InvestmentOptions2Key;
      }
    };

    //end of function definitions

    if (continueHandler) {
      if (DEBUG) console.log(`DisplayGeneralsMW running`);
      await HandlerLogic(locals);
    }

    return next();
  }
);
