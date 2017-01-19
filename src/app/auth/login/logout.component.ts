import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'dng2-logout',
    template: require('./logout.component.html')
})

export class LogoutComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit() {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}
