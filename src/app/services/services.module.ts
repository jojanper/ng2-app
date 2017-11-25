import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppEventsService } from './events/appevent.service';
import { ApiService } from './api/api.service';
import { AlertService } from './alert/alert.service';
import { NetworkService } from './network/network.service';
import { AuthGuard } from './auth/auth.guard';


@NgModule({
    imports: [CommonModule]
})
export class DraalServicesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DraalServicesModule,
            providers: [CookieService, AuthGuard, AppEventsService, ApiService,
                AlertService, NetworkService]
        };
    }
}
