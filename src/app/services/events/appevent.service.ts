import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { AppEventMessage } from './appevent.type';


// Base class for application events
class AppEvent {
    observer: Observable<AppEventMessage>;
    private event: Subject<AppEventMessage> = new Subject<AppEventMessage>();
    protected type: string;

    constructor() {
        this.observer = this.event.asObservable();
    }

    sendEvent(id: number, text = '') {
        this.event.next({id: id, type: this.type, text: text});
        return true;
    }
}


// Event for logout
class LogoutEvent extends AppEvent {
    type = 'logout';
}


@Injectable()
export class AppEventsService {

    private events: any = {
        logout: new LogoutEvent()
    };

    getObserver(name: string) {
        return (this.events.hasOwnProperty(name)) ? this.events[name].observer : null;
    }

    sendEvent(name: string) {
        if ((this.events.hasOwnProperty(name))) {
            return this.events[name].sendEvent(0);
        }

        return false;
    }
}
