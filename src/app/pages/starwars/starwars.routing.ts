import { Route } from '@angular/router';

import { PlanetsComponent, SpeciesDetailComponent } from './index';
import { AppEmptyViewComponent } from '../../widgets';
import { STARWARSROUTES } from './starwars.routes.config';


const getStarWarsRoutes = (config) => {
    return [
        {
            path: config['planets'].url,
            component: PlanetsComponent,
            data: {
                config: config['planets']
            }
        },
        {
            path: config['species'].url,
            component: AppEmptyViewComponent,
            data: {
                config: config['species']
            },
            children: [{
                path: config['species']['children']['detail'].url,
                component: SpeciesDetailComponent,
                data: {
                    config: config['species']['children']['detail']
                }
            }]
        }
    ];
};

export const STARWARSROUTE: Route = {
    path: STARWARSROUTES.url,
    component: AppEmptyViewComponent,
    data: {
        config: STARWARSROUTES
    },
    children: getStarWarsRoutes(STARWARSROUTES.children)
};
