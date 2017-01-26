import { Component, Input } from '@angular/core';
import { AppFormModel }    from './model';

@Component({
  selector: 'dng2-form',
  templateUrl: 'app-form.component.html',
})
export class AppFormComponent {

    @Input() role = 'aamu';

    powers = ['Really Smart', 'Super Flexible', 'Super Hot', 'Weather Changer'];
    model = new AppFormModel(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
    submitted = false;

    onSubmit() {
        this.submitted = true;

        console.log(this.role);
    }

    newHero() {
        this.model = new AppFormModel(42, '', '');
    }
}
