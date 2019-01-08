import { Injectable } from '@angular/core';

import { NetworkService, ConnectionOptions } from '../../../services';
import { config } from './config';

const BASE_URL = `${config.api.baseUrl}`;

@Injectable({
  providedIn: 'root'
})
export class MovieService {
    private connectionOptions: ConnectionOptions;

    constructor(private network: NetworkService) {
        this.connectionOptions = new ConnectionOptions();
        this.connectionOptions.cors = true;
    }

    getMovies(page: number, cb: Function) {
        const url = `${BASE_URL}${config.api.topRated}${config.api.apiKey}&page=${page}`;
        this.network.get(url, this.connectionOptions).subscribe((response) => {
            cb(response);
        });
    }
}
