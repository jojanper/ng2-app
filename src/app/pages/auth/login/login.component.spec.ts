import { async, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { GoAction } from '../../../router';
import { LoginComponent } from './login.component';
import { ApiService, AlertService, RouterService } from '../../../services';
import { TestHttpHelper, TestFormHelper, TestServiceHelper,
    TestObservablesHelper, AuthResponseFixture } from '../../../../test_helpers';
import * as AuthActions from '../../../rx/auth';
import { AuthTestingModule } from '../auth.spec';


const sendInput = TestFormHelper.sendInput;
const submitDisabled = TestFormHelper.submitDisabled;

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
    const mockStore = new TestServiceHelper.store([authStatus.observable]);
    const mockAlert = new TestServiceHelper.alertService();
    const mockRouteManager = new TestServiceHelper.RouterService();

    beforeEach(done => {
        mockStore.reset();
        authStatus.setStatus(false);

        authTestingModule.init([
            {provide: Store, useValue: mockStore},
            {provide: ActivatedRoute, useValue: mockActivatedRoute},
            {provide: AlertService, useValue: mockAlert},
            {provide: RouterService, useValue: mockRouteManager}
        ]).then(() => {
            fixture = authTestingModule.getComponent(LoginComponent);
            fixture.detectChanges();
            mockBackend = TestHttpHelper.getMockBackend();
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

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                // AND user is directed to home page
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
            });
        });
    }));
});
