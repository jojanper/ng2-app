import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'dng-spinner',
    template: require('./spinner.component.html'),
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
    @Input() type = 'spinner-1';
    @Input() scale: string = null;

    protected style = {};

    ngOnInit() {
        // If specified, adjust the spinner size
        if (this.scale) {
            this.style = {
                transform: 'scale(' + this.scale + ')'
            };
        }
    }
}
