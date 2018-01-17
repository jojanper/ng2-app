import { Component } from '@angular/core';

import { RealTimeService } from './services';


@Component({
    selector: 'dng-chat-',
    template: '<button type="button" (click)="sendMessage()">Send message</button>'
})
export class ChatComponent {

    constructor(private socket: RealTimeService) {
        this.socket.initSocket();
        this.socket.onMessage().subscribe(data => {
            console.log(data);
        });
    }

    sendMessage() {
        this.socket.send({data: 'Send data'});
    }
}
