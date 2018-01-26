import { Route } from '@angular/router';

import { RouteManager } from '../../../router';
import { ChatComponent } from './index';
import { AppEmptyViewComponent } from '../../../widgets';
import { CHATROUTES } from './chat.routes.config';


const getChatRoutes = (config) => {
    return [
        {
            path: config['users'].url,
            component: ChatComponent,
            data: {
                config: RouteManager.getConfig(config['users'].name)
            }
        }
    ];
};

export const CHATROUTE: Route = {
    path: CHATROUTES.url,
    component: AppEmptyViewComponent,
    data: {
        config: RouteManager.getConfig(CHATROUTES.name)
    },
    children: getChatRoutes(CHATROUTES.children)
};