import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { LogoutAction } from '../../../rx/auth';


@Component({
    selector: 'dng-logout',
    template: require('./logout.component.html')
})

export class LogoutComponent implements OnInit {
    constructor(private store: Store<any>) {}

    ngOnInit() {
        this.store.dispatch(new LogoutAction());
    }
}
