import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AlertService } from '../alert/alert.service';
import { isString, isEmptyObject } from '../../utils';


export interface BackendResponse {
    data?: any,
    errors?: Array<string>
}

export class ConnectionOptions {
    cors = false;
}

@Injectable()
export class NetworkService {
    constructor(private http: HttpClient, private alertService: AlertService) {}

    get(url: string, options?: ConnectionOptions): Observable<BackendResponse> {
        return this.execute('get', [url], options);
    }

    post(url: string, data: any, options?: ConnectionOptions): Observable<BackendResponse> {
        return this.execute('post', [url, JSON.stringify(data)], options);
    }

    private execute(method: string, args: Array<any>, options?: ConnectionOptions): Observable<BackendResponse> {
        let httpHeaders = {
            'Content-Type': 'application/json'
        };

        if (options) {
            if (options.cors === true) {
                delete httpHeaders['Content-Type'];
            }
        }

        const headers = new HttpHeaders(httpHeaders);

        return this.http[method](...args, {headers}).catch((err: HttpErrorResponse) => {
            const error = err.error.type || err.error;

            let response: BackendResponse = error;
            try {
                response = JSON.parse(error);
            } catch (_error) {
            }

            if (!response.errors && !isEmptyObject(response) && isString(response)) {
                response = {errors: [response]} as BackendResponse;
            }

            for (let value of response.errors) {
                this.alertService.error(value);
            }

            return Observable.throw(response);
        });
    }
}
