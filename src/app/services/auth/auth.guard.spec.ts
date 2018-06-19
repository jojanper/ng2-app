import { TestBed, getTestBed, fakeAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { GoAction } from '../../router';
import { RouterService } from '../router';
import { TestServiceHelper, TestObservablesHelper } from '../../../test_helpers';


const AUTHROUTES = {
    url: 'auth',
    children: {
        'auth.login': {
            url: 'login',
            name: 'auth.login-view'
        }
    }
};


describe('AuthGuard', () => {
    let guard: AuthGuard;

    const mockRouteManager = new TestServiceHelper.RouterService({
        auth: AUTHROUTES
    });
    const authStatus = new TestObservablesHelper.getUserAuthenticationStatus();
    const mockStore = new TestServiceHelper.store([
        authStatus.observable
    ]);

    beforeEach(done => {
        mockStore.reset();
        authStatus.setStatus(false);

        TestBed.configureTestingModule({
            providers:  [
                AuthGuard,
                {provide: Store, useValue: mockStore},
                {provide: RouterService, useValue: mockRouteManager}
            ]
        }).compileComponents().then(() => {
            guard = getTestBed().get(AuthGuard);
            done();
        });
    });

    it('unauthenticated user is redirected to login page', fakeAsync(() => {
        const oldCount = mockStore.actionCount;

        const state = {root: null, url: 'foo'} as RouterStateSnapshot;
        guard.canActivate(null, state);
        expect(oldCount + 1).toEqual(mockStore.actionCount);

        authStatus.setStatus(false);

        const action = <GoAction>mockStore.getDispatchAction(oldCount);
        expect(action.payload.path).toEqual(['/auth/login']);
        authStatus.close();
    }));

    it('succeeds for authenticated user', fakeAsync(() => {
        const oldCount = mockStore.actionCount;

        guard.canActivate(null, null);
        expect(oldCount + 1).toEqual(mockStore.actionCount);

        authStatus.setStatus(true);

        expect(<GoAction>mockStore.getDispatchAction(oldCount)).toBeUndefined();
        authStatus.close();
    }));
});
