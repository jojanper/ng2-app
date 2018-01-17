import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ChatModule, ChatComponent } from './chat';


const ROUTES: Routes = [{
    path: '', component: ChatComponent
}];

@NgModule({
    imports: [
        CommonModule,
        ChatModule,
        RouterModule.forChild(ROUTES)
    ]
})
export class DraalAppPagesAppsModule {}
