export const prerender = false;
const DEBUG = false;
import { type APIRoute } from "astro";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
//import type { InferGetStaticParamsType, GetStaticPaths } from "astro";

import {
  type ConflictDatumType,
  ConflictDatum,
  type GeneralPairType,
  GeneralElement,
  type GeneralClassType,
  generalSpecialists,
  type generalSpecialistsType,
  GeneralClass,
} from "@schemas/index";

/* I am getting all sorts of warnings any time these pages are static. 
 * so getStaticPaths is not needed.
export const getStaticPaths = (async () => {
  const generals = await getCollection("generals");
  const returnable = generalSpecialists.options
    .map((speciality) => {
      return generals.map((general) => {
        return {
          params: {
            id: general.id,
            class: speciality,
          },
        };
      });
    })
    .flat();
  return returnable;
}) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
*/

const getConflictDataForGeneral = async function (
  target: GeneralClassType
): Promise<ConflictDatumType[]> {
  const conflictData: ConflictDatumType[] = new Array<ConflictDatumType>();

  const collectionArray: CollectionEntry<"generalConflictData">[] =
    await getCollection("generalConflictData", ({ data }) => {
      const c = Object.values(data.conflicts).flat();
      if (c.includes(target.name)) {
        return true;
      }
    });

  if (collectionArray !== null && collectionArray !== undefined) {
    for (const datum of collectionArray) {
      const validation = ConflictDatum.safeParse(datum);
      if (validation.success) {
        conflictData.push(validation.data);
      }
    }
  }
  if (DEBUG) console.log(`conflictData is ${conflictData.length} long`);

  return conflictData;
};

const getGeneralsBySpeciality = async function (
  special: generalSpecialistsType
): Promise<GeneralClassType[]> {
  const returningGenerals = new Array<GeneralClassType>();

  const generalObjects: CollectionEntry<"generals">[] = await getCollection(
    "generals",
    (ge) => {
      if (special !== generalSpecialists.enum.all) {
        if (
          ge.data.general.score_as !== undefined &&
          ge.data.general.score_as !== null
        ) {
          if (
            !special.localeCompare(ge.data.general.score_as, undefined, {
              sensitivity: "base",
            })
          ) {
            return true;
          }
        }
        return false;
      }
      return true;
    }
  );

  for (const ge of generalObjects) {
    const validation = GeneralClass.safeParse(ge.data.general);
    if (validation.success) {
      returningGenerals.push(validation.data);
    }
  }
  return returningGenerals;
};

export const GET: APIRoute = async ({ params, request }): Promise<Response> => {
  const id = params.id;
  const gc = params.class;
  if (DEBUG) console.log(`id is ${id}`);
  if (DEBUG) console.log(`gc is ${gc}`);

  const returningPairs = Array<GeneralPairType>();

  if (id !== undefined && id !== null) {
    const g1Entry = await getEntry("generals", id);
    //const g1Entry = null;
    if (g1Entry === undefined || g1Entry === null) {
      //this should never happen
      console.log(`g1Entry was undefined or null`);
      return new Response(JSON.stringify(`unknown general ${id}`));
    } else {
      const v1 = GeneralElement.safeParse(g1Entry.data);
      if (v1.success) {
        if (DEBUG) console.log(`v1 sucess`);
        const g1: GeneralClassType = v1.data.general;

        const conflictData = await getConflictDataForGeneral(g1);
        //const conflictData = new Array<ConflictDatumType>();

        let potentialMatches: GeneralClassType[];
        if (gc !== undefined && gc !== null) {
          const v2 = generalSpecialists.safeParse(gc);
          if (v2.success) {
            potentialMatches = await getGeneralsBySpeciality(v2.data);
          } else if (g1.score_as !== undefined && g1.score_as !== null) {
            potentialMatches = await getGeneralsBySpeciality(g1.score_as);
          } else {
            potentialMatches = await getGeneralsBySpeciality(
              generalSpecialists.enum.all
            );
          }
        } else if (g1.score_as !== undefined && g1.score_as !== null) {
          potentialMatches = await getGeneralsBySpeciality(g1.score_as);
        } else {
          potentialMatches = await getGeneralsBySpeciality(
            generalSpecialists.enum.all
          );
        }
        if (potentialMatches.length > 0) {
          potentialMatches = potentialMatches.filter((pm) => {
            const pmName = pm.name.toLocaleLowerCase(undefined);
            const g1Name = g1.name.toLocaleLowerCase(undefined);
            return pmName.localeCompare(g1Name, undefined, {
              sensitivity: "base",
            });
          });
        }
        if (conflictData.length > 0) {
          potentialMatches = potentialMatches.filter((pm) => {
            for (const datum of conflictData) {
              const conflicts = [...Object.values(datum.conflicts)[0]];
              if (Object.values(datum.conflicts).length > 1) {
                conflicts.push(...Object.values(datum.conflicts)[1]);
              }
              if (conflicts.includes(pm.name)) {
                if (DEBUG) {
                  console.log(
                    `conflict ${conflicts.toString()} has ${pm.name}`
                  );
                }
                return false;
              }
            }
            return true;
          });
        }
        if (potentialMatches.length > 0) {
          if (DEBUG) console.log(`found ${potentialMatches.length} generals`);
          for (const match of potentialMatches) {
            const returnable: GeneralPairType = {
              primary: g1,
              secondary: match,
            };
            returningPairs.push(returnable);
          }
        }
      }
    }
  }
  return new Response(JSON.stringify(returningPairs));
};
