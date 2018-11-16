import { TestBed, getTestBed, fakeAsync } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { GoAction } from '../../router';
import { RouterService } from '../router';
import * as AuthActions from '../../rx/auth';
import { TestServiceHelper, AuthResponseFixture } from '../../../test_helpers';
import { reducers } from '../../rx/rx.reducers';


const AUTHROUTES = {
    url: 'auth',
    children: [
        {
            url: 'login',
            name: 'auth.login-view'
        }
    ]
};

const USER = AuthResponseFixture.User();


describe('AuthGuard', () => {
    let guard: AuthGuard;
    let store: any;

    const mockRouteManager = new TestServiceHelper.RouterService([
        AUTHROUTES
    ]);

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    'apprx': combineReducers(reducers)
                })
            ],
            providers:  [
                AuthGuard,
                {provide: RouterService, useValue: mockRouteManager}
            ]
        }).compileComponents().then(() => {
            guard = getTestBed().get(AuthGuard);
            store = getTestBed().get(Store);
            spyOn(store, 'dispatch').and.callThrough();
            done();
        });
    });

    it('succeeds for authenticated user', fakeAsync(() => {
        // GIVEN authenticated user
        const authAction = new AuthActions.LoginSuccessAction(USER);
        store.dispatch(authAction);

        // WHEN user authentication status is checked by the auth guard
        const observable = guard.canActivate(null, null);

        // THEN no additional actions are performed (other than the login success)
        const ncalls = store.dispatch.calls.count();
        expect(ncalls).toEqual(1);
        const action = store.dispatch.calls.argsFor(0)[0];
        expect(action.type).toEqual(authAction.type);
        expect(action.payload).toEqual(authAction.payload);

        // AND auth guard indicates that user is logged in
        let isAuthenticated = false;
        observable.subscribe(authenticated => {
            isAuthenticated = authenticated;
        });

        expect(isAuthenticated).toBeTruthy();
    }));

    it('unauthenticated user is redirected to login page', fakeAsync(() => {
        // GIVEN authenticated user

        // WHEN user authentication status is checked by the auth guard
        const state = {root: null, url: 'foo'} as RouterStateSnapshot;
        guard.canActivate(null, state);

        // THEN one action is called
        const ncalls = store.dispatch.calls.count();
        expect(ncalls).toEqual(1);

        // AND action is login redirect action
        const action = store.dispatch.calls.argsFor(0)[0];
        const refAction = new GoAction({path: ['/auth/login']});
        expect(action.type).toEqual(refAction.type);
        expect(action.payload.path).toEqual(refAction.payload.path);
        expect(action.payload.query.returnUrl).toEqual(state.url);
    }));
});
