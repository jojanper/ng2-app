import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RouterService } from '../../services';
import { getUserAuthenticationStatus } from '../../rx/rx.reducers';


@Component({
    selector: 'dng-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class DraalAppHeaderComponent {
    authStatus: Observable<boolean>;

    // Menu items on the left-hand side of the header component
    menuLeft: Array<any>;

    constructor(public store: Store<any>, routerService: RouterService) {
        this.menuLeft = routerService.topMenuItems('left');
        this.authStatus = this.store.select(getUserAuthenticationStatus);
    }
}
