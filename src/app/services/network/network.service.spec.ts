import { async, inject, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AlertService } from '../alert/alert.service';
import { NetworkService } from '../network/network.service';
import { TestHttpHelper, TestServiceHelper } from '../../../test_helpers';


const mockResponse = {
    id: 1
};

const responses = {
    '/get-api': mockResponse,
    '/post-api': mockResponse,
    '/text-error': {
        response: 'Error',
        opts: {
            status: 404
        }
    },
    '/json-error': {
        response: JSON.stringify({errors: [mockResponse]}),
        opts: {
            status: 404
        }
    },
    '/no-error': {
        response: JSON.stringify({}),
        opts: {
            status: 404
        }
    }
};

describe('Network Service', () => {
    let data: any;
    let mockBackend: HttpTestingController;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: TestHttpHelper.http,
            providers: [
                NetworkService,
                {provide: AlertService, useValue: mockAlert}
            ]
        });

        mockBackend = TestHttpHelper.getMockBackend();
        mockAlert.resetCalls();
    });

    it('supports get method', async(inject([NetworkService], (network) => {
        const url = '/get-api';

        network.get(url).subscribe((item) => { data = item; });
        mockBackend.expectOne(url).flush(responses[url]);
        mockBackend.verify();
        expect(data.id).toEqual(mockResponse.id);
    })));

    it('supports post method', async(inject([NetworkService], (network) => {
        const url = '/post-api';

        network.post(url, mockResponse).subscribe((item) => { data = item; });
        mockBackend.expectOne(url).flush(responses[url]);
        mockBackend.verify();
        expect(data.id).toEqual(mockResponse.id);
    })));

    it('server text error response is reported', async(inject([NetworkService], (network) => {
        const url = '/text-error';

        network.get(url).subscribe(null, (err: any) => { data = err; });
        mockBackend.expectOne(url).error(new ErrorEvent(responses[url].response), responses[url].opts);
        mockBackend.verify();
        expect(data).toEqual({errors: ['Error']});
        expect(mockAlert.getCallsCount('error')).toEqual(1);
    })));

    it('server response contains no message', async(inject([NetworkService], (network) => {
        const url = '/no-error';

        network.get(url).subscribe(null, (err: any) => { data = err; });
        mockBackend.expectOne(url).error(new ErrorEvent(responses[url].response), responses[url].opts);
        mockBackend.verify();
        expect(mockAlert.getCallsCount('error')).toEqual(0);
    })));
});
