import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../utils/base';
import { DraalWidgetsCoreModule, DraalFormsModule } from '../../../widgets';

import { ChatComponent } from './chat.component';
import { VideoChatComponent } from './videochat.component';
import { SocketService } from './services';
import { CHATROUTES } from './chat.routes.config';


const CHILDROUTES: Route[] = [
    {
        component: ChatComponent,
        path: CHATROUTES.children['users'].url,
        data: {
            config: {
                route: CHATROUTES.children['users']
            }
        }
    },
    {
        component: VideoChatComponent,
        path: CHATROUTES.children['video'].url,
        data: {
            config: {
                route: CHATROUTES.children['video']
            }
        }
    }
];

export const CHATROUTE: Route = {
    path: CHATROUTES.url,
    component: AppEmptyViewComponent,
    data: {
        config: {
            route: CHATROUTES
        }
    },
    children: CHILDROUTES
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
