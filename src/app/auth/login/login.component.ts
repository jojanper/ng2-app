import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

import { Config } from '../config';


@Component({
    selector: 'dng2-login',
    template: require('./login.component.html')
})

export class LoginComponent implements OnInit {
    returnUrl: string;

    loginForm: any;

    input1: string;
    input2: string;

    constructor(private cookieService: CookieService, private route: ActivatedRoute, private router: Router,
        private formBuilder: FormBuilder) {}

    ngOnInit() {
        // Redirect URL, if any
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

        this.loginForm = this.formBuilder.group({
            'username': ['', [Validators.required, Validators.minLength(4)]],
            'password': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
        });

        this.input1 = 'username';
        this.input2 = 'password';
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

    getGroupClass(control: any) {
        const classes = [];

        if (!control.valid) {
            classes.push('has-danger');
        } else {
            classes.push('has-success');
        }

        return classes.join(' ');
    }

    getInputClass(control: any) {
        const classes = [];

        if (!control.valid) {
            classes.push('form-control-danger');
        } else {
            classes.push('form-control-success');
        }

        return classes.join(' ');
    }
}
