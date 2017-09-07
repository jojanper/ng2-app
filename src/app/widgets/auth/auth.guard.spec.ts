import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

import { AuthGuard } from './auth.guard';
import { TestServiceHelper } from '../../../test_helpers';


describe('AuthGuard', () => {

    let user = null;
    let mockCookie = {
        getObject: () => {
            return user;
        }
    };

    const mockRouter = new TestServiceHelper.router();

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
        expect(mockRouter.getNavigateUrl()).toEqual('/auth/login');
    }));
});
