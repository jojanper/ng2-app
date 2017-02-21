import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { FormInputMessagesComponent } from '../../widgets';
import { LoginComponent } from './login.component';

function sendInput(fixture: any, inputElement: any, text: string) {
    inputElement.value = text;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return fixture.whenStable();
}

describe('Login Component', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  let userData = null;
  let mockCookie = {
      putObject: (_key: string, data: any) => {
          userData = data;
      }
  };

  let url = null;
  let mockRouter = {
      navigate: (returnUrl) => {
          url = returnUrl;
      }
  };

  let mockActivatedRoute = {
      snapshot: {
        queryParams: {}
      }
  };

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NgbModule.forRoot()],
      declarations: [LoginComponent, FormInputMessagesComponent],
      providers: [
          {provide: CookieService, useValue: mockCookie},
          {provide: ActivatedRoute, useValue: mockActivatedRoute},
          {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      done();
    });
  });

  it('should show login form', done => {
    // GIVEN login page
    // WHEN rendering login component
    fixture.whenStable().then(() => {

      // THEN login form should be present
      expect(fixture.nativeElement.querySelectorAll('form').length).toEqual(1);

      // AND form contains 2 inputs
      expect(fixture.nativeElement.querySelectorAll('form input').length).toEqual(2);

      // AND form contains one submit button
      expect(fixture.nativeElement.querySelectorAll('form button').length).toEqual(1);
      done();
    });
  });

  it('username is filled to login form', async(() => {
    const username = 'user';
    fixture.whenStable().then(() => {
        sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], username).then(() => {
            fixture.detectChanges();
            expect(component.loginForm.value.username).toEqual(username);
        });
    });
  }));

  it('password is filled to login form', async(() => {
    const password = '123456';
    fixture.whenStable().then(() => {
        sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[1], password).then(() => {
            fixture.detectChanges();
            expect(component.loginForm.value.password).toEqual(password);
        });
    });
  }));

  it('sign-in button is clicked', async(() => {
      // GIVEN login form has all the needed details
      component.loginForm.controls['username'].setValue('test');
      component.loginForm.controls['password'].setValue('123456');
      fixture.detectChanges();


      fixture.whenStable().then(() => {

          // WHEN user click sign-in button
          let button = fixture.nativeElement.querySelector('form button');
          button.click();

          fixture.detectChanges();
          fixture.whenStable().then(() => {
              // THEN user is directed to home page
              expect(url).toEqual(['/home']);

              // AND authentication data is available for user
              expect(userData).toBeDefined();
          });
      });
  }));
});
