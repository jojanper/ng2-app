import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatModule, CHATROUTE } from './chat/chat.module';
import { AppEmptyViewComponent } from '../../utils/base';

const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        CHATROUTE
    ]
}];

@NgModule({
    imports: [
        ChatModule,
        RouterModule.forChild(ROUTES)
    ]
})
export class DraalAppPagesAppsModule {}
