import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { StarWarsApiService, Species } from './services';


@Component({
  selector: 'dng-species-detail',
  templateUrl: './species-detail.component.html',
})
export class SpeciesDetailComponent {
    speciesDetails: Observable<Species>;

    constructor(private api: StarWarsApiService, private route: ActivatedRoute) {
        this.speciesDetails = this.api.getSpeciesDetail(this.route.snapshot.params.id).pipe(
            catchError(() => of({} as Species))
        );
    }
}
