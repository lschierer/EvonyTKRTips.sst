export const sidebar = [
    {
        label: 'Generals',
        collapsed: true,
        autogenerate: {
            directory: 'generals',
            collapsed: true,
        },
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
                        label: "Overview of Reports",
                        link: 'monsters/overview/'
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
        ]
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
            directory: 'reference'
        },
    },
];