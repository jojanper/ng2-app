import { async, inject, TestBed, getTestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, ResponseType, XHRBackend,
    BaseRequestOptions } from '@angular/http';

import { NetworkService } from '../network/network.service';


class MockError extends Response implements Error {
    name: any;
    message: any;
}

const mockResponse = {
    id: 1
};

const responses = {
    '/api': {
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                NetworkService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });

        mockBackend = getTestBed().get(MockBackend);

        mockBackend.connections.subscribe((connection) => {
            const respObj = responses[connection.request.url];
            connection[respObj.type](respObj.response);
        });
    });

    it('supports get method', async(inject([NetworkService], (network) => {
        network.get('/api').subscribe((item) => { data = item; });
        mockBackend.verifyNoPendingRequests();
        expect(data.id).toEqual(mockResponse.id);
    })));

    it('server text error response is reported', async(inject([NetworkService], (network) => {
        network.get('/text-error').subscribe(null, (err: any) => { data = err; });
        mockBackend.verifyNoPendingRequests();
        expect(data).toEqual({msg: 'Error'});
    })));

    it('server json error response is reported', async(inject([NetworkService], (network) => {
        network.get('/json-error').subscribe(null, (err: any) => { data = err; });
        mockBackend.verifyNoPendingRequests();
        expect(data).toEqual({msg: mockResponse});
    })));
});
