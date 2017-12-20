import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../../application/app.reducers';
import { AppEventsService, ApiService, AppEventTypes } from '../../../services';
import { RouteManager, GoAction } from '../../../router';
import { LogoutSuccessAction } from '../../../rx/auth';


@Component({
    selector: 'dng-logout',
    template: require('./logout.component.html')
})

export class LogoutComponent implements OnInit {
    constructor(private store: Store<State>, private api: ApiService, private appEvents: AppEventsService) {}

    private dispatch(view: string): void {
        const action = new GoAction({path: [RouteManager.resolveByName(view)]});
        this.store.dispatch(action);
    }

    ngOnInit() {
        this.api.sendBackend('logout', null).subscribe(
        () => {
            // Clear user authentication status
            this.store.dispatch(new LogoutSuccessAction());

            // Redirect to login page
            this.dispatch('login-view');

            // Other parts of the application may be interested in logout activity
            // -> send logout event
            this.appEvents.sendEvent(AppEventTypes.LOGOUT);
        },
        // On error go to home view
        () => {
            this.dispatch('home-view');
        });
    }
}
