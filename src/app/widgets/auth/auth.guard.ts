import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { Store } from '@ngrx/store';

import { RouteManager } from '../../models';
import { GoAction } from '../../models/routes.actions';
import { State } from '../../app.reducers';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private cookieService: CookieService, private store: Store<State>) { }

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let user = this.cookieService.getObject('currentUser');
        if (user) {
            return true;
        }

        // Not logged in so redirect to login page with the return url
        this.store.dispatch(new GoAction({
            path: [RouteManager.resolveByName('login-view')],
            query: {returnUrl: state.url}
        }));

        return false;
    }
}
