import { getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


// Http test helpers
export const TestHttpHelper = {
    http: Array<any>([HttpClientTestingModule]),
    getMockBackend: () => getTestBed().get(HttpTestingController)
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

    resetCalls(): void {
        this.alertCalls.success = [];
        this.alertCalls.info = [];
        this.alertCalls.warning = [];
        this.alertCalls.error = [];
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
