import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AlertService } from '../alert/alert.service';
import { isEmptyObject } from '../../utils';


export interface BackendResponse {
    data?: any,
    errors?: Array<string>
}

class ConnectionOptions {
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
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        if (options) {
        }

        return this.http[method](...args, {headers}).catch((err: HttpErrorResponse) => {
            const error = err.error.type || err.error;

            let msg: BackendResponse;
            try {
                msg = JSON.parse(error);
            } catch (_error) {
                msg = error;

                if (!isEmptyObject(msg) && !msg.errors) {
                    msg = {errors: [msg]} as BackendResponse;
                } else {
                    msg = {errors: []};
                }
            }

            for (let value of msg.errors) {
                this.alertService.error(value);
            }

            return Observable.throw({msg});
        });
    }
}
