import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class NetworkService {
  constructor(private http: Http) {
  }

  get(url: string): any {
      return this.http.get(url).map(res => res.json());
  }
}
