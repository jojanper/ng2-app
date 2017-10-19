import { async, inject, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AlertService } from '../alert/alert.service';
import { ApiService } from '../api/api.service';
import { NetworkService } from '../network/network.service';
import { UrlResolver } from './urlresolver.service';
import { TestHttpHelper, TestServiceHelper } from '../../../test_helpers';


const mockResponse = {
    id: 1
};

const responses = {
    '/api': mockResponse
};

const rootApi = '/api';


describe('UrlResolver Service', () => {
    let data: any;
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
        //network.post(url, mockResponse).subscribe((item) => { data = item; });
        mockBackend.expectOne(rootApi).flush(responses[rootApi]);
        mockBackend.verify();
        urlResolver.resolve('register').subscribe((url) => {
            console.log(url);
        });
        //expect(data.id).toEqual(mockResponse.id);
    })));
});
