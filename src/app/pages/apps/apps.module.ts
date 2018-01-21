import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ChatModule, CHATROUTE } from './chat';
import { AppEmptyViewComponent } from '../../widgets';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        CHATROUTE
    ]
}];

@NgModule({
    imports: [
        CommonModule,
        ChatModule,
        RouterModule.forChild(ROUTES)
    ]
})
export class DraalAppPagesAppsModule {}
