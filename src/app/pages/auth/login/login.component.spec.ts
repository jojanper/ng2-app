import { async, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { GoAction } from '../../../router';
import { LoginComponent } from './login.component';
import { ApiService, AlertService, RouterService } from '../../../services';
import { TestHttpHelper, TestFormHelper, TestServiceHelper,
    AuthResponseFixture } from '../../../../test_helpers';
import * as AuthActions from '../../../rx/auth';
import { AuthTestingModule, MOCK_AUTHROUTES } from '../auth.spec';
import { reducers } from '../../../rx/rx.reducers';


const user = AuthResponseFixture.User();

const sendInput = TestFormHelper.sendInput;
const submitDisabled = TestFormHelper.submitDisabled;

describe('Login Component', () => {
    let store;
    let fixture: ComponentFixture<LoginComponent>;
    let mockBackend: HttpTestingController;

    const mockActivatedRoute = {
        snapshot: {
            queryParams: {}
        }
    };

    const authTestingModule = new AuthTestingModule();

    const authResponse = new AuthResponseFixture(ApiService.rootUrl, 'login', user);

    const mockAlert = new TestServiceHelper.alertService();
    const mockRouteManager = new TestServiceHelper.RouterService(MOCK_AUTHROUTES);

    beforeEach(done => {
        authTestingModule.init(
        [
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
            store = AuthTestingModule.TestBed.get(Store);
            spyOn(store, 'dispatch').and.callThrough();
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
            store.dispatch(new AuthActions.LoginSuccessAction(user));

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const ncalls = store.dispatch.calls.count();

                // THEN 3 store actions are available
                expect(ncalls).toEqual(3);

                // First store action authenticates user
                const action1 = new AuthActions.AuthenticateAction({data: user});
                const firstStoreAction = store.dispatch.calls.argsFor(0)[0];
                expect(firstStoreAction.type).toEqual(action1.type);
                expect(firstStoreAction.payload).toEqual(action1.payload);

                // Second store action finalizes user authentication
                const action2 = new AuthActions.LoginSuccessAction(user);
                const secondStoreAction = store.dispatch.calls.argsFor(1)[0];
                expect(secondStoreAction.type).toEqual(action2.type);
                expect(secondStoreAction.payload).toEqual(action2.payload);

                // And finally user is redirected to home page
                const action3 = new GoAction({path: ['/']});
                const lastStoreAction = store.dispatch.calls.argsFor(ncalls - 1)[0];
                expect(lastStoreAction.type).toEqual(action3.type);
                expect(lastStoreAction.payload).toEqual(action3.payload);
            });
        });
    }));
});
