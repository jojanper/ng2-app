import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { AuthGuard } from './auth.guard';
import { GoAction } from '../../router';
import { TestServiceHelper, TestObservablesHelper } from '../../../test_helpers';


describe('AuthGuard', () => {

    const authStatus = new TestObservablesHelper.getUserAuthenticationStatus();
    const mockStore = new TestServiceHelper.store([authStatus.observer]);

    beforeEach(() => {
        mockStore.reset();
        authStatus.setStatus(false);

        TestBed.configureTestingModule({
            providers:  [
                AuthGuard,
                {provide: Store, useValue: mockStore}
            ]
        });
    });

    fit('succeeds for authenticated user', inject([AuthGuard], (guard) => {
        authStatus.setStatus(true);
        expect(guard.canActivate(null, null)).toBeTruthy();
    }));

    //it('fails for unauthenticated user', inject([AuthGuard], (guard) => {
    fit('fails for unauthenticated user', done => {

        //authStatus.setStatus(false);
        //console.log('COMPILE');
        getTestBed().compileComponents().then(() => {

            //console.log('COMPILED');

            const guard = getTestBed().get(AuthGuard);

            //console.log('FAILURE');
            authStatus.setStatus(false);

            /*const status =*/ guard.canActivate(null, {url: 1});
            //console.log(status);
            //console.log('STATUS');
            //status.subscribe((authenticated) => {
                //expect(authenticated).toBeFalsy();

                const action = <GoAction>mockStore.getDispatchAction();
                expect(action.payload.path).toEqual(['/auth/login']);
                done();
            //});
        });
    });
    //}));
});
