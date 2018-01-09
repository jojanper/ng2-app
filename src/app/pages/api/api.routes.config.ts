import { RouteDetails } from '../../router';
import { STARWARSROUTES } from './starwars/starwars.routes.config';
import { WORLDBANKROUTES } from './worldbank/worldbank.routes.config';


export const APIROUTES: RouteDetails = {
    url: 'api-pages',
    name: 'api-views',
    menuTitle: 'API Views',
    children: {
        starwars: STARWARSROUTES,
        worldbank: WORLDBANKROUTES
    }
};
