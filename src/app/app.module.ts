import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AppFormComponent } from './form';
import { DemoComponent } from './demo';
import { WidgetChosenComponent, WidgetDtComponent, AlertComponent } from './widgets';
import { ApiService, AlertService } from './services';
import { routing } from './app.routing';
import { AuthGuard, LoginComponent, LogoutComponent } from './auth';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing,
    NgbModule.forRoot()
  ],
  declarations: [
    WidgetChosenComponent,
    WidgetDtComponent,
    LoginComponent,
    LogoutComponent,
    AlertComponent,

    AppComponent,
    HomeComponent,
    AboutComponent,
    AppFormComponent,
    DemoComponent
  ],
  providers: [
    AuthGuard,
    ApiService,
    CookieService,
    AlertService
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
