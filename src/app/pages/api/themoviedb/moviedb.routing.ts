import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../utils/base';

import { MoviesComponent } from './components';
import { MOVIEDBROUTES } from './moviedb.routes.config';


const CHILDCONFIG = MOVIEDBROUTES.children;

const CHILDROUTES: Route[] = [
    {
        component: MoviesComponent,
        path: CHILDCONFIG[0].url,
        data: {
            config: {route: CHILDCONFIG[0]}
        }
    }
];

export const MOVIEDBROUTE: Route = {
    component: AppEmptyViewComponent,
    path: MOVIEDBROUTES.url,
    data: {
        config: {route: MOVIEDBROUTES}
    },
    children: CHILDROUTES
};
