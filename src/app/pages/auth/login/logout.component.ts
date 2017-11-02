import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

import { Config } from '../../../widgets';
import { AppEventsService } from '../../../services';

@Component({
    selector: 'dng-logout',
    template: require('./logout.component.html')
})

export class LogoutComponent implements OnInit {
    constructor(private cookieService: CookieService, private router: Router, private appEvents: AppEventsService) {}

    ngOnInit() {
        const config: Config = new Config();
        this.cookieService.remove(config.authObject());
        this.router.navigate(['/auth/login']);
        this.appEvents.sendEvent('logout');
    }
}
