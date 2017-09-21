import { async, inject, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { AlertService } from '../alert/alert.service';
import { NetworkService } from '../network/network.service';
import { TestHttpHelper, TestServiceHelper } from '../../../test_helpers';


const mockResponse = {
    data: [
        {id: 0, name: 'Item 0'},
        {id: 1, name: 'Item 1'},
        {id: 2, name: 'Item 2'},
        {id: 3, name: 'Item 3'},
    ]
};

const responses = {
    '/api': JSON.stringify(mockResponse)
};

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

      const url = '/api';
      mockBackend.expectOne(url).flush(responses[url]);
      mockBackend.verify();

      expect(apiDataPresent).toBeTruthy();
  })));
});
