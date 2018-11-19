import { TestBed, tick, fakeAsync, discardPeriodicTasks, getTestBed } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';

import { AutoLogout } from './autologout';
import { AlertService } from '../alert';
import * as AuthActions from '../../rx/auth';
import { TestServiceHelper, AuthResponseFixture } from '../../../test_helpers';
import { reducers } from '../../rx/rx.reducers';


const USER = AuthResponseFixture.User();


describe('AutoLogout Service', () => {
    let service: AutoLogout;
    let store: any;
    let s: any;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(done => {
        mockAlert.reset();

        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    'apprx': combineReducers(reducers)
                })
            ],
            providers: [
                AutoLogout,
                {provide: AlertService, useValue: mockAlert},
            ]
        }).compileComponents().then(() => {
            service = getTestBed().get(AutoLogout);
            store = getTestBed().get(Store);
            spyOn(store, 'dispatch').and.callThrough();
            s = service;
            spyOn(s.loginSubscription, 'unsubscribe').and.callThrough();
            done();
        });
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    /*
    function logoutTest(offset = 0) {
        // WHEN user state changes to authenticated
        const authAction = new AuthActions.LoginSuccessAction(USER);
        store.dispatch(authAction);
        discardPeriodicTasks();

        // AND time passes the session expiration time
        tick(3000);

        // THEN info regarding session expiration is shared to user
        expect(mockAlert.getCallsCount('info')).toEqual(1);

        // AND logout action is fired
        const ncalls = store.dispatch.calls.count();
        expect(ncalls).toEqual(offset + 2);
        const action = store.dispatch.calls.argsFor(offset + 1)[0];
        expect(action.type).toEqual(AuthActions.ActionTypes.LOGOUT);
    }
    */

    it('user session expires', fakeAsync(() => {
        // WHEN user state changes to authenticated
        const authAction = new AuthActions.LoginSuccessAction(USER);
        store.dispatch(authAction);
        discardPeriodicTasks();

        // AND time passes the session expiration time
        tick(3000);

        // THEN info regarding session expiration is shared to user
        expect(mockAlert.getCallsCount('info')).toEqual(1);

        // AND logout action is fired
        const ncalls = store.dispatch.calls.count();
        expect(ncalls).toEqual(2);
        const action = store.dispatch.calls.argsFor(1)[0];
        expect(action.type).toEqual(AuthActions.ActionTypes.LOGOUT);
    }));

    fit('user logouts before session expiration', fakeAsync(() => {
        // When user state is unauthenticated, no actions are fired
        //userState.setAuthStatus(false);
        //const action = <LogoutAction>mockStore.getDispatchAction(0);
        //expect(action).toEqual(undefined);
        //const s1 = service.loginSubscription;
        //let subscription: any;
        //subscription = service.loginSubscription;

        const s1 = s.loginSubscription;
        expect(s1.unsubscribe.calls).toBeDefined();

        const authAction2 = new AuthActions.LoginSuccessAction(USER);
        store.dispatch(authAction2);

        //console.log('START');

        const authAction = new AuthActions.LogoutSuccessAction('auth.login-view')
        store.dispatch(authAction);
        //const s2 = service.loginSubscription;

        //expect(s1).toEqual(s2);

        //logoutTest(2);

        //expect(s1.loginSubscription.unsubscribe.calls).toBeDefined();
        expect(s.loginSubscription.unsubscribe.calls).toBeUndefined();
        //expect(s1).toEqual(s.loginSubscription);

        //console.log(s.loginSubscription.unsubscribe.calls.count());
    }));
});
