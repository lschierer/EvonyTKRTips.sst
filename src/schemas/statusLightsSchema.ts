import { z as zod } from 'zod';

export const statusLights = zod.enum([
  'positive',
  'negative',
  'notice',
  'info',
  'neutral',
  'yellow',
  'fuchsia',
  'indigo',
  'seafoam',
  'chartreuse',
  'magenta',
  'celery',
  'purple',
]);

export type statusLightsType = zod.infer<typeof statusLights>;
