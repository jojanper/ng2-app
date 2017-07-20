import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

@Injectable()
export class NetworkService {
  constructor(private http: Http) {
  }

  get(url: string): any {
      return this.http.get(url).catch((err: Response) => {
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
