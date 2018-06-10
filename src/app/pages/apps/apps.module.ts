import { NgModule } from '@angular/core';

import { ChatModule } from './chat/chat.module';
import { DraalAppsRoutes } from './apps.routings';


@NgModule({
    imports: [
        ChatModule,
        DraalAppsRoutes
    ]
})
export class DraalAppPagesAppsModule {}
