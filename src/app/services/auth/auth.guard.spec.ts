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

    fit('succeeds for authenticated user', fakeAsync(() => {
        const oldCount = mockStore.actionCount;
        console.log('START');
        console.log(mockStore.actionCount);
        mockStore.reset();
        console.log(mockStore.actionCount);
        console.log('ACTIVATE');
        guard.canActivate(null, null);
        expect(oldCount + 1).toEqual(mockStore.actionCount);
        console.log(mockStore.actionCount);
        authStatus.setStatus(true);
        console.log('TRUE');
        console.log(mockStore.actionCount);
        console.log('END');
        console.log(<GoAction>mockStore.getDispatchAction());
        expect(<GoAction>mockStore.getDispatchAction()).toBeUndefined();
        console.log('DONE');
    }));

    fit('unauthenticated user is redirected to login page', fakeAsync(() => {
        const state = {root: null, url: 'foo'} as RouterStateSnapshot;
        guard.canActivate(null, state);

        authStatus.setStatus(false);

        const action = <GoAction>mockStore.getDispatchAction();
        expect(action.payload.path).toEqual(['/auth/login']);
    }));
});
