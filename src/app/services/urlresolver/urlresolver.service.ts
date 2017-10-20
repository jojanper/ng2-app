import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResolveUrl } from './resolve';
import { ApiService } from '../api/api.service';


@Injectable()
export class UrlResolver {
    constructor(private api: ApiService) {}

    resolve(name: string): Observable<string> {
        return this.api.apiInfo().map((urlInfo) => {
            return new ResolveUrl(urlInfo.data).getUrl(name);
        });
    }
}
