import {z} from 'astro:content';

export const statusLights = z.enum ([
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
])

export type statusLightsType = z.infer<typeof statusLights>;
