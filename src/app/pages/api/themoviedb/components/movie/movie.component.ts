import { Component, Input } from '@angular/core';

import { Movie } from '../../models';
import { isoLangs } from './isolang';


const IMAGE_PATH_URL = 'https://image.tmdb.org/t/p/w370_and_h556_bestv2/';

@Component({
  selector: 'dng-tmdb-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['movie.scss'],
})
export class MovieComponent {
    @Input() movie: Movie;

    movieImagePath(movie: Movie) {
        return `${IMAGE_PATH_URL}${movie.poster_path}`;
    }

    langToString(movie: Movie) {
        const lang = movie.original_language;

        if (!isoLangs[lang]) {
            return lang;
        }

        return isoLangs[lang].name;
    }
}
