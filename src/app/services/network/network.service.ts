import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import { AlertService } from '../alert/alert.service';


class ConnectionOptions {
}

@Injectable()
export class NetworkService {
    constructor(private http: HttpClient, private alertService: AlertService) {}

    get(url: string, options?: ConnectionOptions): any {
        return this.execute('get', [url], options);
    }

    post(url: string, data: any, options?: ConnectionOptions): any {
        return this.execute('post', [url, JSON.stringify(data)], options);
    }

    private execute(method: string, args: Array<any>, options?: ConnectionOptions): any {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        if (options) {
        }

        return this.http[method](...args, {headers}).catch((err: HttpErrorResponse) => {
            let msg;

            console.log(err);
            console.log(err.error);
            console.log(err.error.type);

            try {
                msg = err;//.json();
            } catch (error) {
                msg = {errors: [err/*.text()*/]};
            }

            if (msg.errors) {
                this.alertService.error(msg.errors[0]);
            }

            return Observable.throw({msg});
        }); //.map(res => res.json());
    }
}
