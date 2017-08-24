import { async, inject, TestBed, getTestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Response, ResponseOptions } from '@angular/http';

import { ApiService } from './api.service';
import { NetworkService } from '../network/network.service';
import { TestHttpHelper } from '../../../test_helpers';


const mockResponse = {
    data: [
        {id: 0, name: 'Item 0'},
        {id: 1, name: 'Item 1'},
        {id: 2, name: 'Item 2'},
        {id: 3, name: 'Item 3'},
    ]
};

const responses = {
    '/api': {
        type: 'mockRespond',
        response: new Response(new ResponseOptions({body: JSON.stringify(mockResponse)}))
    }
};

describe('Api Service', () => {
    let mockBackend: MockBackend;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: TestHttpHelper.http,
            providers: [
                ApiService,
                NetworkService,
            ].concat(TestHttpHelper.httpMock)
        });

        mockBackend = TestHttpHelper.getMockBackend();
        TestHttpHelper.connectBackend(mockBackend, responses);
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
