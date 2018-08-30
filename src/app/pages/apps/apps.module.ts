import { NgModule } from '@angular/core';

import { ChatModule } from './chat/chat.module';
import { TerminalModule } from './terminal/terminal.module';
import { DraalAppsRoutes } from './apps.routings';


@NgModule({
    imports: [
        ChatModule,
        TerminalModule,
        DraalAppsRoutes
    ]
})
export class DraalAppPagesAppsModule {}
