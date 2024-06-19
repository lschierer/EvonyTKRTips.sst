import { type APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

import { ConflictDatum } from '@schemas/conflictSchemas';

export const GET: APIRoute = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const collectionArray: CollectionEntry<'generalConflictData'>[] =
    await getCollection('generalConflictData');
  if (collectionArray !== null && collectionArray !== undefined) {
    const result = collectionArray.map((ca) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const validation = ConflictDatum.safeParse(ca.data);
      if (validation.success) {
        return validation.data;
      } else {
        return new Response(JSON.stringify('bad validation'));
      }
    });
    return new Response(JSON.stringify(result));
  }
  return new Response(JSON.stringify('end'));
};
