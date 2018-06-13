import { getTestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NavigationEnd } from '@angular/router';
import { Action } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { User } from '../app/rx/auth';
import { GoAction } from '../app/router';
import { RouteManager } from '../app/router/manager';
import { AppObservableObject } from '../app/utils/base';
import * as AuthReducers from '../app/rx/auth/auth.reducers';


export const TestHelper = {
    verifyStoreAndAlertCalls: (
        storeObj: any, alertObj: any, path: string, alertMode: string,
        expect: Function
    ) => {
        const action = <GoAction>storeObj.getDispatchAction();
        expect(action.payload.path).toEqual([path]);
        expect(alertObj.getCallsCount(alertMode)).toEqual(1);
    }
};

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

    reset(): void {
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

class RouterStub {
    public url;
    private subject = new Subject();
    public events = this.subject.asObservable();

    triggerNavEndEvents(url) {
        const ne = new NavigationEnd(0, url, null);
        this.subject.next(ne);
    }

    createUrlTree() {}

    serializeUrl(): string {
        return '';
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

class ActivatedRouteStub {
    root = {
        children: []
    };

    setChildren(children: Array<any>) {
        this.root.children = children;
    }
}

const CookieTester = (cookieValues): CookieService => {
    return {
        get(key: string): string {
            return cookieValues[key];
        },
        getObject(key: string): any {
            return cookieValues[key];
        },
        put(key: string, value: string): void {
            cookieValues[key] = value;
        },
        putObject(key: string, value: any): void {
            cookieValues[key] = value;
        },
        removeAll() {
            Object.keys(cookieValues).forEach(key => delete cookieValues[key]);
        },
        remove(key: string) {
            delete cookieValues[key];
        }
    } as CookieService;
};

class CookieServiceMock {
    cookieValues = {};

    getService(): CookieService {
        return CookieTester(this.cookieValues);
    }
}

class RouterServiceMock {
    resolveByName(name: string, params?: any): string {
        return RouteManager.resolveByName(name, params);
    }
}


// Service test helpers
export const TestServiceHelper = {
    alertService: AlertService,
    router: Router,
    store: Store,
    RouterStub: RouterStub,
    ActivatedRouteStub: ActivatedRouteStub,
    CookieService: CookieServiceMock,
    RouterService: RouterServiceMock
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

class UserMock extends AppObservableObject<AuthReducers.State> {

    userState: AuthReducers.State;

    constructor() {
        super();

        this.userState = {
            authenticated: false,
            user: {
                email: 'test@test.com',
                expires: 1,
                validAt: Date.now()
            } as User
        } as AuthReducers.State;
    }

    setAuthStatus(status: boolean): boolean {
        this.userState.authenticated = status;
        this.setObject(this.userState);
        return true;
    }
}


export const TestObservablesHelper = {
    getUserAuthenticationStatus: AuthMockStatus,
    selectUserState: UserMock
};
