import { RouteConfig, RouteDetails } from '../../../router';

/**
 * Routes within species pages.
 */
export const SPECIESROUTES: RouteConfig = {
    detail: {
        url: ':id',
        name: 'species-detail-view',
        menuTitle: 'Species details',
        sidemenu: false
    }
};

/**
 * Routes within Star Wars API pages.
 */
export const STARWARSROUTES: RouteDetails = {
    url: 'star-wars',
    name: 'starwars-view',
    menuTitle: 'Star Wars',
    children: {
        planets: {
            url: 'planets',
            name: 'planets-view',
            menuTitle: 'Planets'
        },
        species: {
            url: 'species',
            name: 'species-view',
            menuTitle: 'Species',
            children: SPECIESROUTES
        }
    }
};
