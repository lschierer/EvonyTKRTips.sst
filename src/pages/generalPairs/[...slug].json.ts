//doing this with static generation would require that an
//endpoint support props.  parsing the slug into multiple
//variables is apparently only supported in SSR mode
export const prerender = false;
const DEBUG = false;
import {
  type APIContext,
  type APIRoute,
  type InferGetStaticParamsType,
  type InferGetStaticPropsType,
} from "astro";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";

import {
  ConflictDatum,
  type ConflictDatumType,
  generalConflicts,
  GeneralPair,
  type GeneralPairType,
  generalSpecialists,
} from "@schemas/index";

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.slug?.split("/")[0];
  const gc = params.slug?.split("/")[1];
  if (DEBUG) console.log(`slug is ${params.slug}`);
  if (DEBUG) console.log(`id is ${id}`);
  if (DEBUG) console.log(`gc is ${gc}`);

  const g1Entry = await getEntry('generals', `${id}`);
  if(g1Entry === undefined || g1Entry === null) {
    return new Response(JSON.stringify(`unknown general ${id}`));
  }
  const g1 = g1Entry.data.general;

  if (id !== undefined && id !== null) {
    const collectionArray: CollectionEntry<"generalConflictData">[] =
      await getCollection("generalConflictData", ({ data }) => {
        const c = Object.values(data.conflicts).flat();
        if (c.includes(id)) {
          return true;
        }
      });
    let conflictData: ConflictDatumType[] | null = null;
    
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
      
      const generalObjects: CollectionEntry<"generals">[] = (
        await getCollection("generals")
      ).filter((gi) => {
        const g2 = gi.data.general;
        if (g2.name.localeCompare(id, undefined, { sensitivity: "base" })) {
          if (gc !== undefined && g2.score_as !== undefined) {
            if (
              gc.localeCompare(g2.score_as, undefined, {
                sensitivity: "base",
              })
            ) {
              return false;
            }
            
          }
          if (conflictData !== null) {
            for (const datum of conflictData) {
              const conflicts = [...Object.values(datum.conflicts)[0]];
              if(Object.values(datum.conflicts).length > 1) {
                conflicts.push(...Object.values(datum.conflicts)[1])
              }
              if (conflicts.includes(g2.name)) {
                if (DEBUG) console.log(`conflict ${conflicts.toString()} has ${g2.name}`)
                return false;
              }
            }
          }
          return true; 
        } else {
          if (DEBUG) console.log(`id ${id} matched ${g2.name}`)
          return false;
        }
      });
      if (DEBUG) console.log(`found ${generalObjects.length} generals`);
      
      if(g1 !== undefined && g1 !== null ) {
        const result = generalObjects.map((gi) => {
          if ( gi !== undefined && gi !== null) {
            const g2 = gi.data.general;
             const returnable: GeneralPairType = {
              primary: g1,
              secondary: g2,
            };
            return returnable;
          }
          return null;
        });
        if (DEBUG) console.log(`created ${result.length} results`)
        return new Response(JSON.stringify(result));
      }
    }
  }

  return new Response(JSON.stringify("id undefined"));
};
