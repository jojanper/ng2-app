import { Component, HostBinding, Input } from '@angular/core';
import { Hero }    from './hero';
@Component({
  // moduleId: module.id,
  selector: 'my-hero-form',
  templateUrl: 'hero-form.component.html',
  /*host: {
    'attr.role': 'button'
  }*/
})
export class HeroFormComponent {

    //role: string = 'button';
    //@HostBinding('attr.role') role: string = 'button';
    @Input() role:string = 'aamu';

    powers = ['Really Smart', 'Super Flexible', 'Super Hot', 'Weather Changer'];
    model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
    submitted = false;

    onSubmit() {
        this.submitted = true;

        console.log(this.role);
    }

    newHero() {
        this.model = new Hero(42, '', '');
    }
}
