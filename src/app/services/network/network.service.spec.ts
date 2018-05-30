import { async, inject, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

import { AlertService } from '../alert/alert.service';
import { NetworkService, ConnectionOptions } from '../network/network.service';
import { TestHttpHelper, TestServiceHelper } from '../../../test_helpers';


const mockResponse = {
    id: 1
};

const responses = {
    '/get-api': mockResponse,
    '/get-api?q=foo': mockResponse,
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
    },
    '/detail-error': {
        response: JSON.stringify({'detail': 'Detailed error'}),
        opts: {
            status: 404
        }
    }
};


describe('Network Service with ConnectionOptions', () => {
    let headers = null;

    const http = {
        get() {
            headers = arguments[1].headers;
            return of({});
        }
    };

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: TestHttpHelper.http,
            providers: [
                NetworkService,
                {provide: AlertService, useValue: mockAlert},
                {provide: HttpClient, useValue: http}
            ]
        });
        mockAlert.reset();
    });

    it('supports CORS', async(inject([NetworkService], (network) => {
        const options = new ConnectionOptions();
        options.cors = true;

        network.get('/foo', options).subscribe(() => {});
        expect(headers.has('Content-Type')).toBeFalsy();
    })));
});


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
        mockAlert.reset();
    });

    it('supports get method', async(inject([NetworkService], (network) => {
        const url = '/get-api';

        network.get(url).subscribe((item) => data = item);
        mockBackend.expectOne(url).flush(responses[url]);
        mockBackend.verify();
        expect(data.id).toEqual(mockResponse.id);
    })));

    it('supports URL query params', async(inject([NetworkService], (network) => {
        const options = new ConnectionOptions();
        options.params = {q: 'foo'};

        const url = '/get-api';
        const finalUrl = '/get-api?q=foo';

        network.get(url, options).subscribe((item) => data = item);
        mockBackend.expectOne(finalUrl).flush(responses[finalUrl]);
        mockBackend.verify();
        expect(data.id).toEqual(mockResponse.id);
    })));

    it('supports post method', async(inject([NetworkService], (network) => {
        const url = '/post-api';

        network.post(url, mockResponse).subscribe((item) => data = item);
        mockBackend.expectOne(url).flush(responses[url]);
        mockBackend.verify();
        expect(data.id).toEqual(mockResponse.id);
    })));

    it('server text error response is reported', async(inject([NetworkService], (network) => {
        const url = '/text-error';

        network.get(url).subscribe(null, (err: any) => data = err);
        mockBackend.expectOne(url).error(new ErrorEvent(responses[url].response), responses[url].opts);
        mockBackend.verify();
        expect(data).toEqual({errors: ['Error']});
        expect(mockAlert.getCallsCount('error')).toEqual(1);
    })));

    it('server response contains no message', async(inject([NetworkService], (network) => {
        const url = '/no-error';

        network.get(url).subscribe(null, (err: any) => data = err);
        mockBackend.expectOne(url).error(new ErrorEvent(responses[url].response), responses[url].opts);
        mockBackend.verify();
        expect(mockAlert.getCallsCount('error')).toEqual(0);
    })));

    it('server response contains detail field', async(inject([NetworkService], (network) => {
        const url = '/detail-error';

        network.get(url).subscribe(null, (err: any) => data = err);
        mockBackend.expectOne(url).error(new ErrorEvent(responses[url].response), responses[url].opts);
        mockBackend.verify();
        expect(data.errors).toEqual(['Detailed error']);
        expect(mockAlert.getCallsCount('error')).toEqual(1);
    })));
});
