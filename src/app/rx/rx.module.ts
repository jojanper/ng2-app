import { StoreModule } from '@ngrx/store';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { FEATURE_NAME, reducers } from './rx.reducers';
import { EFFECTS } from './rx.effects';


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
