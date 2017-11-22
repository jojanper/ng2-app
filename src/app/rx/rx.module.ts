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
export class RxModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootRxModule,
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
export class RootRxModule {}
