import { RouteDetails } from '../../../models';


/**
 * Routes within Brewery API pages.
 */
export const BREWERYROUTES: RouteDetails = {
    url: 'brewery',
    name: 'brewery-view',
    menuTitle: 'Brewery DB',
    children: [
        {
            url: 'beers',
            name: 'brewery.beers-view',
            menuTitle: 'Beers'
        }
    ]
};
