import { NgModule } from '@angular/core';

import { ChatComponent } from './chat.component';
import { RealTimeService } from './services';


@NgModule({
    declarations: [
        ChatComponent
    ],
    providers: [
        RealTimeService
    ]
})
export class ChatModule {}
