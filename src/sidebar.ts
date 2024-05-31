export const sidebar = [
  {
    label: 'Generals',
    collapsed: true,
    items: [
      {
        label: 'Overview',
        link: '/generals/overview/',
      },
      {
        label: 'Tools for Picking Pairs',
        collapsed: true,
        autogenerate: {
          directory: '/generals/pair-picking',
          collapsed: true,
        },
      },
      {
        label: 'Details on Specific Generals',
        collapsed: true,
        items: [],
      },
      {
        label: 'Guide for Mounted Generals',
        link: '/generals/mounted',
      },
      {
        label: 'Guide for Ranged Generals',
        link: '/generals/ranged',
      },
      {
        label: 'Guide for Ground Generals',
        link: '/generals/ground',
      },
      {
        label: 'Guide for Siege Machine Generals',
        link: '/generals/siege',
      },
      {
        label: 'Guide for Wall Generals',
        link: '/generals/wall',
      },
      {
        label: 'Guide for SubCity Mayors',
        link: '/generals/mayors/',
      },
      {
        label: 'Guide for Duty Generals',
        link: '/generals/duty',
      },
      {
        label: 'Miscellaneous Generals You Ought to Have',
        link: '/generals/misc/',
      },
      {
        label: 'Peace Time SubCity Mayors',
        link: '/generals/peace_time_subcity_mayors/',
      },
      {
        label: "Notes on General's Buffs",
        link: '/generals/buffnotes/',
      },
    ],
  },
  {
    label: 'Monsters',
    collapsed: true,
    items: [
      {
        label: 'About Monsters',
        link: 'monsters/',
      },
      {
        label: 'Getting Started',
        link: 'monsters/getting_started/',
      },
      {
        label: 'Boss Monster Overview',
        link: 'monsters/boss_overview/',
      },
      {
        label: 'Monster Hunting',
        items: [
          {
            label: 'Overview of Reports',
            link: 'monsters/overview/',
          },
          {
            label: 'Reports',
            collapsed: true,
            autogenerate: {
              directory: 'monsters/reports',
              collapsed: true,
            },
          },
        ],
      },
    ],
  },
  {
    label: 'SvS',
    collapsed: true,
    autogenerate: {
      directory: 'svs',
      collapsed: true,
    },
  },
  {
    label: 'Reference',
    collapsed: true,
    autogenerate: {
      directory: 'reference',
    },
  },
];
