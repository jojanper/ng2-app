import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { HomeComponent, AboutComponent, AppFormComponent, DemoComponent, DemoFormSkuBuilderComponent } from './pages';
import { WidgetChosenComponent, WidgetDtComponent, AlertComponent, FormInputComponent,
  FormInputMessagesComponent, FormComponent } from './widgets';
import { ApiService, AlertService, AppEventsService } from './services';
import { routing } from './app.routing';
import { AuthGuard, LoginComponent, LogoutComponent } from './auth';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    NgbModule.forRoot()
  ],
  declarations: [
    WidgetChosenComponent,
    WidgetDtComponent,
    LoginComponent,
    LogoutComponent,
    AlertComponent,
    FormComponent,
    FormInputComponent,
    FormInputMessagesComponent,

    AppComponent,
    HomeComponent,
    AboutComponent,
    AppFormComponent,
    DemoComponent,

    DemoFormSkuBuilderComponent
  ],
  providers: [
    AuthGuard,
    ApiService,
    CookieService,
    AlertService,
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
