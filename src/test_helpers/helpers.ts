import { getTestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppObservableObject } from '../app/widgets/base';


// Http test helpers
export const TestHttpHelper = {
    http: Array<any>([HttpClientTestingModule]),
    getMockBackend: () => getTestBed().get(HttpTestingController)
};

function sendInput(fixture: any, inputElement: any, text: string, ticker?: boolean) {
    inputElement.value = text;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // For tick() usage, see for example:
    // https://stackoverflow.com/questions/42971537/what-is-the-difference-between-fakeasync-and-async-in-angular2-testing
    if (ticker) {
        tick(10);
        return null;
    }

    return fixture.whenStable();
}

// Form test helpers
export const TestFormHelper = {
    sendInput: sendInput,

    sendInputWithTick: (fixture: any, inputElement: any, text: string) => {
        return sendInput(fixture, inputElement, text, true);
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
        return (this.alertCalls[type]) ? this.alertCalls[type].length : 0;
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

class Store {
    private action: Array<Action> = [];

    private index = 0;
    private observables: Array<Observable<any>>;

    constructor(observables: Array<Observable<any>> = null) {
        this.observables = observables;
    }

    dispatch(action: Action): void {
        this.action.push(action);
    }

    select(): Observable<any> {
        return this.observables[this.index++];
    }

    getDispatchAction(index = 0): Action {
        return this.action[index];
    }

    reset() {
        this.index = 0;
        this.action = [];
    }
}


// Service test helpers
export const TestServiceHelper = {
    alertService: AlertService,
    router: Router,
    store: Store
};


class AuthMockStatus extends AppObservableObject<boolean> {

    constructor() {
        super();
    }

    setStatus(status: boolean): boolean {
        this.setObject(status);
        return true;
    }
}


export const TestObservablesHelper = {
    getUserAuthenticationStatus: AuthMockStatus
}
