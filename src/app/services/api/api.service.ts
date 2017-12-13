import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResolveUrl, CacheData, BackendUrlData } from './resolve';
import { ApiInfoMessage } from './api.service.type';
import { PersistentObserver, AppObserverArray } from '../../widgets/base';
import { NetworkService, BackendResponse } from '../network/network.service';


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


export interface Species {
    name: string
    homeworld: string
}

export interface Planet {
    name: string,
    diameter: string
    url: string
}

export interface AppPlanet extends Planet {
    species: Array<Species>
}

export class PlanetsObservable extends AppObserverArray<Planet> {}
export class SpeciesObservable extends AppObserverArray<Species> {}
export class AppPlanetsObservable extends AppObserverArray<AppPlanet> {}

@Injectable()
export class StarWarsApiService {
    private planets: PlanetsObservable;
    protected planetsData: Array<Planet> = [];

    private species: SpeciesObservable;
    protected speciesData: Array<Species> = [];

    private appData: Array<AppPlanet> = [];
    private appPlanets: AppPlanetsObservable;

    constructor(private network: NetworkService) {

        console.log('star wars');

        this.planets = new PlanetsObservable();
        this.species = new SpeciesObservable();
        this.appPlanets = new AppPlanetsObservable();
        this.fetch(StarWarsApiService.rootUrl + 'planets/', 'planetsData', 'planets');
        this.fetch(StarWarsApiService.rootUrl + 'species/', 'speciesData', 'species');

        Observable.forkJoin(
            this.getPlanets(),
            this.getSpieces()
        ).subscribe(results => {
            const planets = results[0];
            const species = results[1];
            planets.forEach(planet => {
                let data: AppPlanet = planet as AppPlanet;

                data.species = [];
                species.forEach(item => {
                    if (planet.url === item.homeworld) {
                        data.species.push(item);
                    }
                });

                this.appData.push(data);
            });

            this.appPlanets.addSubjects(this.appData);
        });
    }

    static get rootUrl(): string {
        return 'https://swapi.co/api/';
    }

    private fetch(url: string, target: string, targetObservable: string): void {
        this.network.get(url).subscribe(response => {
            const resp = response as any;
            resp.results.forEach((item) => {
                this[target].push(item);
            });

            if (resp.next) {
                this.fetch(resp.next, target, targetObservable);
            } else {
                this[targetObservable].addSubjects(this[target]);
                this[targetObservable].complete();
            }
        });
    }

    private getPlanets(): Observable<Array<Planet>> {
        return this.planets.observer;
    }

    private getSpieces(): Observable<Array<Species>> {
        return this.species.observer;
    }

    getData(): Observable<Array<AppPlanet>> {
        return this.appPlanets.observer;
    }
}
