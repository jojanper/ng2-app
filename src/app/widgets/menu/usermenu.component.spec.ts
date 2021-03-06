import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { goAction } from '../../router';
import { UserMenuComponent } from './usermenu.component';
import { DropDownComponent } from '../../widgets';
import { RouterService } from '../../services';
import { TestServiceHelper, TestObservablesHelper } from '../../../test_helpers';


const AUTHROUTES = {
    url: 'auth',
    children: [
        {
            url: 'register',
            name: 'auth.register-view',
            menuTitle: 'Sign up'
        },
        {
            url: 'login',
            name: 'auth.login-view',
            menuTitle: 'Sign in'
        },
        {
            url: 'logout',
            name: 'auth.logout-view',
            menuTitle: 'Sign out'
        }
    ]
};


@Component({
    selector: 'dng-usermenu-test',
    template: `<dng-usermenu [store]="store" [authStatus]="authStatus"></dng-usermenu>`
})
class TestUserMenuComponent {
    authStatusObj: any;
    authStatus: any;
    store: any;

    constructor() {
        this.authStatusObj = new TestObservablesHelper.getUserAuthenticationStatus();
        this.store = new TestServiceHelper.store([this.authStatusObj.observable]);

        this.authStatus = this.store.select();
    }
}

const testModuleDef = (mockRouteManager) => {
    return {
        imports: [RouterTestingModule, CommonModule],
        declarations: [DropDownComponent, UserMenuComponent, TestUserMenuComponent],
        providers: [
            { provide: RouterService, useValue: mockRouteManager }
        ]
    };
};

describe('UserMenuComponent', () => {
    let fixture: ComponentFixture<TestUserMenuComponent>;

    const mockRouteManager = new TestServiceHelper.RouterService([AUTHROUTES]);

    beforeEach(done => {
        const ref = testModuleDef(mockRouteManager);
        TestBed.configureTestingModule(ref).compileComponents().then(() => {
            fixture = TestBed.createComponent(TestUserMenuComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('should show sign-in and sign-up buttons for unauthenticated user', () => {
        const buttons = fixture.nativeElement.querySelectorAll('button');
        expect(buttons.length).toEqual(2);

        expect(buttons[0].textContent).toEqual('Sign in');
        expect(buttons[1].textContent).toEqual('Sign up');
    });

    function clickButton(index: number) {
        const button = fixture.nativeElement.querySelectorAll('button')[index];
        button.click();
        fixture.detectChanges();
        return fixture.whenStable();
    }

    function verifyButtonClick(index: number, url: string, done: Function) {
        clickButton(index).then(() => {
            const action = fixture.componentInstance.store.getDispatchAction(0);
            expect(action.path).toEqual([url]);
            done();
        });
    }

    it('sign-in button is clicked', (done) => {
        verifyButtonClick(0, '/auth/login', done);
    });

    it('sign-up button is clicked', (done) => {
        verifyButtonClick(1, '/auth/register', done);
    });

    function authenticate() {
        fixture.componentInstance.authStatusObj.setStatus(true);
        fixture.detectChanges();
        return fixture.whenStable();
    }

    it('user menu is shown for authenticated user', (done) => {
        authenticate().then(() => {
            // No sign-in or registration buttons are shown
            const buttons = fixture.nativeElement.querySelectorAll('button');
            expect(buttons.length).toEqual(0);

            // Dropdown menu is visible
            const dropdown = fixture.nativeElement.querySelectorAll('dng-dropdown');
            expect(dropdown.length).toEqual(1);

            // And it contains links
            const links = fixture.nativeElement.querySelectorAll('dng-dropdown a');
            expect(links.length).toEqual(1);

            // And link points to logout view
            expect(links[0].href.indexOf('auth/logout') !== -1).toBeTruthy();

            done();
        });
    });
});
