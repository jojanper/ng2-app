import { Component, OnInit, OnDestroy, ElementRef, ViewChild,
    AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { RealTimeService } from './services';
import { AppObservableArray } from '../../../widgets';


class ChatMessagesObservable extends AppObservableArray<Array<any>> {}

@Component({
    selector: 'dng-chat',
    template: require('./chat.component.html'),
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

    private count = 0;
    private event = 'message';

    private stop$: Subject<void>;
    private messages: ChatMessagesObservable;

    @ViewChild('scrollMe') private scroll: ElementRef;

    constructor(private socket: RealTimeService) {

        this.stop$ = new Subject();
        this.messages = new ChatMessagesObservable();

        this.socket.onData(this.event).pipe(takeUntil(this.stop$))
            .subscribe(data => {
                console.log(data);
                this.messages.addSubject(data.data);
            });
    }

    ngOnInit() {
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    }

    sendMessage() {
        this.socket.send(this.event, {data: 'Send data ' + this.count});
        this.count += 1;
    }

    ngOnDestroy() {
        this.stop$.unsubscribe();
    }
}
