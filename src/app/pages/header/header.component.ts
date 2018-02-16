import { Component } from '@angular/core';

import { RouteManager } from '../../router';
import { DropdownItem } from '../../widgets';


@Component({
    selector: 'dng-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class DraalAppHeaderComponent {
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
}
