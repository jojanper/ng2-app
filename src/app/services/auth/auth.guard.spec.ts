import { TestBed, getTestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { GoAction } from '../../router';
import { TestServiceHelper, TestObservablesHelper } from '../../../test_helpers';


describe('AuthGuard', () => {
    let guard: AuthGuard;

    const authStatus = new TestObservablesHelper.getUserAuthenticationStatus();
    const mockStore = new TestServiceHelper.store([authStatus.observable]);

    beforeEach(done => {
        mockStore.reset();
        authStatus.setStatus(false);

        TestBed.configureTestingModule({
            providers:  [
                AuthGuard,
                {provide: Store, useValue: mockStore}
            ]
        }).compileComponents().then(() => {
            guard = getTestBed().get(AuthGuard);
            done();
        });
    });

    it('succeeds for authenticated user', () => {
        authStatus.setStatus(true);
        guard.canActivate(null, null);
        expect(<GoAction>mockStore.getDispatchAction()).toBeUndefined();
    });

    it('unauthenticated user is redirected to login page', () => {
        authStatus.setStatus(false);

        const state = {root: null, url: 'foo'} as RouterStateSnapshot;
        guard.canActivate(null, state);

        const action = <GoAction>mockStore.getDispatchAction();
        expect(action.payload.path).toEqual(['/auth/login']);
    });
});
