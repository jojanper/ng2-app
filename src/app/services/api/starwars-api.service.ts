import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppObserverArray } from '../../widgets/base';
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

export class PlanetsObservable extends AppObserverArray<Planet> {}
export class SpeciesObservable extends AppObserverArray<Species> {}
export class AppPlanetsObservable extends AppObserverArray<AppPlanet> {}


@Injectable()
export class StarWarsApiService {
    private planets: PlanetsObservable;
    protected planetsData: Array<Planet> = [];

    private species: SpeciesObservable;
    protected speciesData: Array<Species> = [];

    private appPlanets: AppPlanetsObservable;

    private connectionOptions: ConnectionOptions;

    constructor(private network: NetworkService) {

        this.connectionOptions = new ConnectionOptions();
        this.connectionOptions.cors = true;

        this.planets = new PlanetsObservable();
        this.species = new SpeciesObservable();
        this.appPlanets = new AppPlanetsObservable();
        this.fetch(planetsUrl, 'planetsData', 'planets');
        this.fetch(spiecesUrl, 'speciesData', 'species');

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

    private fetch(url: string, target: string, targetObservable: string): void {
        this.network.get(url, this.connectionOptions).subscribe(response => {
            const resp = response as any;
            this[target] = this[target].concat(resp.results);

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
