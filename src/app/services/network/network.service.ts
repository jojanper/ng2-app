import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

class ConnectionOptions {
}

@Injectable()
export class NetworkService {
    constructor(private http: Http) {}

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

        return this.http[method](...args, {headers}).catch((err: Response) => {
            let msg;

            try {
                msg = err.json();
            } catch (error) {
                msg = err.text();
            }

            return Observable.throw({msg});
        }).map(res => res.json());
    }
}
