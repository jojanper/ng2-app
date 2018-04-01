import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../../application/app.reducers';
import { LogoutAction } from '../../../rx/auth';


@Component({
    selector: 'dng-logout',
    template: require('./logout.component.html')
})

export class LogoutComponent implements OnInit {
    constructor(private store: Store<State>) {}

    ngOnInit() {
        this.store.dispatch(new LogoutAction());
    }
}
