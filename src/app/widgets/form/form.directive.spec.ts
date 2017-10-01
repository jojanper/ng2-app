import { Component } from '@angular/core';
import { TestBed, ComponentFixture, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { FormBuilder, Validators, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { By } from '@angular/platform-browser';
//import { TestScheduler } from "rxjs";

//import { DraalFormsModule } from './form.module';
import { FormInputEventDirective } from './form.directive';
//import { TestFormHelper } from '../../../test_helpers';


const html = '<form name="form" [formGroup]="form"><input formInputEvent [control]="control" name="password" formControlName="password" /></form>';
@Component({
    selector: 'dng-form-directive',
    template: html
})
class TestFormDirectiveComponent {
    control: FormControl;
    form: FormGroup;

    constructor() {
        this.form = new FormBuilder().group({
          'password': ['', [Validators.required]],
          'password2': ['', [Validators.required]]
        });

        this.control = <FormControl>this.form.controls['password'];
    }

}


describe('Form directive', () => {
  let fixture: ComponentFixture<TestFormDirectiveComponent>;
  let component: TestFormDirectiveComponent;
  //let form: FormGroup;

  //const scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot(), FormsModule, ReactiveFormsModule],
      declarations: [TestFormDirectiveComponent, FormInputEventDirective],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFormDirectiveComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      done();
    });
  });

  //fit('should show login form', async(() => { ///*fakeAsync(() => { //*/done => {
  it('should show login form', fakeAsync(() => { //*/done => {
    // GIVEN login page
    // WHEN rendering login component
    //fixture.detectChanges();
    //fixture.whenStable().then(() => {

        fixture.detectChanges();

        const element = fixture.nativeElement.querySelectorAll('input')[0];
        //console.log(element);
        //element.triggerEventHandler('keydown', null);

        expect(component.control.touched).toBeFalsy();

        element.dispatchEvent(new Event('keyup'));
        //tick();
        discardPeriodicTasks();

        tick(750);
        fixture.detectChanges();

/*
        scheduler.schedule(() => {
            //expect(usernameService.isAvailable).toHaveBeenCalled();
            //expect(username).toBe('abcddd');
            //done();
            expect(component.control.touched).toBeFalsy();
            console.log('DONE');
        }, 750, () => {
            console.log('FINAL');
        });
        */

        //scheduler.flush();

        expect(component.control.touched).toBeTruthy();

      // THEN login form should be present
      //expect(fixture.nativeElement.querySelectorAll('form').length).toEqual(1);

      // AND form contains 2 inputs
      //expect(fixture.nativeElement.querySelectorAll('form input').length).toEqual(2);

      // AND form contains one submit button
      //expect(fixture.nativeElement.querySelectorAll('form button').length).toEqual(1);
      //fixture.whenStable().then(() => {
        //done();
      //});
    }));
  //});
});
