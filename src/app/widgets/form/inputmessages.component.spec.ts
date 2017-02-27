import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { FormInputMessagesComponent } from '../../widgets';


describe('FormInputMessages Component', () => {
  let component: FormInputMessagesComponent;
  let form: FormGroup;

  beforeEach(() => {
      component = new FormInputMessagesComponent();

      form = new FormBuilder().group({
          'password': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
      });

      component.control = <FormControl>form.controls['password'];
  });

  it('should show required message', () => {
      component.control.markAsTouched();
      expect(component.errorMessage).toEqual(['Required']);
  });

  it('should show minimum length message', () => {
      component.control.setValue('p');
      component.control.markAsTouched();
      expect(component.errorMessage).toEqual(['Minimum length 4']);
  });

  it('should show maximum length message', () => {
      component.control.setValue('paaaaassssssswwoooorrd');
      component.control.markAsTouched();
      expect(component.errorMessage).toEqual(['Maximum length 8']);
  });
});
