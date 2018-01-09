import { Route } from '@angular/router';

import { RouteManager } from '../../../router';
import { AppEmptyViewComponent } from '../../../widgets';
import { WORLDBANKROUTES } from './worldbank.routes.config';
import { CountriesComponent } from './countries.component';


const getWorldBankRoutes = (config) => {
    return [
        {
            path: config['countries'].url,
            component: CountriesComponent,
            data: {
                config: RouteManager.getConfig(config['countries'].name)
            }
        }
    ];
};

export const WORLDBANKROUTE: Route = {
    path: WORLDBANKROUTES.url,
    component: AppEmptyViewComponent,
    data: {
        config: RouteManager.getConfig(WORLDBANKROUTES.name)
    },
    children: getWorldBankRoutes(WORLDBANKROUTES.children)
};
