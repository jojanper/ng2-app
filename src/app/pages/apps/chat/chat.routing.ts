import { Route } from '@angular/router';

import { RouteManager } from '../../../router';
import { ChatComponent } from './chat.component';
import { VideoChatComponent } from './videochat.component';
import { AppEmptyViewComponent } from '../../../utils/base';
import { CHATROUTES } from './chat.routes.config';


const getChatRoutes = (config) => {
    return [
        {
            path: config['users'].url,
            component: ChatComponent,
            data: {
                config: RouteManager.getConfig(config['users'].name)
            }
        },
        {
            path: config['video'].url,
            component: VideoChatComponent,
            data: {
                config: RouteManager.getConfig(config['video'].name)
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
