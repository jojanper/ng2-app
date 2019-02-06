import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormInputComponent, FormSelectInputComponent, FormInputMessagesComponent,
    FormComponent, FormDefaultInputComponent, FormInputEventDirective } from './index';
import { DraalWidgetsCoreModule } from '../widgets.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DraalWidgetsCoreModule
  ],
  declarations: [
    FormInputComponent,
    FormSelectInputComponent,
    FormInputMessagesComponent,
    FormComponent,
    FormDefaultInputComponent,
    FormInputEventDirective
  ],
  exports: [FormComponent]
})
export class DraalFormsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalFormsModule
    };
  }
}
