import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { FormValidatorFactory } from './form.validators';
import { FormInputMessagesComponent } from '../../widgets';


describe('FormInputMessages Component', () => {
  let component: FormInputMessagesComponent;
  let form: FormGroup;

  beforeEach(() => {
      component = new FormInputMessagesComponent();

      form = new FormBuilder().group({
          'password': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8),
          FormValidatorFactory.password]]
      });

      component.control = <FormControl>form.controls['password'];
  });

  it('should show required message', () => {
      component.control.markAsTouched();
      expect(component.errorMessage).toEqual(['Required', 'Password must be contain at least one number']);
  });

  it('should show minimum length message', () => {
      component.control.setValue('p');
      component.control.markAsTouched();
      expect(component.errorMessage).toEqual(['Minimum length 4', 'Password must be contain at least one number']);
  });

  it('should show maximum length message', () => {
      component.control.setValue('paaaaassssssswwoooorrd');
      component.control.markAsTouched();
      expect(component.errorMessage).toEqual(['Maximum length 8', 'Password must be contain at least one number']);
  });

  it('should show password error message', () => {
      component.control.setValue('password');
      component.control.markAsTouched();
      expect(component.errorMessage).toEqual(['Password must be contain at least one number']);
  });

  it('should show no errors on success', () => {
      component.control.setValue('pasord2');
      component.control.markAsTouched();
      expect(component.errorMessage.length).toEqual(0);
  });
});
