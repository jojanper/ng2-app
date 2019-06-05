import { Component, OnInit, OnDestroy, ElementRef, ViewChild,
    AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SocketService } from '../../services';
import { ChatConfig } from './chat.config';
import { FormOptions } from '../../../../models';
import { AppObservableArray } from '../../../../utils/base';
import { FormModel } from '../../../../widgets';
import * as Peer from 'simple-peer';


/**
 * Workflow:
 *
 * Host ('#/apps/chat/video?initiate=): Initiate
 *                                      Call
 * Remote client: Copy signaling data from chat to form input and press enter
 *                Press answer
 *                Press connect
 *                Press call (so that host knows then how to establish the connection)
 * Host: Copy WebRTC offer from chat and copy to form input, press enter
 *       Press connect
 *
 * -> Video connection is established
 */

class RemoteConnection {
    peer: any;
    targetpeer: any;
    n = <any>navigator;

    constructor(private nativeRef: any) {
        this.n.getUserMedia = (
            this.n.getUserMedia || this.n.webkitGetUserMedia ||
            this.n.mozGetUserMedia || this.n.msGetUserMedia
        );
    }

    connect(initiator = false) {
        this.n.getUserMedia({video: true, audio: true}, (stream) => {
            this.peer = new Peer({
                initiator: initiator,
                trickle: false,
                stream: stream
            });

            this.peer.on('signal', (data) => {
                this.targetpeer = data;
            });

            this.peer.on('data', (data) => {
                console.log('Received message: ' + data);
            });

            this.peer.on('stream', (remoteStream) => {
                this.nativeRef.src = URL.createObjectURL(remoteStream);
                this.nativeRef.play();
            });

        }, (err) => {
            console.log('Failed to get stream', err);
        });
    }

    destroy() {
        this.peer.destroy();
    }

    signal() {
        this.peer.signal(JSON.parse(this.targetpeer));
    }

    setPeerResponse(data: any) {
        this.targetpeer = data;
    }

    getSignalingData() {
        return this.targetpeer;
    }
}

class ChatMessagesObservable extends AppObservableArray<Array<any>> {}

@Component({
    selector: 'dng-videochat',
    templateUrl: './videochat.component.html'
})
export class VideoChatComponent implements OnInit, OnDestroy, AfterViewChecked {

    private event = 'message';

    private stop$: Subject<void>;
    messages: ChatMessagesObservable;

    model: FormModel;
    options: FormOptions;

    @ViewChild('scrollMe', { static: true }) private scroll: ElementRef;

    @ViewChild('myvideo', { static: true }) myVideo: ElementRef;

    connection: RemoteConnection;

    constructor(private socket: SocketService) {

        this.stop$ = new Subject();
        this.messages = new ChatMessagesObservable();

        this.socket.onData(this.event)
            .pipe(takeUntil(this.stop$))
            .subscribe(data => {
                console.log(data);
                this.messages.addSubject(data.data);
            });

        this.model = new FormModel();
        this.model.addInputs(ChatConfig.formConfig);

        this.options = {
            noSubmitLabel: true,
            resetOnSubmit: true
        };
    }

    ngOnInit() {
        this.scrollToBottom();

        this.connection = new RemoteConnection(this.myVideo.nativeElement);
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
        this.connection.setPeerResponse(data.message);
        this.socket.send(this.event, {data: data.message});
    }

    initiate(initiate: boolean) {
        this.connection.connect(initiate);
    }

    call() {
        // Send WebRTC offer or answer to the server
        this.socket.send(this.event, {data: JSON.stringify(this.connection.getSignalingData())});
    }

    hangup() {
        // Send termination request to the other party also
        this.connection.destroy();
    }

    connect() {
        this.connection.signal();
    }
}
