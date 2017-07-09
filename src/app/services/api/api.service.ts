import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiInfoMessage } from './api.service.type';
import { PersistentObserver } from '../../widgets/base';


class RootInfo extends PersistentObserver<ApiInfoMessage> {

    constructor() {
        super();
    }

    setInfo(data: Array<any>): boolean {
        this.setSubject({data});
        return true;
    }
}

@Injectable()
export class ApiService {
  title = 'Angular';
  private rootInfo: RootInfo;

  constructor(private http: Http) {
    this.rootInfo = new RootInfo();
    this.getRootInfo();
  }

  private getRootInfo() {
      this.http.get('/api').map(res => res.json()).subscribe((item) => {
          this.rootInfo.setInfo(item.data);
      });
  }

  apiInfo() {
    return this.rootInfo.observer;
  }
}
