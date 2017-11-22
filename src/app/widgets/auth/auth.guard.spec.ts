import { TestBed, inject } from '@angular/core/testing';
import { CookieService } from 'angular2-cookie/core';
import { Store } from '@ngrx/store';

import { AuthGuard } from './auth.guard';
import { GoAction } from '../../router';
import { TestServiceHelper } from '../../../test_helpers';


describe('AuthGuard', () => {

    let user = null;
    let mockCookie = {
        getObject: () => {
            return user;
        }
    };

    const mockStore = new TestServiceHelper.store();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:  [
                AuthGuard,
                {provide: CookieService, useValue: mockCookie},
                {provide: Store, useValue: mockStore},
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

        const action = <GoAction>mockStore.getDispatchAction();
        expect(action.payload.path).toEqual(['/auth/login']);
    }));
});
