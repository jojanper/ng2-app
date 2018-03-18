import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { CookieModule } from 'ngx-cookie';

// State management and effects
import { DBModule } from '@ngrx/db';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';


import { AppComponent } from './app.component';
import { reducers, metaReducers } from './app.reducers';
import { DraalAppPagesModule } from '../pages';
import { RouterEffects } from '../router';
import { AppRxModule, dbSchema } from '../rx/rx.module';


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        CookieModule.forRoot(),

        /**
         * StoreModule.forRoot is imported once in the root module, accepting a reducer
         * function or object map of reducer functions. If passed an object of
         * reducers, combineReducers will be run creating your application
         * meta-reducer. This returns all providers for an @ngrx/store
         * based application.
         */
        StoreModule.forRoot(reducers, { metaReducers }),

        /**
         * @ngrx/router-store keeps router state up-to-date in the store.
         */
        StoreRouterConnectingModule,

        /**
         * EffectsModule.forRoot() is imported once in the root module and
         * sets up the effects class to be initialized immediately when the
         * application starts.
         *
         * See: https://github.com/ngrx/platform/blob/master/docs/effects/api.md#forroot
         */
        EffectsModule.forRoot([RouterEffects]),

        /**
         * `provideDB` sets up @ngrx/db with the provided schema and makes the Database
         * service available.
         */
        DBModule.provideDB(dbSchema),

        /**
         * Application wide ngrx state management, actions and effects
         */
        AppRxModule.forRoot(),

        /**
         * Pages and related views.
         */
        DraalAppPagesModule.forRoot()
    ],
    declarations: [
        AppComponent
    ],
    providers: [
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
    constructor(public appRef: ApplicationRef) {}

    hmrOnInit(store) {
        console.log('HMR store', store);
    }

    hmrOnDestroy(store) {
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);

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
