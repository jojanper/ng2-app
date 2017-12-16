import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppObservableArray, AppObservableArrayModes } from '../../widgets/base';
import { NetworkService, ConnectionOptions } from '../network/network.service';


const rootUrl = 'https://swapi.co/api/';
const planetsUrl = rootUrl + 'planets/';
const spiecesUrl = rootUrl + 'species/';

export interface Planet {
    name: string,
    diameter: string
    url: string
}

export interface Species {
    id: string
    name: string
    homeworld: string
    url: string
    planet: Planet
}

export interface AppPlanet extends Planet {
    species: Array<Species>
}

export class PlanetsObservable extends AppObservableArray<Planet> {}
export class SpeciesObservable extends AppObservableArray<Species> {}
export class AppPlanetsObservable extends AppObservableArray<AppPlanet> {}


@Injectable()
export class StarWarsApiService {
    private planets: PlanetsObservable;
    private species: SpeciesObservable;
    private appPlanets: AppPlanetsObservable;

    private connectionOptions: ConnectionOptions;

    constructor(private network: NetworkService) {

        this.connectionOptions = new ConnectionOptions();

        /*
         * Indicate that HTTP requests from this module are CORS so that browser
         * does not perform HTTP OPTIONS before actually executing the request.
         */
        this.connectionOptions.cors = true;

        this.planets = new PlanetsObservable();
        this.species = new SpeciesObservable();
        this.appPlanets = new AppPlanetsObservable(AppObservableArrayModes.PERSISTENT);

        this.fetch(planetsUrl, 'planets');
        this.fetch(spiecesUrl, 'species');

        Observable.forkJoin(
            this.getPlanets(),
            this.getSpieces()
        ).subscribe(results => {
            const planets = results[0];
            const species = results[1];
            this.appPlanets.addSubjects(this.joinPlanetsSpecies(planets, species));
        });
    }

    private joinPlanetsSpecies(planets: Array<Planet>, species: Array<Species>): Array<AppPlanet> {
        return planets.map(planet => {
            let data = planet as AppPlanet;

            data.species = [];
            species.forEach(item => {
                if (planet.url === item.homeworld) {
                    const url = item.url.split('/');

                    // Store also the species ID for later use
                    const spiecesItem = item;
                    item.id = url[url.length - 2];

                    data.species.push(spiecesItem);
                }
            });

            return data;
        })
    }

    private fetch(url: string, targetObservable: string): void {
        this.network.get(url, this.connectionOptions).subscribe(response => {
            const resp = response as any;
            this[targetObservable].push(resp.results);

            if (resp.next) {
                this.fetch(resp.next, targetObservable);
            } else {
                this[targetObservable].next();
                this[targetObservable].complete();
            }
        });
    }

    private getPlanets(): Observable<Array<Planet>> {
        return this.planets.observable;
    }

    private getSpieces(): Observable<Array<Species>> {
        return this.species.observable;
    }

    getData(): Observable<Array<AppPlanet>> {
        return this.appPlanets.observable;
    }

    getSpeciesDetail(id: string): Observable<Species> {
        return this.network.get(spiecesUrl + id + '/', this.connectionOptions).flatMap(response => {
            const species = response as Species;

            // Join the corresponding planet details also
            return this.network.get(species.homeworld, this.connectionOptions).map(planet => {
                species.planet = planet as Planet;
                return species;
            })
        })
    }
}
