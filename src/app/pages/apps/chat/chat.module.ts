import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatComponent } from './chat.component';
import { RealTimeService } from './services';
import { DraalWidgetsCoreModule } from '../../../widgets';


@NgModule({
    imports: [
        CommonModule,
        DraalWidgetsCoreModule
    ],
    declarations: [
        ChatComponent
    ],
    providers: [
        RealTimeService
    ]
})
export class ChatModule {}
