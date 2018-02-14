import { StoreModule } from '@ngrx/store';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { DBSchema } from '@ngrx/db';

import { FEATURE_NAME, reducers } from './rx.reducers';
import { EFFECTS } from './rx.effects';

const stores = {};
stores[FEATURE_NAME] = {
    autoIncrement: true,
    primaryKey: 'id'
};

/**
 * ngrx/db uses a simple schema config object to initialize stores in IndexedDB.
 */
export const dbSchema: DBSchema = {
    version: 1,
    name: 'angular_app',
    stores: stores
};

@NgModule({
    imports: [CommonModule],
    declarations: [],
    exports: [],
})
export class AppRxModule {
    static forRoot(): ModuleWithProviders {
        return {
            /* tslint:disable:no-use-before-declare */
            ngModule: AppRootRxModule,
            /* tslint:enable:no-use-before-declare */
            providers: []
        };
    }
}

@NgModule({
    imports: [
        StoreModule.forFeature(FEATURE_NAME, reducers),
        EffectsModule.forFeature(EFFECTS)
    ]
})
export class AppRootRxModule {}
