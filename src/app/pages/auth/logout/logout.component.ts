import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../../application/app.reducers'
import { AppEventsService, ApiService } from '../../../services';
import { RouteManager, GoAction } from '../../../router';
import { LogoutSuccessAction } from '../../../rx/auth';


@Component({
    selector: 'dng-logout',
    template: require('./logout.component.html')
})

export class LogoutComponent implements OnInit {
    constructor(private store: Store<State>, private api: ApiService, private appEvents: AppEventsService) {}

    ngOnInit() {
        this.api.sendBackend('logout', null).subscribe(() => {
            // Clear user authentication status
            this.store.dispatch(new LogoutSuccessAction());

            // Redirect to login page
            const url = RouteManager.resolveByName('login-view');
            this.store.dispatch(new GoAction({path: [url]}));

            // Other parts of the application may be interested in logout activity
            // -> send logout event
            this.appEvents.sendEvent('logout');
        });
    }
}
