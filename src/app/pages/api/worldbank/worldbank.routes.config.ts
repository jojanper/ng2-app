import { RouteDetails } from '../../../router';

/**
 * Routes within World Bank API pages.
 */
export const WORLDBANKROUTES: RouteDetails = {
    url: 'world-bank',
    name: 'worldbank-view',
    menuTitle: 'World Bank',
    children: {
        countries: {
            url: 'countries',
            name: 'worldbank-countries-view',
            menuTitle: 'Countries'
        }
    }
};
