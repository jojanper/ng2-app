import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../../utils/base';
import { DraalWidgetsCoreModule, DraalFormsModule } from '../../../../widgets';

import { ChatComponent } from './chat.component';
import { VideoChatComponent } from './videochat.component';
import { CHATROUTES } from './chat.routes.config';


const CHILDROUTES: Route[] = [
    {
        component: ChatComponent,
        path: CHATROUTES.children[0].url,
        data: {
            config: {
                route: CHATROUTES.children[0]
            }
        }
    },
    {
        component: VideoChatComponent,
        path: CHATROUTES.children[1].url,
        data: {
            config: {
                route: CHATROUTES.children[1]
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
    ]
})
export class ChatModule {}
