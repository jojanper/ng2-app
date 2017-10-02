import { FormControl } from '@angular/forms';
import { Directive, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';


@Directive({
    selector: '[formInputEvent]',
})
export class FormInputEventDirective {

    //private timer: any;
    @Input() control: FormControl;

    constructor(protected elementRef: ElementRef) {
        // Control is marked as touched after debounce time has elapsed from keyup event.
        // The purpose of this is to delay the triggering of the control input validation
        // until user has finished the input change (typing, etc)
        Observable.fromEvent(elementRef.nativeElement, 'keyup')
            .debounceTime(750)
            .distinctUntilChanged()
            .subscribe(() => {
                this.control.markAsTouched();
            });

        Observable.fromEvent(elementRef.nativeElement, 'keydown')
            .subscribe(() => {
                console.log('KEY DOWN');
                //console.log(this.control);
                this.control.markAsUntouched();
            });

        Observable.fromEvent(elementRef.nativeElement, 'focus')
            .subscribe(() => {
                //console.log('FOCUS');
                //console.log(this.control);
                this.control.markAsUntouched();
                //console.log(this.control.dirty);
            });

        Observable.fromEvent(elementRef.nativeElement, 'focusout')
            .subscribe(() => {
                //console.log('FOCUS OUT');
                //console.log(this.control);
                this.control.markAsTouched();
            });
    }
}
