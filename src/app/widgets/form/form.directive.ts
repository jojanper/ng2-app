import { FormControl } from '@angular/forms';
import { Directive, Input, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Directive({
    selector: '[dngFormInputEvent]',
})
export class FormInputEventDirective {
    @Input() control: FormControl;

    constructor(protected elementRef: ElementRef) {
        // Control is marked as touched after debounce time has elapsed from keyup event.
        // The purpose of this is to delay the triggering of the control input validation
        // until user has finished the input change (typing, etc).
        fromEvent(elementRef.nativeElement, 'keyup').pipe(
            debounceTime(750),
            distinctUntilChanged()
        ).subscribe(() => {
            this.control.markAsTouched();
        });

        // Control is marked as untouched when user presses key down.
        // The prpose of this is to postpone any input validations until
        // user is finished with typing to the input (see above keyup event).
        fromEvent(elementRef.nativeElement, 'keydown')
            .subscribe(() => this.control.markAsUntouched());

        // Control is marked as untouched when element receives focus.
        // Again, the purpose is to reduce control validations
        // and rendering input errors until user has finished
        // typing to the input.
        fromEvent(elementRef.nativeElement, 'focus')
            .subscribe(() => this.control.markAsUntouched());

        // Mark control as touched when element is about to loose focus.
        // Control can now be validated and any errors should be
        // reported to the user.
        fromEvent(elementRef.nativeElement, 'focusout')
            .subscribe(() => this.control.markAsTouched());
    }
}
