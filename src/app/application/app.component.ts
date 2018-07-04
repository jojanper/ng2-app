import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from './app.reducers';
import { ApiService, AppEventsService, AppEventTypes,
    AutoLogout, RouterService } from '../services';
import { UserCookieLoadAction } from '../rx/auth';
import { APPROUTES } from '../pages/pages.routes.config';


/**
 * Menu items that should appear on the left-hand side of the header component.
 */
const MENU_LEFT = ['api-view', 'apps-view', 'about-view', 'demo-view'];


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
        store: Store<State>, protected autologout: AutoLogout,
        protected routeManager: RouterService) {

        this.routeManager.setInitialRoutes(APPROUTES, MENU_LEFT);

        store.dispatch(new UserCookieLoadAction());

        // Side menu just got changed -> adjust template classes
        appEvents.getObservable(AppEventTypes.SIDEMENU).subscribe((event) => {
            const hasItems = event.data.menuItems.length;
            this.sidemenuCls = (hasItems) ? 'col-sm-2' : '';
            this.contentCls = (hasItems) ? 'col-sm-10' : 'col-sm-12';
        });
    }
}
