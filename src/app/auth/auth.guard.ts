import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private cookieService: CookieService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let user = this.cookieService.getObject('currentUser');
        if (user) {
            return true;
        }

        // Not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});

        return false;
    }
}
