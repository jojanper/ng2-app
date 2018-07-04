import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../utils/base';

import { WORLDBANKROUTES } from './worldbank.routes.config';
import { CountriesComponent } from './countries.component';


const CHILDCONFIG = WORLDBANKROUTES.children;

const CHILDROUTES: Route[] = [
    {
        component: CountriesComponent,
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
        }
    }
];

export const WORLDBANKROUTE: Route = {
    path: WORLDBANKROUTES.url,
    component: AppEmptyViewComponent,
    data: {
        config: {route: WORLDBANKROUTES}
    },
    children: CHILDROUTES
};
