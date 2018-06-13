import { async, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';

import { PwResetRequestComponent } from './pw_reset_request.component';
import { AlertService, ApiService, RouterService } from '../../../services';
import { TestHttpHelper, TestFormHelper, TestServiceHelper,
    TestHelper, AuthResponseFixture } from '../../../../test_helpers';
import { AuthTestingModule } from '../auth.spec';


describe('PwResetRequestComponent Component', () => {
    let fixture: ComponentFixture<PwResetRequestComponent>;
    let mockBackend: HttpTestingController;

    const mockStore = new TestServiceHelper.store();
    const mockAlert = new TestServiceHelper.alertService();
    const mockRouteManager = new TestServiceHelper.RouterService();

    const authResponse = new AuthResponseFixture(ApiService.rootUrl, 'pwResetRequest');

    const sendRequest = (cb) => {
        const element = fixture.nativeElement.querySelectorAll('input')[0];
        TestFormHelper.sendInput(fixture, element, 'test');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const button = fixture.nativeElement.querySelector('form button');
            button.click();

            cb();
        });
    };

    beforeEach(done => {
        mockStore.reset();
        mockAlert.reset();

        const authTestingModule = new AuthTestingModule();

        authTestingModule.init([
            {provide: Store, useValue: mockStore},
            {provide: AlertService, useValue: mockAlert},
            {provide: RouterService, useValue: mockRouteManager}
        ]).then(() => {
            fixture = authTestingModule.getComponent(PwResetRequestComponent);
            fixture.detectChanges();

            mockBackend = TestHttpHelper.getMockBackend();
            mockBackend.expectOne(authResponse.rootUrl).flush(authResponse.rootResponse);

            fixture.detectChanges();

            done();
        });
    });

    it('password reset request succeeds', async(() => {
        // GIVEN user inputs his/her email
        // WHEN user presses send button
        sendRequest(() => {
            mockBackend.expectOne(authResponse.url).flush(authResponse.urlResponse);
            mockBackend.verify();

            // THEN user is directed to home page on success
            // AND notification message is shown to user
            TestHelper.verifyStoreAndAlertCalls(mockStore, mockAlert, '/', 'success', expect);
        });
    }));

    it('password reset request fails', async(() => {
        // GIVEN user inputs his/her email
        // WHEN user presses send button and network call fails
        sendRequest(() => {
            const response = JSON.stringify({errors: ['Error']});
            mockBackend.expectOne(authResponse.url).error(new ErrorEvent(response), {status: 404});
            mockBackend.verify();

            // THEN user is still directed to home page on success
            // AND notification message is shown to user
            TestHelper.verifyStoreAndAlertCalls(mockStore, mockAlert, '/', 'success', expect);
        });
    }));
});
