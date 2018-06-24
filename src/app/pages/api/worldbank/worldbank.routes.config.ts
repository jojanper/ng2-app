import { RouteDetails } from '../../../models';

/**
 * Routes within World Bank API pages.
 */
export const WORLDBANKROUTES: RouteDetails = {
    url: 'world-bank',
    name: 'worldbank-view',
    menuTitle: 'World Bank',
    children: [
        {
            url: 'countries',
            name: 'worldbank.countries-view',
            menuTitle: 'Countries and Economies'
        },
        {
            url: 'GDP',
            name: 'worldbank.gdp-view',
            menuTitle: 'GDP'
        }
    ]
};
