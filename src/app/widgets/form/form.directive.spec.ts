import { Component } from '@angular/core';
import { TestBed, ComponentFixture, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { FormBuilder, Validators, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormInputEventDirective } from './form.directive';


const html = `
    <form name="form" [formGroup]="form">
        <input dngFormInputEvent [control]="control" name="password" formControlName="password" />
    </form>`;

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


describe('FormInputEvent directive', () => {
    let fixture: ComponentFixture<TestFormDirectiveComponent>;
    let component: TestFormDirectiveComponent;
    let element: any;

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [NgbModule.forRoot(), FormsModule, ReactiveFormsModule],
            declarations: [TestFormDirectiveComponent, FormInputEventDirective],
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(TestFormDirectiveComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            element = fixture.nativeElement.querySelectorAll('input')[0];
            done();
        });
    });

    it('keyup event', fakeAsync(() => {
        expect(component.control.touched).toBeFalsy();

        // On keyup event, the control is marked as touched after debounce time has elapsed
        element.dispatchEvent(new Event('keyup'));
        discardPeriodicTasks();
        tick(750);
        fixture.detectChanges();

        expect(component.control.touched).toBeTruthy();
    }));

    it('keydown event', fakeAsync(() => {
        expect(component.control.touched).toBeFalsy();

        // On keydown event, the control is marked as untouched
        element.dispatchEvent(new Event('keydown'));
        discardPeriodicTasks();
        fixture.detectChanges();

        expect(component.control.touched).toBeFalsy();
    }));

    it('focus event', fakeAsync(() => {
        expect(component.control.touched).toBeFalsy();

        // On focus event, the control is marked as untouched
        element.dispatchEvent(new Event('focus'));
        discardPeriodicTasks();
        fixture.detectChanges();

        expect(component.control.touched).toBeFalsy();
    }));

    it('focusout event', fakeAsync(() => {
        expect(component.control.touched).toBeFalsy();

        // On focusout event, the control is marked as touched
        element.dispatchEvent(new Event('focusout'));
        discardPeriodicTasks();
        fixture.detectChanges();

        expect(component.control.touched).toBeTruthy();
    }));
});
