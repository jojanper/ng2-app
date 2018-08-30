import { NgModule } from '@angular/core';

import { SocketService } from './services';

import { ChatModule } from './pages/chat/chat.module';
import { TerminalModule } from './pages/terminal/terminal.module';
import { DraalAppsRoutes } from './apps.routings';


@NgModule({
    imports: [
        ChatModule,
        TerminalModule,
        DraalAppsRoutes
    ],
    providers: [
        SocketService
    ]
})
export class DraalAppPagesAppsModule {}
