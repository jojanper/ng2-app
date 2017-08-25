import { getTestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, XHRBackend, BaseRequestOptions } from '@angular/http';


export class MockError extends Response implements Error {
    name: any;
    message: any;
}

export const TestHttpHelper = {
    http: Array<any>([HttpModule]),

    httpMock: Array<any>([
        MockBackend,
        BaseRequestOptions,
        {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                return new Http(backend, defaultOptions);
            }
        }
    ]),

    getMockBackend: () => getTestBed().get(MockBackend),

    connectBackend: (backend, responses) => {
        backend.connections.subscribe((connection) => {
            const respObj = responses[connection.request.url];
            connection[respObj.type](respObj.response);
        });
    }
};

export const TestFormHelper = {
    sendInput: (fixture: any, inputElement: any, text: string) => {
        inputElement.value = text;
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        return fixture.whenStable();
    },

    submitDisabled(fixture: any) {
        return fixture.nativeElement.querySelectorAll('form button')[0].attributes.hasOwnProperty('disabled');
    }
};
