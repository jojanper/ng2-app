import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { logoutAction } from '../../../rx/auth';


@Component({
    selector: 'dng-logout',
    templateUrl: './logout.component.html'
})

export class LogoutComponent implements OnInit {
    constructor(private store: Store<any>) { }

    ngOnInit() {
        this.store.dispatch(logoutAction());
    }
}
