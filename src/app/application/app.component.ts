import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from './app.reducers';
import { ApiService, AppEventsService, AppEventTypes, AutoLogout } from '../services';
import { UserCookieLoadAction } from '../rx/auth';

import '../../style/app.scss';

@Component({
    selector: 'dng-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    url = 'https://github.com/jojanper/angular-app';

    sidemenuCls = '';
    contentCls = 'col-sm-12';

    constructor(protected api: ApiService, appEvents: AppEventsService,
        store: Store<State>, protected autologout: AutoLogout) {

        store.dispatch(new UserCookieLoadAction());

        // Side menu just got changed -> adjust template classes
        appEvents.getObservable(AppEventTypes.SIDEMENU).subscribe((event) => {
            const hasItems = event.data.menuItems.length;
            this.sidemenuCls = (hasItems) ? 'col-sm-2' : '';
            this.contentCls = (hasItems) ? 'col-sm-10' : 'col-sm-12';
        });
    }
}
