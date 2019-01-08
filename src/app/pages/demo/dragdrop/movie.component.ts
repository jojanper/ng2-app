import { Component, OnInit, Input } from '@angular/core';


import { Movie } from './movie.models';
import { isoLangs } from './isolang';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['movie.scss'],
})
export class MovieComponent implements OnInit {
  @Input()
  movie: Movie;

  constructor() {
  }

  ngOnInit() {
    //console.log(this.movie);
  }

  movieImagePath(movie: Movie) {
    //console.log(movie);
    return `https://image.tmdb.org/t/p/w370_and_h556_bestv2/${movie.poster_path}`;
  }

  langToString(movie: Movie) {
    return isoLangs[movie.original_language].name;
  }
}
