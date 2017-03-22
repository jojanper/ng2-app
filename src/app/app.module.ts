import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent, AboutComponent, DemoComponent, AppFormComponent } from './pages';
import { WidgetDtComponent, DraalAlertModule, DraalFormsModule } from './widgets';
import { DraalServicesModule } from './services';
import { routing } from './app.routing';
import { DraalAuthModule } from './auth';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    routing,
    NgbModule.forRoot(),
    DraalFormsModule.forRoot(),
    DraalAlertModule.forRoot(),
    DraalAuthModule.forRoot(),
    DraalServicesModule.forRoot()
  ],
  declarations: [
    WidgetDtComponent,

    AppComponent,
    HomeComponent,
    AboutComponent,
    DemoComponent,
    AppFormComponent
  ],
  providers: [
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
