import { FormControl } from '@angular/forms';
import { Directive, Input, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Rx';


@Directive({
    selector: '[keyUpEvent]',
})
export class KeyUpDirective {

    //private timer: any;
    @Input() control: FormControl;

    constructor(protected elementRef: ElementRef) {

        //console.log(this.control);

        //this.timer = null;
        const eventStream = Observable.fromEvent(elementRef.nativeElement, 'keyup')
            //.map(() => )
            .debounceTime(500)
            .distinctUntilChanged();

        eventStream.subscribe(() => {
            console.log('TIMEOUT');
            this.control.markAsTouched();
        });

        const keyDownStream = Observable.fromEvent(elementRef.nativeElement, 'keydown');
        keyDownStream.subscribe(() => {
            //console.log('KEY DOWN');
            //console.log(this.control);
            this.control.markAsUntouched();
            //console.log(this.control.touched);
        });

        const focusStream = Observable.fromEvent(elementRef.nativeElement, 'focus');
        focusStream.subscribe(() => {
            //console.log('FOCUS');
            //console.log(this.control);
            this.control.markAsUntouched();
            //console.log(this.control.dirty);
        });

        const focusOutStream = Observable.fromEvent(elementRef.nativeElement, 'focusout');
        focusOutStream.subscribe(() => {
            //console.log('FOCUS OUT');
            //console.log(this.control);
            this.control.markAsTouched();
        });
    }

/*
    @HostListener('window:keyup', ['$event'])
    onKeyEvent(event) {
        console.log(event.target);

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            console.log('timer expired');
        }, 200);
    }
    */
}
