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
                { provide: AlertService, useValue: mockAlert },
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

    it('user session expires', fakeAsync(() => {
        // WHEN user state changes to authenticated
        const authAction = AuthActions.loginSuccessAction({ payload: USER });
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
        expect(action.type).toEqual(AuthActions.logoutAction().type);
    }));

    it('user logouts before session expiration', fakeAsync(() => {
        // When logout occurs for authenticated user, the existing
        // login subscription is terminated and new subscription is
        // started to wait for user login.
        // -> Test that login subscription is reset
        //    -> Reset will override the current Jasmine spy
        const s1 = s.loginSubscription;

        const authAction2 = AuthActions.loginSuccessAction({ payload: USER });
        store.dispatch(authAction2);

        expect(s1.unsubscribe.calls).toBeDefined();

        const authAction = AuthActions.logoutSuccessAction({ redirectView: 'auth.login-view' });
        store.dispatch(authAction);

        expect(s.loginSubscription.unsubscribe.calls).toBeUndefined();
    }));
});
