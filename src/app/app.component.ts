import { Component } from '@angular/core';

import { ApiService } from './shared';

import '../style/app.scss';

@Component({
  selector: 'dng2-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  url = 'https://github.com/jojanper/ng2-app';
  title: string;

  constructor(private api: ApiService) {
    // Do something with api
    this.title = this.api.title;
  }
}
