import { RouteConfig, RouteDetails } from '../../../models';

/**
 * Routes within species pages.
 */
export const SPECIESROUTES: RouteConfig = [
    {
        url: ':id',
        name: 'starwars.species-detail-view',
        menuTitle: 'Species details',
        sidemenu: false
    }
];

/**
 * Routes within Star Wars API pages.
 */
export const STARWARSROUTES: RouteDetails = {
    url: 'star-wars',
    name: 'starwars-view',
    menuTitle: 'Star Wars',
    children: [
        {
            url: 'planets',
            name: 'starwars.planets-view',
            menuTitle: 'Planets'
        },
        {
            url: 'species',
            name: 'starwars.species-view',
            menuTitle: 'Species',
            children: SPECIESROUTES
        }
    ]
};
