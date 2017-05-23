import { Injectable } from '@angular/core';

import { AppEventMessage } from './appevent.type';
import { AppObserver } from '../../widgets/base';


// Base class for application events
class AppEvent extends AppObserver<AppEventMessage> {
    protected type: string;

    constructor() {
        super();
    }

    sendEvent(id: number, text = ''): boolean {
        this.setSubject({id: id, type: this.type, text: text});
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

    sendEvent(name: string): boolean {
        if ((this.events.hasOwnProperty(name))) {
            return this.events[name].sendEvent(0);
        }

        return false;
    }
}
