import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';

import { PwResetRequestComponent } from './pw_reset_request.component';
import { DraalFormsModule, DraalWidgetsCoreModule } from '../../../widgets';
import { NetworkService, AlertService, ApiService } from '../../../services';
import { TestHttpHelper, TestFormHelper, TestServiceHelper,
    TestHelper, ResponseFixtures } from '../../../../test_helpers';


const rootApi = ApiService.rootUrl;
const resetUrl = ResponseFixtures.root.data[4].url;

const responses = {};
responses[rootApi] = ResponseFixtures.root;
responses[resetUrl] = JSON.stringify({});


describe('PwResetRequestComponent Component', () => {
    let fixture: ComponentFixture<PwResetRequestComponent>;
    let mockBackend: HttpTestingController;

    const mockStore = new TestServiceHelper.store();
    const mockAlert = new TestServiceHelper.alertService();

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

        TestBed.configureTestingModule({
            imports: [
                NgbModule.forRoot(),
                DraalFormsModule,
                DraalWidgetsCoreModule
            ].concat(TestHttpHelper.http),
            declarations: [PwResetRequestComponent],
            providers: [
                NetworkService,
                ApiService,
                {provide: Store, useValue: mockStore},
                {provide: AlertService, useValue: mockAlert}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(PwResetRequestComponent);
            fixture.detectChanges();

            mockBackend = TestHttpHelper.getMockBackend();
            mockBackend.expectOne(rootApi).flush(responses[rootApi]);

            done();
        });
    });

    it('password reset request succeeds', async(() => {
        // GIVEN user inputs his/her email
        // WHEN user presses send button
        sendRequest(() => {
            mockBackend.expectOne(resetUrl).flush(responses[resetUrl]);
            mockBackend.verify();

            // THEN user is directed to home page on success
            // AND notification message is shown to user
            TestHelper.verifyStoreAndAlert(mockStore, mockAlert, '/', 'success');
        });
    }));

    it('password reset request fails', async(() => {
        // GIVEN user inputs his/her email
        // WHEN user presses send button and network call fails
        sendRequest(() => {
            const response = JSON.stringify({errors: ['Error']});
            mockBackend.expectOne(resetUrl).error(new ErrorEvent(response), {status: 404});
            mockBackend.verify();

            // THEN user is still directed to home page on success
            // AND notification message is shown to user
            TestHelper.verifyStoreAndAlert(mockStore, mockAlert, '/', 'success');
        });
    }));
});
