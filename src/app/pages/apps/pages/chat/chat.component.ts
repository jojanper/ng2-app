import { Component, OnInit, OnDestroy, ElementRef, ViewChild,
    AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SocketService } from '../../services';
import { ChatConfig } from './chat.config';
import { FormOptions } from '../../../../models';
import { AppObservableArray } from '../../../../utils/base';
import { FormModel } from '../../../../widgets';


class ChatMessagesObservable extends AppObservableArray<Array<any>> {}

@Component({
    selector: 'dng-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

    private event = 'message';

    private stop$: Subject<void>;
    messages: ChatMessagesObservable;

    model: FormModel;
    options: FormOptions;

    @ViewChild('scrollMe') private scroll: ElementRef;

    constructor(private socket: SocketService) {

        this.stop$ = new Subject();
        this.messages = new ChatMessagesObservable();

        this.socket.onData(this.event)
            .pipe(takeUntil(this.stop$))
            .subscribe(data => this.messages.addSubject(data.data));

        this.model = new FormModel();
        this.model.addInputs(ChatConfig.formConfig);

        this.options = {
            noSubmitLabel: true,
            resetOnSubmit: true
        };
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

    ngOnDestroy() {
        this.stop$.unsubscribe();
    }

    send(data: any) {
        this.socket.send(this.event, {data: data.message});
    }
}
