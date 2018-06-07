import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'dng-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
    @Input() type = 'spinner-1';
    @Input() scale: string = null;

    style = {};

    ngOnInit() {
        // If specified, adjust the spinner size
        if (this.scale) {
            this.style = {
                transform: 'scale(' + this.scale + ')'
            };
        }
    }
}
