import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiInfoMessage } from './api.service.type';
import { PersistentObserver } from '../../widgets/base';
import { NetworkService } from '../network/network.service';


// API root info
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
    private rootInfo: RootInfo;

    constructor(private network: NetworkService) {
        this.rootInfo = new RootInfo();
        this.getRootInfo();
    }

    private getRootInfo(): void {
        this.network.get('/api').subscribe((response) => {
            this.rootInfo.setInfo(response.data);
        });
    }

    apiInfo(): Observable<ApiInfoMessage> {
        return this.rootInfo.observer;
    }
}
