import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormInputComponent, FormSelectInputComponent, FormInputMessagesComponent,
    FormComponent, FormDefaultInputComponent, FormInputEventDirective } from './index';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [FormInputComponent, FormSelectInputComponent, FormInputMessagesComponent,
    FormComponent, FormDefaultInputComponent, FormInputEventDirective],
  exports: [FormComponent]
})
export class DraalFormsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalFormsModule
    };
  }
}
