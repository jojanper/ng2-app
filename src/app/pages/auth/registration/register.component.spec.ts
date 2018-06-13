import { async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';

import { GoAction } from '../../../router';
import { RegisterComponent } from './register.component';
import { AlertService, ApiService, RouterService } from '../../../services';
import { TestHttpHelper, TestFormHelper, TestServiceHelper, AuthResponseFixture } from '../../../../test_helpers';
import { AuthTestingModule } from '../auth.spec';


describe('Register Component', () => {
    let fixture: ComponentFixture<RegisterComponent>;
    let mockBackend: HttpTestingController;

    const authTestingModule = new AuthTestingModule();

    const mockStore = new TestServiceHelper.store();
    const mockAlert = new TestServiceHelper.alertService();
    const mockRouteManager = new TestServiceHelper.RouterService();

    const authResponse = new AuthResponseFixture(ApiService.rootUrl, 'signup');

    beforeEach(done => {
        authTestingModule.init([
            {provide: Store, useValue: mockStore},
            {provide: AlertService, useValue: mockAlert},
            {provide: RouterService, useValue: mockRouteManager}
        ]).then(() => {
            fixture = authTestingModule.getComponent(RegisterComponent);
            fixture.detectChanges();
            mockBackend = TestHttpHelper.getMockBackend();
            done();
        });
    });

    it('registration form is available to user', async(() => {
        // WHEN user wants to register
        fixture.whenStable().then(() => {

            // THEN registration page is shown
            expect(fixture.nativeElement.querySelector('h2').innerHTML).toEqual('Sign Up');

            // AND registration form should be present
            expect(fixture.nativeElement.querySelectorAll('form').length).toEqual(1);

            // AND form contains 3 inputs
            expect(fixture.nativeElement.querySelectorAll('form input').length).toEqual(3);

            // AND form contains one submit button
            expect(fixture.nativeElement.querySelectorAll('form button').length).toEqual(1);
        });
    }));

    it('password verification fails', fakeAsync(() => {
        fixture.whenStable().then(() => {
            const element = fixture.nativeElement.querySelectorAll('input');

            // GIVEN user inputs email and password
            TestFormHelper.sendInputWithTick(fixture, element[0], 'test@test.com');
            TestFormHelper.sendInputWithTick(fixture, element[1], '123456');

            // WHEN user confirms selected password with typing error
            TestFormHelper.sendInputWithTick(fixture, element[2], '1234567');

            // THEN account creation button is not available
            expect(TestFormHelper.submitDisabled(fixture)).toBeTruthy();

            // -----

            // WHEN user confirms correct password
            TestFormHelper.sendInputWithTick(fixture, element[2], '123456');

            // THEN account creation button should be available
            expect(TestFormHelper.submitDisabled(fixture)).toBeFalsy();
        });
    }));

    it('account creation button is clicked', async(() => {
        // GIVEN registration form has all the needed details
        TestFormHelper.sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], 'test@test.com');
        TestFormHelper.sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[1], '123456');
        TestFormHelper.sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[2], '123456');
        fixture.detectChanges();

        fixture.whenStable().then(() => {

            expect(TestFormHelper.submitDisabled(fixture)).toBeFalsy();

            // WHEN user click account creation button
            const button = fixture.nativeElement.querySelector('form button');
            button.click();

            fixture.detectChanges();

            mockBackend.expectOne(authResponse.rootUrl).flush(authResponse.rootResponse);
            mockBackend.expectOne(authResponse.url).flush(authResponse.urlResponse);
            mockBackend.verify();

            fixture.whenStable().then(() => {
                // THEN user is directed to login page
                const action = <GoAction>mockStore.getDispatchAction();
                expect(action.payload.path).toEqual(['/']);

                // AND notification message is shown to user
                expect(mockAlert.getCallsCount('success')).toEqual(1);
            });
        });
    }));
});
