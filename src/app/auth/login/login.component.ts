import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

import { Config } from '../config';


@Component({
    selector: 'dng2-login',
    template: require('./login.component.html')
})

export class LoginComponent implements OnInit {
    returnUrl: string;
    loginForm: FormGroup;

    constructor(private cookieService: CookieService, private route: ActivatedRoute, private router: Router,
        private formBuilder: FormBuilder) {}

    ngOnInit() {
        // Redirect URL, if any
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

        this.loginForm = this.formBuilder.group({
            'username': ['', [Validators.required, Validators.minLength(4)]],
            'password': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
        });
    }

    login() {
        const user = {username: this.loginForm.value.username};
        const config: Config = new Config();

        // Store user details in globals cookie that keeps user logged in for 1 one day (or until they logout)
        let cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 1);
        const options: CookieOptionsArgs = {expires: cookieExp};
        this.cookieService.putObject(config.authObject(), user, options);
        this.router.navigate([this.returnUrl]);
    }
}
