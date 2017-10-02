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

    it('keyup event', fakeAsync(() => {
        fixture.detectChanges();

        const element = fixture.nativeElement.querySelectorAll('input')[0];

        expect(component.control.touched).toBeFalsy();

        element.dispatchEvent(new Event('keyup'));
        discardPeriodicTasks();

        tick(750);
        fixture.detectChanges();

        expect(component.control.touched).toBeTruthy();
    }));

    it('keydown event', fakeAsync(() => {
        fixture.detectChanges();

        const element = fixture.nativeElement.querySelectorAll('input')[0];

        expect(component.control.touched).toBeFalsy();

        element.dispatchEvent(new Event('keydown'));
        discardPeriodicTasks();

        //tick(750);
        fixture.detectChanges();

        expect(component.control.touched).toBeFalsy();
    }));
});
