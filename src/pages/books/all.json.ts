import {
  type APIRoute,
} from 'astro';
import { getCollection,  type CollectionEntry  } from 'astro:content';

import {
  Book,
  type BookType,
} from '@schemas/bookSchemas'


export const GET: APIRoute = async () => {
  const bookObjects: CollectionEntry<'skillBooks'>[]  = await getCollection('skillBooks');
  if(bookObjects !== null && bookObjects !== undefined) {
    
    const bookIterator = bookObjects.values();
    const allBooks = new Array<BookType>();
    for (const v of bookIterator) {
      const validation = Book.safeParse(v.data);
      if(validation.success) {
        allBooks.push(validation.data);
      }
    }
    return new Response(
      JSON.stringify(allBooks)
    )
  }

  return new Response(JSON.stringify(''))
}
