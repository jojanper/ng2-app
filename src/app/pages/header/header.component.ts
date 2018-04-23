import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { RouteManager } from '../../router';
import { State } from '../../application/app.reducers';
import { getUserAuthenticationStatus } from '../../rx/rx.reducers';


@Component({
    selector: 'dng-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class DraalAppHeaderComponent {
    authStatus: Observable<boolean>;

    // Menu items on the left-hand side of the header component
    menuLeft = RouteManager.topMenuItems('left');

    constructor(protected store: Store<State>) {
        this.authStatus = this.store.select(getUserAuthenticationStatus);
    }
}
