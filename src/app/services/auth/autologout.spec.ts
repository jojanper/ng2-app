import { TestBed, tick, fakeAsync, discardPeriodicTasks, getTestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { AutoLogout } from './autologout';
import { AlertService } from '../alert';
import { LogoutAction, ActionTypes } from '../../rx/auth';
import { TestServiceHelper, TestObservablesHelper } from '../../../test_helpers';


describe('AutoLogout Service', () => {
    let service: AutoLogout;

    const mockAlert = new TestServiceHelper.alertService();
    const userState = new TestObservablesHelper.selectUserState();

    const userStateObservable = userState.observable;
    const mockStore = new TestServiceHelper.store([
        userStateObservable,
        userStateObservable
    ]);

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AutoLogout,
                {provide: AlertService, useValue: mockAlert},
                {provide: Store, useValue: mockStore}
            ]
        }).compileComponents().then(() => {
            service = getTestBed().get(AutoLogout);

            mockStore.reset();
            mockAlert.reset();

            done();
        });
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    function logoutTest() {
        // WHEN user state changes to authenticated
        userState.setAuthStatus(true);
        discardPeriodicTasks();
        tick(3000);

        // THEN info is shared to used
        expect(mockAlert.getCallsCount('info')).toEqual(1);

        // AND logout action is fired
        const action = <LogoutAction>mockStore.getDispatchAction(0);
        expect(action.type).toEqual(ActionTypes.LOGOUT);
    }

    it('user session expires', fakeAsync(() => {
        logoutTest();
    }));

    it('user logouts before session expiration', fakeAsync(() => {
        // When user state is unauthenticated, no actions are fired
        userState.setAuthStatus(false);
        const action = <LogoutAction>mockStore.getDispatchAction(0);
        expect(action).toEqual(undefined);

        logoutTest();
    }));
});
