import { Component } from '@angular/core';

import { RouteManager } from '../../router';

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
}
