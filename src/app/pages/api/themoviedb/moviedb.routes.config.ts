import { RouteDetails } from '../../../models';

/**
 * Routes within the Movie DB API pages.
 */
export const MOVIEDBROUTES: RouteDetails = {
    url: 'movie-db',
    name: 'moviedb-view',
    menuTitle: 'The Movies DB',
    children: [
        {
            url: 'top-rated',
            name: 'moviedb.top-rated-view',
            menuTitle: 'Top rated'
        }
    ]
};
