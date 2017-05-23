import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RegisterComponent } from './register.component';


describe('Register Component', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [RegisterComponent],
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
      });
  }));
});
