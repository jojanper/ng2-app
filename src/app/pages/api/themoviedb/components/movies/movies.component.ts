import { Component, ChangeDetectionStrategy } from '@angular/core';

import { MovieService, MovieDataSource } from '../../services';


@Component({
    selector: 'dng-tmdb-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['movies.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesComponent {
    constructor(private movieService: MovieService) {}

    ds = new MovieDataSource(this.movieService);
}
