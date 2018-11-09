import { async, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { GoAction } from '../../../router';
import { LoginComponent } from './login.component';
import { ApiService, AlertService, RouterService, BackendResponse } from '../../../services';
import { TestHttpHelper, TestFormHelper, TestServiceHelper,
    TestObservablesHelper, AuthResponseFixture } from '../../../../test_helpers';
import * as AuthActions from '../../../rx/auth';
import { AuthTestingModule, MOCK_AUTHROUTES } from '../auth.spec';
import { reducers } from '../../../rx/rx.reducers';


const sendInput = TestFormHelper.sendInput;
const submitDisabled = TestFormHelper.submitDisabled;

const user = {
    email: 'test@test.com',
    expires: 123456,
    validAt: Date.now()
} as AuthActions.User;

describe('Login Component', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let mockBackend: HttpTestingController;

    const mockActivatedRoute = {
        snapshot: {
            queryParams: {}
        }
    };

    const authTestingModule = new AuthTestingModule();

    const authResponse = new AuthResponseFixture(ApiService.rootUrl, 'login');

    const authStatus = new TestObservablesHelper.getUserAuthenticationStatus();
    //const mockStore = new TestServiceHelper.store([authStatus.observable]);
    const mockAlert = new TestServiceHelper.alertService();
    const mockRouteManager = new TestServiceHelper.RouterService(MOCK_AUTHROUTES);

    let mockStore;

    beforeEach(done => {
        //mockStore.reset();
        authStatus.setStatus(false);

        authTestingModule.init(
        [
            //{provide: Store, useValue: mockStore},
            {provide: ActivatedRoute, useValue: mockActivatedRoute},
            {provide: AlertService, useValue: mockAlert},
            {provide: RouterService, useValue: mockRouteManager}
        ],
        [
            StoreModule.forRoot({
                'apprx': combineReducers(reducers)
            })
        ]).then(() => {
            fixture = authTestingModule.getComponent(LoginComponent);
            fixture.detectChanges();
            mockBackend = TestHttpHelper.getMockBackend();
            mockStore = AuthTestingModule.TestBed.get(Store);
            spyOn(mockStore, 'dispatch').and.callThrough();
            done();
        });
    });

    it('should show login form', done => {
        // GIVEN login page
        // WHEN rendering login component
        fixture.whenStable().then(() => {

            // THEN login form should be present
            expect(fixture.nativeElement.querySelectorAll('form').length).toEqual(1);

            // AND form contains 2 inputs
            expect(fixture.nativeElement.querySelectorAll('form input').length).toEqual(2);

            // AND form contains one submit button
            expect(fixture.nativeElement.querySelectorAll('form button').length).toEqual(1);
            done();
        });
    });

    it('username is filled to login form', async(() => {
        fixture.whenStable().then(() => {
            sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], 'user').then(() => {
                fixture.detectChanges();
                expect(submitDisabled(fixture)).toBeTruthy();
            });
        });
    }));

    const hasDangerClass = (element: any): boolean => {
        return (element.getAttribute('class').indexOf('is-invalid') > -1) ? true : false;
    };

    it('invalid username is typed', async(() => {
        fixture.whenStable().then(() => {
            const element = fixture.nativeElement.querySelectorAll('input')[0];
            sendInput(fixture, element, 'u').then(() => {
                fixture.detectChanges();
                expect(hasDangerClass(element)).toBeTruthy();
            });
        });
    }));

    it('invalid password is typed', async(() => {
        fixture.whenStable().then(() => {
            const element = fixture.nativeElement.querySelectorAll('input')[1];
            sendInput(fixture, element, 'pa').then(() => {
                fixture.detectChanges();
                expect(hasDangerClass(element)).toBeTruthy();
            });
        });
    }));

    it('password is filled to login form', async(() => {
        fixture.whenStable().then(() => {
            sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[1], '123456').then(() => {
                fixture.detectChanges();
                expect(submitDisabled(fixture)).toBeTruthy();
            });
        });
    }));

    it('sign-in button is clicked', async(() => {
        // GIVEN login form has all the needed details
        sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], 'test');
        sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[1], '123456');
        fixture.detectChanges();

        fixture.whenStable().then(() => {

            expect(submitDisabled(fixture)).toBeFalsy();

            // WHEN user click sign-in button
            const button = fixture.nativeElement.querySelector('form button');
            button.click();

            mockBackend.expectOne(authResponse.rootUrl).flush(authResponse.rootResponse);
            mockBackend.expectOne(authResponse.url).flush(authResponse.urlResponse);
            mockBackend.verify();

            //fixture.detectChanges();
            mockStore.dispatch(new AuthActions.LoginSuccessAction(user));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const ncalls = mockStore.dispatch.calls.count();

                console.log(mockStore.dispatch.calls.count());
                console.log(mockStore.dispatch.calls.argsFor(0));
                console.log(mockStore.dispatch.calls.argsFor(1));
                console.log(mockStore.dispatch.calls.argsFor(2));

                const lastAction = mockStore.dispatch.calls.argsFor(ncalls - 1);
                console.log(lastAction[0].payload.path);
                expect(lastAction[0].payload.path).toEqual(['/']);

                // AND user is directed to home page
                /*
                let action = <GoAction>mockStore.getDispatchAction(0);
                expect(action.type).toEqual(AuthActions.ActionTypes.AUTHENTICATE);

                // AND no other actions are called
                action = <GoAction>mockStore.getDispatchAction(1);
                expect(action).toBeUndefined();

                // -----

                // WHEN user status changes to authenticated
                authStatus.setStatus(true);

                // THEN user is directed to home page
                action = <GoAction>mockStore.getDispatchAction(1);
                expect(action.payload.path).toEqual(['/']);
                */
            });
        });
    }));
});
