import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dng2-login',
    template: require('./login.component.html')
})

export class LoginComponent implements OnInit {
    model: any = {};
    returnUrl: string;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        // Redirect URL, if any
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    }

    login() {
        let user = {
            username: this.model.username
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate([this.returnUrl]);
    }
}
