import { async, inject, TestBed, getTestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend,
    BaseRequestOptions } from '@angular/http';

import { NetworkService } from '../network/network.service';


const mockResponse = {
    id: 1
};

const responses = {
    '/api': new Response(new ResponseOptions({body: JSON.stringify(mockResponse)})),
    '/error': new Response(new ResponseOptions({status: 404, body: JSON.stringify(mockResponse)}))
};

describe('Network Service', () => {
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
            connection.mockRespond(responses[connection.request.url]);
        });
    });

    it('supports get method', async(inject([NetworkService], (network) => {
        let data;
        network.get('/api').subscribe((item) => { data = item; });

        mockBackend.verifyNoPendingRequests();

        expect(data.id).toEqual(mockResponse.id);
    })));

    fit('Server error response is reported', async(inject([NetworkService], (network) => {
        let data;
        network.get('/error').subscribe((item) => {
            console.log('success');
            data = item;
        }, (err: any) => {
            console.log(err);
            data = err;
        });

        mockBackend.verifyNoPendingRequests();

        expect(data).toEqual('Error');
    })));
});
