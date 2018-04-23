import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { RouteManager, GoAction } from '../../router';
import { DropdownItem } from '../dropdown';


@Component({
  selector: 'dng-usermenu',
  templateUrl: './usermenu.component.html'
})
export class UserMenuComponent {
    @Input() store: Store<any>;
    @Input() authStatus: Observable<boolean>;

    authMenuItems = [
        DropdownItem.createAsRoute({
            url: RouteManager.resolveByName('logout-view'),
            title: 'Logout'
        })
    ];

    redirect(login: boolean) {
        const url = RouteManager.resolveByName((login) ? 'login-view' : 'register-view');
        this.store.dispatch(new GoAction({path: [url]}));
    }
}
