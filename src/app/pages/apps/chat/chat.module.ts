import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';

import { RouteManager } from '../../../router';
import { AppEmptyViewComponent } from '../../../utils/base';
import { DraalWidgetsCoreModule, DraalFormsModule } from '../../../widgets';

import { ChatComponent } from './chat.component';
import { VideoChatComponent } from './videochat.component';
import { SocketService } from './services';
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


@NgModule({
    imports: [
        CommonModule,
        DraalWidgetsCoreModule,
        DraalFormsModule
    ],
    declarations: [
        ChatComponent,
        VideoChatComponent
    ],
    providers: [
        SocketService
    ]
})
export class ChatModule {}
