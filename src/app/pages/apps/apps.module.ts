import { NgModule } from '@angular/core';

import { SocketService } from './services';

import { ChatModule } from './pages/chat/chat.module';
import { TerminalModule } from './pages/terminal/terminal.module';
import { AudioModule } from './pages/audio/audio.module';
import { DraalAppsRoutes } from './apps.routings';


@NgModule({
    imports: [
        ChatModule,
        TerminalModule,
        AudioModule,
        DraalAppsRoutes
    ],
    providers: [
        SocketService
    ]
})
export class DraalAppPagesAppsModule {}
