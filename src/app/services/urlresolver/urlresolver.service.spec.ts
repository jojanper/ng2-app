import { async, inject, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AlertService } from '../alert/alert.service';
import { ApiService } from '../api/api.service';
import { NetworkService } from '../network/network.service';
import { UrlResolver } from './urlresolver.service';
import { TestHttpHelper, TestServiceHelper, ResponseFixtures } from '../../../test_helpers';


const rootApi = '/api';
const responses = {
    rootApi: ResponseFixtures.root
};


describe('UrlResolver Service', () => {
    let mockBackend: HttpTestingController;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: TestHttpHelper.http,
            providers: [
                UrlResolver,
                NetworkService,
                ApiService,
                {provide: AlertService, useValue: mockAlert}
            ]
        });

        mockBackend = TestHttpHelper.getMockBackend();
        mockAlert.resetCalls();
    });

    it('supports resolve', async(inject([UrlResolver], (urlResolver) => {
        mockBackend.expectOne(rootApi).flush(responses[rootApi]);
        mockBackend.verify();
        urlResolver.resolve('register').subscribe((url) => {
            expect(url).toEqual('/api/auth/v1/signup');
        });
    })));
});
