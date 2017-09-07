import { getTestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, XHRBackend, BaseRequestOptions } from '@angular/http';


export class MockError extends Response implements Error {
    name: any;
    message: any;
}

// Http test helpers
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

// Form test helpers
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


class AlertService {
    private alertCalls: any;

    constructor() {
        this.alertCalls = {
            success: [],
            info: [],
            warning: [],
            error: []
        };
    }

    success(data: any) {
        this.alertCalls['success'].push(data);
    }

    info(data: any) {
        this.alertCalls['info'].push(data);
    }

    warning(data: any) {
        this.alertCalls['warning'].push(data);
    }

    error(data: any) {
        this.alertCalls['error'].push(data);
    }

    getCallsCount(type: string): number {
        return this.alertCalls[type].length;
    }
}

class Router {
    private redirectUrl: Array<string>;

    navigate(url: Array<string>) {
        this.redirectUrl = url;
    }

    getNavigateUrl(): string {
        return this.redirectUrl[0];
    }
}


// Service test helpers
export const TestServiceHelper = {
    alertService: AlertService,
    router: Router
};
