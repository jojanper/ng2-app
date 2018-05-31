import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppEventMessage } from './appevent.type';
import { AppObservableObject } from '../../utils/base';


// Base class for application events
class AppEvent extends AppObservableObject<AppEventMessage> {
    protected type: string;

    constructor() {
        super();
    }

    sendEvent(id: number, data: any = null): boolean {
        this.setObject({id: id, type: this.type, text: null, data});
        return true;
    }
}


export const AppEventTypes = {
    LOGOUT: 'logout',
    SIDEMENU: 'sidemenu'
};

// Event for logout
class LogoutEvent extends AppEvent {
    type = AppEventTypes.LOGOUT;
}

// Event for sidemenu
class SideMenuEvent extends AppEvent {
    type = AppEventTypes.SIDEMENU;
}


@Injectable()
export class AppEventsService {

    private events: any = {};

    constructor() {
        this.events[AppEventTypes.LOGOUT] = new LogoutEvent();
        this.events[AppEventTypes.SIDEMENU] = new SideMenuEvent();
    }

    getObservable(name: string): Observable<AppEventMessage> | null {
        return (this.events.hasOwnProperty(name)) ? this.events[name].observable : null;
    }

    sendEvent(name: string, data: any = null): boolean {
        if ((this.events.hasOwnProperty(name))) {
            return this.events[name].sendEvent(0, data);
        }

        return false;
    }
}
