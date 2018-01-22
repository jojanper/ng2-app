import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatComponent } from './chat.component';
import { SocketService } from './services';
import { DraalWidgetsCoreModule, DraalFormsModule } from '../../../widgets';


@NgModule({
    imports: [
        CommonModule,
        DraalWidgetsCoreModule,
        DraalFormsModule
    ],
    declarations: [
        ChatComponent
    ],
    providers: [
        SocketService
    ]
})
export class ChatModule {}
