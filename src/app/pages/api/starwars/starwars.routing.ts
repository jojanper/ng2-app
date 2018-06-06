import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../utils/base';

import { PlanetsComponent, SpeciesDetailComponent } from './index';
import { STARWARSROUTES } from './starwars.routes.config';


const CHILDCONFIG = STARWARSROUTES.children;

const CHILDROUTES: Route[] = [
    {
        component: PlanetsComponent,
        path: CHILDCONFIG['planets'].url,
        data: {
            config: {route: CHILDCONFIG['planets']}
        }
    },
    {
        component: AppEmptyViewComponent,
        path: CHILDCONFIG['species'].url,
        data: {
            config: {route: CHILDCONFIG['species']}
        },
        children: [{
            component: SpeciesDetailComponent,
            path: CHILDCONFIG['species']['children']['detail'].url,
            data: {
                config: {route: CHILDCONFIG['species']['children']['detail']}
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
