import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../utils/base';

import { WORLDBANKROUTES } from './worldbank.routes.config';
import { CountriesComponent } from './countries.component';


const CHILDCONFIG = WORLDBANKROUTES.children;

const CHILDROUTES: Route[] = [
    {
        component: CountriesComponent,
        path: CHILDCONFIG['countries'].url,
        data: {
            config: {route: CHILDCONFIG['countries']}
        }
    },
    {
        component: AppEmptyViewComponent,
        path: CHILDCONFIG['gdp'].url,
        data: {
            config: {route: CHILDCONFIG['gdp']}
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
