import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { HomeComponent, AboutComponent, DemoComponent, AppFormComponent } from './pages';
import { WidgetDtComponent, DraalAlertModule, DraalFormsModule } from './widgets';
import { ApiService, AppEventsService } from './services';
import { routing } from './app.routing';
import { AuthGuard, LoginComponent, LogoutComponent } from './auth';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    routing,
    NgbModule.forRoot(),
    DraalFormsModule.forRoot(),
    DraalAlertModule.forRoot()
  ],
  declarations: [
    WidgetDtComponent,
    LoginComponent,
    LogoutComponent,

    AppComponent,
    HomeComponent,
    AboutComponent,
    DemoComponent,
    AppFormComponent
  ],
  providers: [
    AuthGuard,
    ApiService,
    CookieService,
    AppEventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
