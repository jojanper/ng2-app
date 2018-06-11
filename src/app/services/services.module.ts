import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppEventsService } from './events/appevent.service';
import { ApiService } from './api/api.service';
import { AlertService } from './alert/alert.service';
import { NetworkService } from './network/network.service';
import { AuthGuard } from './auth/auth.guard';
import { AutoLogout } from './auth/autologout';
import { RouterService } from './router/router.service';

@NgModule({
    imports: [CommonModule]
})
export class DraalServicesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DraalServicesModule,
            providers: [
                AuthGuard,
                AppEventsService,
                ApiService,
                AlertService,
                NetworkService,
                AutoLogout,
                RouterService
            ]
        };
    }
}
