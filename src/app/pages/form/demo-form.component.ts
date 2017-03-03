import { Component, OnInit } from '@angular/core';

import { FormModel } from '../../widgets/form/form.model';


@Component({
  selector: 'dng2-demo-form-sku-builder',
  templateUrl: 'demo-form.component.html',
})
export class DemoFormSkuBuilderComponent implements OnInit {

  model: FormModel;

  ngOnInit() {
      // Form definition in terms of a model
      this.model = new FormModel({
          'username': {
              label: 'Username',
              placeholder: 'Input username (4 characters at minimum)',
              validators: [{name: 'required'}, {name: 'minlength', value: 4}]
          },
          'option': {
              type: 'select',
              label: 'Select option',
              placeholder: 'Select item...',
              validators: [{name: 'required'}]
          }
      }, ['username', 'option']);
  }

  submit(data: any): void {
    console.log(data);
  }
}
