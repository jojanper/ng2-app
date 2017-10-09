import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api/api.service';


@Injectable()
export class UrlResolver {
    constructor(private api: ApiService) {}

    resolve(name: string): string {
        this.api.apiInfo().subscribe((data) => {
            console.log(data);
        });

        return '';
    }
}
