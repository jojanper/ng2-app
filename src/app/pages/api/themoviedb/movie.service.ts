import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Movie } from './models';
import { AppDataSource } from './datasource';
import { NetworkService, ConnectionOptions, BackendResponse } from '../../../services';


const BASE_URL = 'https://api.themoviedb.org/3/movie/';
const API_KEY = 'c412c072676d278f83c9198a32613b0d';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
    private connectionOptions: ConnectionOptions;

    constructor(private network: NetworkService) {
        this.connectionOptions = new ConnectionOptions();
        this.connectionOptions.cors = true;
    }

    getMovies(page: number, target = 'top_rated'): Observable<BackendResponse> {
        const url = `${BASE_URL}${target}?api_key=${API_KEY}&page=${page}&language=en-US`;
        return this.network.get(url, this.connectionOptions);
    }
}

/**
 * DataSource for the MovieService. Requests movie related data from Movie DB
 * in paginated manner.
 */
export class MovieDataSource extends AppDataSource<Movie> {
    constructor(private movieService: MovieService) {
        super();
    }

    getData(page: number, initialize: boolean) {
        this.movieService.getMovies(page).subscribe((data) => {
            const jsonData = data as any;

            if (initialize) {
                this.setInitialData(jsonData.results.length, jsonData.total_results);
            }

            this.setData(jsonData.results, page - 1);
        });
    }
}
