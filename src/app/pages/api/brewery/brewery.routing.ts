
import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../utils/base';

import { BeersComponent } from './components';
import { BREWERYROUTES } from './brewery.routes.config';


const CHILDCONFIG = BREWERYROUTES.children;

const CHILDROUTES: Route[] = [
    {
        component: BeersComponent,
        path: CHILDCONFIG[0].url,
        data: {
            config: {route: CHILDCONFIG[0]}
        }
    }
];

export const BREWERYROUTE: Route = {
    component: AppEmptyViewComponent,
    path: BREWERYROUTES.url,
    data: {
        config: {route: BREWERYROUTES}
    },
    children: CHILDROUTES
};
