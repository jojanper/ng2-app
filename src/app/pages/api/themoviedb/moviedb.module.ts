import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { DraalWidgetsCoreModule } from '../../../widgets';

import { MovieService } from './services';
import { MovieComponent, MoviesComponent } from './components';


@NgModule({
    imports: [
        CommonModule,
        ScrollingModule,
        DraalWidgetsCoreModule
    ],
    providers: [
        MovieService
    ],
    declarations: [
        MovieComponent,
        MoviesComponent
    ],
    entryComponents: [
        MoviesComponent
    ]
})
export class DraalApiMoviedbModule {}
