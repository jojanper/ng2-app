import { async, inject, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { AlertService } from '../alert/alert.service';
import { NetworkService } from '../network/network.service';
import { TestHttpHelper, TestServiceHelper, ResponseFixtures } from '../../../test_helpers';


const rootApi = ApiService.rootUrl;

const responses = {};
responses[rootApi] = ResponseFixtures.root;


describe('Api Service', () => {
    let mockBackend: HttpTestingController;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: TestHttpHelper.http,
            providers: [
                ApiService,
                NetworkService,
                {provide: AlertService, useValue: mockAlert}
            ]
        });

        mockBackend = TestHttpHelper.getMockBackend();
    });

    it('root API data is available', async(inject([ApiService], (api) => {
        let apiDataPresent = false;
        api.apiInfo().subscribe(() => {
            apiDataPresent = true;
        });

        mockBackend.expectOne(rootApi).flush(responses[rootApi]);
        mockBackend.verify();

        expect(apiDataPresent).toBeTruthy();
    })));

    it('supports resolve', async(inject([ApiService], (api) => {
        mockBackend.expectOne(rootApi).flush(responses[rootApi]);
        mockBackend.verify();

        api.resolve2Url('signup').subscribe((response) => {
            expect(response.url).toEqual(ResponseFixtures.root.data[0].url);
        });
    })));
});
