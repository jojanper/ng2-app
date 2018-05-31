import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatComponent } from './chat.component';
import { VideoChatComponent } from './videochat.component';
import { SocketService } from './services';
import { DraalWidgetsCoreModule, DraalFormsModule } from '../../../widgets';

export * from './chat.routing';

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
        SocketService
    ]
})
export class ChatModule {}
