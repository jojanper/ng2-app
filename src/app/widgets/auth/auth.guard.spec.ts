import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

import { AuthGuard } from './auth.guard';


describe('AuthGuard', () => {

    let user = null;
    let mockCookie = {
        getObject: () => {
            return user;
        }
    };

    let redirectUrl = null;
    let mockRouter = {
        navigate: (url) => {
            redirectUrl = url[0];
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:  [
                AuthGuard,
                {provide: CookieService, useValue: mockCookie},
                {provide: Router, useValue: mockRouter},
            ]
        });
    });

    it('succeeds for authenticated user', inject([AuthGuard], (guard) => {
        user = {username: 'test'};
        expect(guard.canActivate(null, null)).toBeTruthy();
        user = null;
    }));

    it('fails for unauthenticated user', inject([AuthGuard], (guard) => {
        expect(guard.canActivate(null, {})).toBeFalsy();
        expect(redirectUrl).toEqual('/auth/login');
    }));
});
