import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

import { Config } from '../config';
import { FormModel } from '../../widgets';


@Component({
    selector: 'dng2-login',
    template: require('./login.component.html')
})

export class LoginComponent implements OnInit {
    returnUrl: string;

    private model: FormModel;

    constructor(private cookieService: CookieService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        // Redirect URL, if any
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

        // Form definition in terms of a model
        this.model = new FormModel({
            'username': {
                label: 'Username',
                placeholder: 'Enter username (4 characters at minimum)',
                validators: [{name: 'required'}, {name: 'minlength', value: 4}]
            },
            'password': {
                type: 'password',
                label: 'Password',
                placeholder: 'Enter password (length between 4-10 characters)',
                validators: [{name: 'required'}, {name: 'minlength', value: 4}, {name: 'maxlength', value: 10}]
            }
        }, ['username', 'password']);
    }

    login(data: any) {
        const user = {username: data.username};
        const config: Config = new Config();

        // Store user details in globals cookie that keeps user logged in for 1 one day (or until they logout)
        let cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 1);
        const options: CookieOptionsArgs = {expires: cookieExp};
        this.cookieService.putObject(config.authObject(), user, options);
        this.router.navigate([this.returnUrl]);
    }
}
