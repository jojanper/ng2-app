import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Observer } from 'rxjs/Observer';
//import * as socketIo from 'socket.io-client';


//const SERVER_URL = 'http://localhost:3000';


@Injectable()
export class RealTimeService {
    //private socket;

    public initSocket(): void {
        //this.socket = socketIo('/');
    }

    public send(message: any): void {
        //this.socket.emit('message', message);
        console.log(message);
    }

    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            //this.socket.on('message', (data: any) => observer.next(data));
            observer.next('DONE');
        });
    }
}
