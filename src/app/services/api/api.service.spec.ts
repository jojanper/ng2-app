import { async, inject, TestBed, getTestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend,
    BaseRequestOptions } from '@angular/http';

import { ApiService } from './api.service';
import { NetworkService } from '../network/network.service';


const mockResponse = {
    data: [
        {id: 0, name: 'Item 0'},
        {id: 1, name: 'Item 1'},
        {id: 2, name: 'Item 2'},
        {id: 3, name: 'Item 3'},
    ]
};

const responses = {
    '/api': new Response(new ResponseOptions({body: JSON.stringify(mockResponse)}))
};

describe('Api Service', () => {
    let mockBackend: MockBackend;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ApiService,
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

  it('root API data is available', async(inject([ApiService], (api) => {

      let apiDataPresent = false;
      api.apiInfo().subscribe(() => {
          apiDataPresent = true;
      });

      mockBackend.verifyNoPendingRequests();

      expect(apiDataPresent).toBeTruthy();
  })));
});
