import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResolveUrl, CacheData } from './resolve';
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
    private resolveCache: CacheData;

    constructor(private network: NetworkService) {
        this.resolveCache = new CacheData();
        this.rootInfo = new RootInfo();
        this.getRootInfo();
    }

    static get rootUrl(): string {
        return '/api';
    }

    /**
     * Retrieve root data from backend. The data consists of available API data etc.
     */
    private getRootInfo(): void {
        this.network.get(ApiService.rootUrl).subscribe((response) => {
            this.rootInfo.setInfo(response.data);
        });
    }

    /**
     * Return observable to backend root data.
     */
    apiInfo(): Observable<ApiInfoMessage> {
        return this.rootInfo.observer;
    }

    /**
     * Resolve URL name into actual backend URL.
     *
     * @param name URL name.
     * @return Observable to resolved backend URL.
     */
    resolve2Url(name: string): Observable<string> {
        return this.apiInfo().map((urlInfo) => {
            return new ResolveUrl(urlInfo.data, this.resolveCache).getUrl(name);
        });
    }

    /**
     * Send data to backend.
     *
     * @param urlName URL name.
     * @param data HTTP POST data.
     * @return Observable to response data.
     */
    sendBackend(urlName: string, data: any): Observable<any> {
        // Resolve backend URL, send the data and return response data as observable
        return this.resolve2Url(urlName).flatMap((url) => {
            return this.network.post(url, data).map(response => response);
        });
    }

    /**
     * Register new user.
     *
     * @param data Registration data.
     * @return Observable to response data.
     */
    register(data: any): Observable<any> {
        return this.sendBackend('signup', data);
    }
}
