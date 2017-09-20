import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Response, ResponseOptions, ResponseType } from '@angular/http';

import { AlertService } from '../alert/alert.service';
import { NetworkService } from '../network/network.service';
import { TestHttpHelper, MockError, TestServiceHelper } from '../../../test_helpers';


const mockResponse = {
    id: 1
};

const responses = {
    '/get-api': {
        type: 'mockRespond',
        response: new Response(new ResponseOptions({body: JSON.stringify(mockResponse)}))
    },
    '/post-api': {
        type: 'mockRespond',
        response: new Response(new ResponseOptions({body: JSON.stringify(mockResponse)}))
    },
    '/text-error': {
        type: 'mockError',
        response: new MockError(new ResponseOptions({
            status: 404,
            type: ResponseType.Error,
            body: 'Error'
        }))
    },
    '/json-error': {
        type: 'mockError',
        response: new MockError(new ResponseOptions({
            status: 404,
            type: ResponseType.Error,
            body: JSON.stringify(mockResponse)
        }))
    }
};

describe('Network Service', () => {
    let data: any;
    let mockBackend: MockBackend;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: TestHttpHelper.http,
            providers: [
                NetworkService,
                {provide: AlertService, useValue: mockAlert}
            ].concat(TestHttpHelper.httpMock)
        });

        mockBackend = TestHttpHelper.getMockBackend();
        TestHttpHelper.connectBackend(mockBackend, responses);
    });

    it('supports get method', async(inject([NetworkService], (network) => {
        network.get('/get-api').subscribe((item) => { data = item; });
        mockBackend.verifyNoPendingRequests();
        expect(data.id).toEqual(mockResponse.id);
    })));

    it('supports post method', async(inject([NetworkService], (network) => {
        network.post('/post-api', mockResponse).subscribe((item) => { data = item; });
        mockBackend.verifyNoPendingRequests();
        expect(data.id).toEqual(mockResponse.id);
    })));

    it('server text error response is reported', async(inject([NetworkService], (network) => {
        network.get('/text-error').subscribe(null, (err: any) => { data = err; });
        mockBackend.verifyNoPendingRequests();
        expect(data).toEqual({msg: {errors: ['Error']}});
    })));

    it('server json error response is reported', async(inject([NetworkService], (network) => {
        network.get('/json-error').subscribe(null, (err: any) => { data = err; });
        mockBackend.verifyNoPendingRequests();
        expect(data).toEqual({msg: mockResponse});
    })));
});
