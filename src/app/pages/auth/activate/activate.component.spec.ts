import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';

import { GoAction } from '@src/router';
import { ActivateComponent } from './activate.component';
import { DraalFormsModule } from '@src/widgets';
import { NetworkService, AlertService, ApiService } from '@src/services';
import { TestHttpHelper, TestFormHelper, TestServiceHelper, ResponseFixtures } from '@test/test_helpers';


const rootApi = ApiService.rootUrl;
const activateUrl = ResponseFixtures.root.data[1].url;

const responses = {};
responses[rootApi] = ResponseFixtures.root;
responses[activateUrl] = JSON.stringify({});


describe('Activate Component', () => {
    let fixture: ComponentFixture<ActivateComponent>;
    let mockBackend: HttpTestingController;

    const mockStore = new TestServiceHelper.store();
    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                NgbModule.forRoot(),
                DraalFormsModule
            ].concat(TestHttpHelper.http),
            declarations: [ActivateComponent],
            providers: [
                NetworkService,
                ApiService,
                {provide: Store, useValue: mockStore},
                {provide: AlertService, useValue: mockAlert}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ActivateComponent);
            fixture.detectChanges();

            mockBackend = TestHttpHelper.getMockBackend();

            done();
        });
    });

    it('account activate form is available to user', async(() => {
        // WHEN user wants to activate account
        fixture.whenStable().then(() => {

            // THEN activation page is shown
            expect(fixture.nativeElement.querySelector('h2').innerHTML).toEqual('Account activation');

            // AND activation form should be present
            expect(fixture.nativeElement.querySelectorAll('form').length).toEqual(1);

            // AND form contains 1 input1
            expect(fixture.nativeElement.querySelectorAll('form input').length).toEqual(1);

            // AND form contains one submit button
            expect(fixture.nativeElement.querySelectorAll('form button').length).toEqual(1);
        });
    }));

    it('account creation button is clicked', async(() => {
        // GIVEN registration form has all the needed details
        TestFormHelper.sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], 'abcdef');
        fixture.detectChanges();

        fixture.whenStable().then(() => {

            expect(TestFormHelper.submitDisabled(fixture)).toBeFalsy();

            // WHEN user click account creation button
            let button = fixture.nativeElement.querySelector('form button');
            button.click();

            fixture.detectChanges();

            mockBackend.expectOne(rootApi).flush(responses[rootApi]);
            mockBackend.expectOne(activateUrl).flush(responses[activateUrl]);
            mockBackend.verify();

            fixture.whenStable().then(() => {
                // THEN user is directed to login page
                const action = <GoAction>mockStore.getDispatchAction();
                expect(action.payload.path).toEqual(['/auth/activate']);

                // AND notification message is shown to user
                expect(mockAlert.getCallsCount('success')).toEqual(1);
            });
        });
    }));
});
