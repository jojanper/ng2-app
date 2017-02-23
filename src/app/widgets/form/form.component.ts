import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'dng2-form',
  template: require('./form.component.html')
})

export class FormComponent implements OnInit {
    form: FormGroup;
    @Input() submitLabel: string;
    @Output() submit: EventEmitter<any> = new EventEmitter<any>();

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit () {
        this.form = this.formBuilder.group({
            'username': ['', [Validators.required, Validators.minLength(4)]],
            'password': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
        });
    }

    submitForm () {
        this.submit.emit(this.form.value);
    }
}
