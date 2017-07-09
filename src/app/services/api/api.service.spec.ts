import { async, inject, TestBed, getTestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend,
    BaseRequestOptions } from '@angular/http';

import { ApiService } from './api.service';


const mockResponse = {
  data: [
    { id: 0, name: 'Video 0' },
    { id: 1, name: 'Video 1' },
    { id: 2, name: 'Video 2' },
    { id: 3, name: 'Video 3' },
  ]
};

describe('Api Service', () => {
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [
          ApiService,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory:
              (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                return new Http(backend, defaultOptions);
              }
          }
        ]
    });

    mockBackend = getTestBed().get(MockBackend);

    mockBackend.connections.subscribe((connection) => {
      expect(connection.request.url).toEqual('/api');
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });
  });

  it('should ...', async(inject([ApiService], (api) => {

      let apiDataPresent = false;
      api.apiInfo().subscribe(() => {
          apiDataPresent = true;
      });

      mockBackend.verifyNoPendingRequests();

      expect(apiDataPresent).toBeTruthy();
      expect(api.title).toBe('Angular');
  })));
});
