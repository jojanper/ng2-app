import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../utils/base';

import { PlanetsComponent, SpeciesDetailComponent } from './index';
import { STARWARSROUTES } from './starwars.routes.config';


const CHILDCONFIG = STARWARSROUTES.children;

const CHILDROUTES: Route[] = [
    {
        component: PlanetsComponent,
        path: CHILDCONFIG[0].url,
        data: {
            config: {route: CHILDCONFIG[0]}
        }
    },
    {
        component: AppEmptyViewComponent,
        path: CHILDCONFIG[1].url,
        data: {
            config: {route: CHILDCONFIG[1]}
        },
        children: [{
            component: SpeciesDetailComponent,
            path: CHILDCONFIG[1]['children'][0].url,
            data: {
                config: {route: CHILDCONFIG[1]['children'][0]}
            }
        }]
    }
];

export const STARWARSROUTE: Route = {
    component: AppEmptyViewComponent,
    path: STARWARSROUTES.url,
    data: {
        config: {route: STARWARSROUTES}
    },
    children: CHILDROUTES
};
