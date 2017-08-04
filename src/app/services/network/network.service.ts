import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

class ConnectionOptions {
}

@Injectable()
export class NetworkService {
  constructor(private http: Http) {
  }

  get(url: string, options?: ConnectionOptions): any {
      return this.execute('get', url, options);
  }

  private execute(method: string, url: string, options?: ConnectionOptions): any {
      if (options) {
      }

      return this.http[method](url).catch((err: Response) => {
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
