import { Component } from '@angular/core';

import { ApiService, AppEventsService, AppEventTypes } from '../services';
import { StarWarsApiService } from '../pages/starwars';

import '../../style/app.scss';

@Component({
    selector: 'dng-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    url = 'https://github.com/jojanper/angular-app';

    sidemenuCls = '';
    contentCls = 'col-sm-12';

    constructor(protected api: ApiService,
        protected starwarsApi: StarWarsApiService,
        appEvents: AppEventsService) {

        appEvents.getObservable(AppEventTypes.SIDEMENU).subscribe((event) => {
            const hasItems = event.data.menuItems.length;
            this.sidemenuCls = (hasItems) ? 'col-sm-2' : '';
            this.contentCls = (hasItems) ? 'col-sm-10' : 'col-sm-12';
        });
    }
}
