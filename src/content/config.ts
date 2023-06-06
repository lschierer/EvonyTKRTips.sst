import { z, defineCollection } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';


const legacyReports = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    sortOrder: z.number().optional(),
  }),
});

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
  legacyReports: legacyReports,
};

