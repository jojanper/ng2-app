import { Component, OnInit, OnDestroy, ElementRef, ViewChild,
    AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { SocketService } from './services';
import { ChatConfig } from './chat.config';
import { FormOptions } from '../../../models';
import { AppObservableArray, FormModel } from '../../../widgets';
import * as Peer from 'simple-peer';


class ChatMessagesObservable extends AppObservableArray<Array<any>> {}

@Component({
    selector: 'dng-chat',
    template: require('./chat.component.html'),
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

    private event = 'message';

    private stop$: Subject<void>;
    private messages: ChatMessagesObservable;

    private model: FormModel;
    protected options: FormOptions;

    @ViewChild('scrollMe') private scroll: ElementRef;

    @ViewChild('myvideo') myVideo: ElementRef;
    targetpeer: any;
    peer: any;
    n = <any>navigator;

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

        let video = this.myVideo.nativeElement;
        let peerx: any;
        this.n.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
        this.n.getUserMedia({video:true, audio:true}, (stream) => {
            peerx = new Peer ({
                initiator: location.hash === '#init',
                trickle: false,
                stream:stream
            });

            peerx.on('signal', (data) => {
                console.log(JSON.stringify(data));

                this.targetpeer = data;
            });

            peerx.on('data', (data) => {
                console.log('Recieved message:' + data);
            });

            peerx.on('stream', (stream) => {
                video.src = URL.createObjectURL(stream);
                video.play();
            });

        }, (err) => {
            console.log('Failed to get stream', err);
        });

        setTimeout(() => {
            this.peer = peerx;
            console.log(this.peer);
        }, 5000);
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

    connect() {
        this.peer.signal(JSON.parse(this.targetpeer));
    }

    message() {
        this.peer.send('Hello world');
    }
}
