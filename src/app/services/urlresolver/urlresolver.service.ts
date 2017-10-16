import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api/api.service';


@Injectable()
export class UrlResolver {
    constructor(private api: ApiService) {}

    resolve(name: string): Observable<string> {
        return this.api.apiInfo().map((urlInfo) => {
            console.log(urlInfo);
            return name;
        });
    }
}
