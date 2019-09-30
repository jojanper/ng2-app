import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { goAction } from '../../router';
import { RouterService } from '../../services';
import { DropdownItem } from '../dropdown';


@Component({
    selector: 'dng-usermenu',
    templateUrl: './usermenu.component.html'
})
export class UserMenuComponent {
    @Input() store: Store<any>;
    @Input() authStatus: Observable<boolean>;

    authMenuItems: Array<DropdownItem>;

    constructor(protected routerService: RouterService) {
        this.authMenuItems = [
            DropdownItem.createAsRoute({
                url: routerService.resolveByName('auth.logout-view'),
                title: 'Logout'
            })
        ];
    }

    redirect(login: boolean) {
        const url = this.routerService.resolveByName((login) ? 'auth.login-view' : 'auth.register-view');
        this.store.dispatch(goAction({ path: [url] }));
    }
}
