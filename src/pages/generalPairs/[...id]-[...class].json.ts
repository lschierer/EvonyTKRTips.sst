//doing this with static generation would require that an
//endpoint support props.  parsing the slug into multiple
//variables is apparently only supported in SSR mode
export const prerender = false;
const DEBUG = true;
import { type APIRoute } from "astro";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";

import {
  type ConflictDatumType,
  generalConflicts,
  type GeneralPairType,
  GeneralPair,
  GeneralElement,
  type GeneralClassType,
  generalSpecialists,
} from "@schemas/index";

export const GET: APIRoute = async ({ params }): Promise<Response> => {
  const id = params.id;
  const gc = params.class;
  if (DEBUG) console.log(`slug is ${params.slug}`);
  if (DEBUG) console.log(`id is ${id}`);
  if (DEBUG) console.log(`gc is ${gc}`);

  if (id !== undefined && id !== null) {
    const g1Entry = await getEntry("generals", `${id}`);
    if (g1Entry === undefined || g1Entry === null) {
      //this should never happen
      return new Response(JSON.stringify(`unknown general ${id}`));
    }
    const v1 = GeneralElement.safeParse(g1Entry.data);
    if (v1.success) {
      if (DEBUG) console.log(`v1 sucess`);
      const g1: GeneralClassType = v1.data.general;
      const collectionArray: CollectionEntry<"generalConflictData">[] =
        await getCollection("generalConflictData", ({ data }) => {
          const c = Object.values(data.conflicts).flat();
          if (c.includes(id)) {
            return true;
          }
        });
      let conflictData: Array<ConflictDatumType> =
        new Array<ConflictDatumType>();

      if (collectionArray !== null && collectionArray !== undefined) {
        conflictData = collectionArray
          .filter((ca) => {
            const validation = generalConflicts.safeParse(ca.data);
            if (validation.success) {
              return true;
            } else {
              return false;
            }
          })
          .flat()
          .map((gci) => {
            return gci.data;
          });
        if (DEBUG) console.log(`conflictData is ${conflictData.length} long`);

        const generalObjects: CollectionEntry<"generals">[] = (
          await getCollection("generals", (gi) => {
            if (gc !== undefined && gc !== null) {
              if (
                !gc
                  ?.toLocaleLowerCase(undefined)
                  .localeCompare(generalSpecialists.enum.all, undefined)
              ) {
                if (DEBUG) console.log(`gc should be all, gc is ${gc}`);
                if (g1.score_as !== undefined && g1.score_as !== null) {
                  const sa = gi.data.general.score_as;
                  if (sa !== undefined && sa !== null) {
                    if (
                      g1.score_as
                        .toLocaleLowerCase(undefined)
                        .localeCompare(sa, undefined, { sensitivity: "base" })
                    ) {
                      if (DEBUG)
                        console.log(
                          `g1 failed to match ${g1.score_as} and ${sa}`
                        );
                      return false;
                    }
                  }
                }
              } else {
                const sa = gi.data.general.score_as;
                if (sa !== undefined && sa !== null) {
                  if (
                    gc
                      .toLocaleLowerCase(undefined)
                      .localeCompare(sa, undefined, { sensitivity: "base" })
                  ) {
                    if (DEBUG)
                      console.log(`gc failed to match ${gc} and ${sa}`);
                    return false;
                  }
                }
              }
            }

            if (!gi.data.general.name.localeCompare(id)) {
              return false;
            }
            return true;
          })
        ).filter((gi) => {
          const v2 = GeneralElement.safeParse(gi.data);
          if (v2.error) {
            console.log(`v2 error`);
            return false;
          }
          if (DEBUG) console.log(`v2 success`);
          const g2: GeneralClassType = v2.data.general;
          if (g2.name.localeCompare(id, undefined, { sensitivity: "base" })) {
            if (conflictData !== null) {
              for (const datum of conflictData) {
                const conflicts = [...Object.values(datum.conflicts)[0]];
                if (Object.values(datum.conflicts).length > 1) {
                  conflicts.push(...Object.values(datum.conflicts)[1]);
                }
                if (conflicts.includes(g2.name)) {
                  if (DEBUG)
                    console.log(
                      `conflict ${conflicts.toString()} has ${g2.name}`
                    );
                  return false;
                }
              }
            }
            return true;
          } else {
            if (DEBUG) console.log(`id ${id} matched ${g2.name}`);
            return false;
          }
        });
        if (DEBUG) console.log(`found ${generalObjects.length} generals`);

        if (g1 !== undefined && g1 !== null) {
          const result = generalObjects
            .map((gi) => {
              if (gi !== undefined && gi !== null) {
                const g2 = gi.data.general;
                const returnable: GeneralPairType = {
                  primary: g1,
                  secondary: g2,
                };
                return returnable;
              }
              return null;
            })
            .filter((r) => {
              const validation = GeneralPair.safeParse(r);
              if (validation.success) {
                return true;
              }
              return false;
            });
          if (DEBUG) console.log(`created ${result.length} results`);
          return new Response(JSON.stringify(result));
        }
      } else {
        return new Response(
          JSON.stringify(`collection returned something invalid for conflicts`)
        );
      }
    }
  } else {
    //nor should this ever
    return new Response(
      JSON.stringify(`collection returned something invalid for ${id}`)
    );
  }
  return new Response(JSON.stringify(`below the last if ${id}`));
};
