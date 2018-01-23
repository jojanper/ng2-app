import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as socketIo from 'socket.io-client';


@Injectable()
export class SocketService {
    protected socket;

    constructor() {
        this.socket = socketIo('/');
    }

    public send(event: string, data: any): void {
        this.socket.emit(event, data);
    }

    public onData(event: string): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on(event, (data: any) => observer.next(data));
        });
    }
}
