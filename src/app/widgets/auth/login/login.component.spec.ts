import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { LoginComponent } from './login.component';
import { DraalAuthModule } from '../auth.module';
import { DraalFormsModule } from '../../form/form.module';
import { TestFormHelper } from '../../../../test_helpers';

const sendInput = TestFormHelper.sendInput;
const submitDisabled = TestFormHelper.submitDisabled;


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
      imports: [NgbModule.forRoot(), DraalFormsModule, DraalAuthModule.forRoot()],
      declarations: [LoginComponent],
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
    fixture.whenStable().then(() => {
        sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], 'user').then(() => {
            fixture.detectChanges();
            expect(submitDisabled(fixture)).toBeTruthy();
        });
    });
  }));

  it('invalid username is typed', async(() => {
    fixture.whenStable().then(() => {
        const element = fixture.nativeElement.querySelectorAll('input')[0];
        sendInput(fixture, element, 'u').then(() => {
            fixture.detectChanges();
            expect(element.getAttribute('class').indexOf('form-control-danger')).toBeGreaterThan(-1);
        });
    });
  }));

  it('invalid password is typed', async(() => {
    fixture.whenStable().then(() => {
        const element = fixture.nativeElement.querySelectorAll('input')[1];
        sendInput(fixture, element, 'pa').then(() => {
            fixture.detectChanges();
            expect(element.getAttribute('class').indexOf('form-control-danger')).toBeGreaterThan(-1);
        });
    });
  }));

  it('password is filled to login form', async(() => {
    fixture.whenStable().then(() => {
        sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[1], '123456').then(() => {
            fixture.detectChanges();
            expect(submitDisabled(fixture)).toBeTruthy();
        });
    });
  }));

  it('sign-in button is clicked', async(() => {
      // GIVEN login form has all the needed details
      sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], 'test');
      sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[1], '123456');
      fixture.detectChanges();

      fixture.whenStable().then(() => {

          expect(submitDisabled(fixture)).toBeFalsy();

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
