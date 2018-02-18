import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RouteManager } from '../../router';
import { DropdownItem } from '../../widgets';
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

    // Menu items on the right-hand side of the header component
    menuRight = RouteManager.topMenuItems('right');

    authMenuItems = [
        DropdownItem.createAsRoute({
            url: RouteManager.resolveByName('login-view'),
            title: 'Sign in'
        }),
        DropdownItem.createAsLink({
            url: 'http://yle.fi',
            title: 'Yle'
        }),
        DropdownItem.createAsDivider(),
        DropdownItem.createAsLink({
            url: 'http://nokia.fi',
            title: 'Nokia'
        }),
        DropdownItem.createAsCallback({
            url: '',
            title: 'Nokia'
        }, () => {
            console.log(this);
        })
    ];

    constructor(protected store: Store<State>) {
        this.authStatus = this.store.select(getUserAuthenticationStatus);
    }
}
