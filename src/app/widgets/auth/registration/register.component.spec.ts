import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RegisterComponent } from './register.component';
import { DraalAuthModule } from '../auth.module';
import { NetworkService } from '../../../services';
import { TestHttpHelper } from '../../../../test_helpers';


describe('Register Component', () => {
    let fixture: ComponentFixture<RegisterComponent>;
    let component: RegisterComponent;

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [NgbModule.forRoot(), DraalAuthModule.forRoot()].concat(TestHttpHelper.http),
            providers: [NetworkService].concat(TestHttpHelper.httpMock)
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(RegisterComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            done();
        });
    });

    it('user sign ups to service', async(() => {
        // WHEN user wants to register
        fixture.whenStable().then(() => {

            // THEN registration page is shown
            expect(fixture.nativeElement.querySelector('h2').innerHTML).toEqual('Sign Up');

            // AND registration form should be present
            expect(fixture.nativeElement.querySelectorAll('form').length).toEqual(1);

            // AND form contains 2 inputs
            expect(fixture.nativeElement.querySelectorAll('form input').length).toEqual(2);

            // AND form contains one submit button
            expect(fixture.nativeElement.querySelectorAll('form button').length).toEqual(1);
        });
    }));
});
