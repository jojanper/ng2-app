import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResolveUrl, CacheData, BackendUrlData } from './resolve';
import { ApiInfoMessage } from './api.service.type';
import { AppObservablePersistentObject } from '../../widgets/base';
import { NetworkService, BackendResponse } from '../network/network.service';


// API root info
class RootInfo extends AppObservablePersistentObject<ApiInfoMessage> {

    constructor() {
        super();
    }

    setInfo(data: Array<any>): boolean {
        this.setObject({data});
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
        return this.rootInfo.observable;
    }

    /**
     * Resolve URL name into actual backend URL.
     *
     * @param name URL name.
     * @param data URL resolving data.
     * @return Observable to resolved backend URL.
     */
    resolve2Url(name: string, data: any): Observable<BackendUrlData> {
        return this.apiInfo().map((urlInfo) => {
            return new ResolveUrl(urlInfo.data, this.resolveCache).getUrl(name, data);
        });
    }

    /**
     * Send data to backend.
     *
     * @param urlName URL name.
     * @param data HTTP POST data.
     * @return Observable to response data.
     */
    sendBackend(urlName: string, data: any): Observable<BackendResponse> {
        // Resolve backend URL, send the data and return response data as observable
        return this.resolve2Url(urlName, data).flatMap((urlData) => {
            return this.network.post(urlData.url, urlData.data).map(response => response);
        });
    }

    /**
     * Register new user.
     *
     * @param data Registration data.
     * @return Observable to response data.
     */
    register(data: any): Observable<BackendResponse> {
        return this.sendBackend('signup', data);
    }
}

export * from './starwars-api.service';
