import { Route } from '@angular/router';

import { RouteManager } from '../../router';
import { PlanetsComponent, SpeciesDetailComponent } from './index';
import { AppEmptyViewComponent } from '../../widgets';
import { STARWARSROUTES } from './starwars.routes.config';


const getStarWarsRoutes = (config) => {
    const species = config['species'];

    return [
        {
            path: config['planets'].url,
            component: PlanetsComponent,
            data: {
                config: RouteManager.getConfig(config['planets'].name)
            }
        },
        {
            path: species.url,
            component: AppEmptyViewComponent,
            data: {
                config: RouteManager.getConfig(species.name)
            },
            children: [{
                path: species['children']['detail'].url,
                component: SpeciesDetailComponent,
                data: {
                    config: RouteManager.getConfig(species['children']['detail'].name)
                }
            }]
        }
    ];
};

export const STARWARSROUTE: Route = {
    path: STARWARSROUTES.url,
    component: AppEmptyViewComponent,
    data: {
        config: RouteManager.getConfig(STARWARSROUTES.name)
    },
    children: getStarWarsRoutes(STARWARSROUTES.children)
};
