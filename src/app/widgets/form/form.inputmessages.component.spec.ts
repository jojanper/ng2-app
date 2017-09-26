import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { FormValidatorFactory, FormGroupValidatorFactory } from './form.validators';
import { FormInputMessagesComponent, FormInputErrorHandler } from '../../widgets';


describe('FormInputMessages Component For String Input', () => {
  let component: FormInputMessagesComponent;
  let form: FormGroup;

  let options: any;
  let control2: FormControl;
  const message = 'Fields do not match';

  beforeEach(() => {
      component = new FormInputMessagesComponent();

      form = new FormBuilder().group({
          'password': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8),
                FormValidatorFactory.password]],
          'password2': ['', [Validators.required]]
      }, {validator: FormGroupValidatorFactory.compare2fields(['password', 'password2'], message)});

      options = {
          errorkeys: ['compare']
      };

      component.control = <FormControl>form.controls['password'];
      control2 = <FormControl>form.controls['password2'];
  });

  it('should show required message', () => {
      component.control.markAsTouched();
      expect(component.errorMessages).toEqual(['Required', 'Password must be contain at least one number']);
  });

  it('should show minimum length message', () => {
      component.control.setValue('p');
      component.control.markAsTouched();
      expect(component.errorMessages).toEqual(['Minimum length 4', 'Password must be contain at least one number']);
  });

  it('should show maximum length message', () => {
      component.control.setValue('paaaaassssssswwoooorrd');
      component.control.markAsTouched();
      expect(component.errorMessages).toEqual(['Maximum length 8', 'Password must be contain at least one number']);
  });

  it('should show password error message', () => {
      component.control.setValue('password');
      component.control.markAsTouched();
      expect(component.errorMessages).toEqual(['Password must be contain at least one number']);
  });

  it('should succeed', () => {
      component.control.setValue('pasord2');
      component.control.markAsTouched();
      expect(component.errorMessages.length).toEqual(0);
  });

  it('should show error message for field mismatch', () => {
    component.control.setValue('password');
    component.control.markAsTouched();
    control2.setValue('password2');
    control2.markAsTouched();

    let component2 = new FormInputMessagesComponent();
    component2.control = control2;
    component2.options = options;
    expect(component2.errorMessages).toEqual(['Fields do not match']);

    const obj = new FormInputErrorHandler(component2.control, component2.options);
    expect(obj.isValid()).toBeFalsy();
  });
});

describe('FormInputMessages Component For Select Input', () => {
  let component: FormInputMessagesComponent;
  let form: FormGroup;

  beforeEach(() => {
      component = new FormInputMessagesComponent();

      form = new FormBuilder().group({
          'option': ['', [Validators.required, FormValidatorFactory.minSelection(2), FormValidatorFactory.maxSelection(3)]]
      });

      component.control = <FormControl>form.controls['option'];
  });

  it('should show errors', () => {
      component.control.setValue([]);
      component.control.markAsTouched();
      expect(component.errorMessages).toEqual(['Required', 'At least 2 items must be selected']);

      component.control.setValue(['a', 'b', 'c', 'd']);
      component.control.markAsTouched();
      expect(component.errorMessages).toEqual(['Maximum of 3 items can be selected']);
  });

  it('should succeed', () => {
      component.control.setValue(['a', 'b', 'c']);
      component.control.markAsTouched();
      expect(component.errorMessages).toEqual([]);
  });
});
