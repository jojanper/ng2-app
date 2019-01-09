import { Component, Input } from '@angular/core';

import { Movie } from './movie.models';
import { isoLangs } from './isolang';


@Component({
  selector: 'dng-tmdb-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['movie.scss'],
})
export class MovieComponent {
    @Input() movie: Movie;

    movieImagePath(movie: Movie) {
        return `https://image.tmdb.org/t/p/w370_and_h556_bestv2/${movie.poster_path}`;
    }

    langToString(movie: Movie) {
        if (!isoLangs[movie.original_language]) {
            return movie.original_language;
        }

        return isoLangs[movie.original_language].name;
    }
}
