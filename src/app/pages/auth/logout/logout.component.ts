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
            this.store.dispatch(new LogoutSuccessAction());

            const url = RouteManager.resolveByName('login-view');
            this.store.dispatch(new GoAction({path: [url]}));
            this.appEvents.sendEvent('logout');
        });
    }
}
