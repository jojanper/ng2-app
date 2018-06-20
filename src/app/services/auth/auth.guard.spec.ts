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
    let authStatus: any;
    let mockStore: any;

    const mockRouteManager = new TestServiceHelper.RouterService({
        auth: AUTHROUTES
    });

    beforeEach(done => {
        authStatus = new TestObservablesHelper.getUserAuthenticationStatus();
        mockStore = new TestServiceHelper.store([
            authStatus.observable
        ]);
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

    it('succeeds for authenticated user', fakeAsync(() => {
        const oldCount = mockStore.selectCount;

        guard.canActivate(null, null);
        expect(oldCount + 1).toEqual(mockStore.selectCount);

        // User state changes to authenticated
        authStatus.setStatus(true);

        // No dispatch action is performed
        expect(<GoAction>mockStore.getDispatchAction(oldCount)).toBeUndefined();
    }));

    it('unauthenticated user is redirected to login page', fakeAsync(() => {
        const oldCount = mockStore.selectCount;

        const state = {root: null, url: 'foo'} as RouterStateSnapshot;
        guard.canActivate(null, state);
        expect(oldCount + 1).toEqual(mockStore.selectCount);

        // User state is unauthenticated
        authStatus.setStatus(false);

        // Redirect to login page is dispatched
        const action = <GoAction>mockStore.getDispatchAction(oldCount);
        expect(action.payload.path).toEqual(['/auth/login']);
    }));
});
