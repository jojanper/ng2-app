import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StarWarsApiService } from '../../services';


@Component({
  selector: 'dng-species-detail',
  templateUrl: './species-detail.component.html',
})
export class SpeciesDetailComponent {
    done = false;
    data: any;

    constructor(private api: StarWarsApiService, private route: ActivatedRoute) {
        this.api.getSpeciesDetail(this.route.snapshot.params.id).subscribe(response => {
            this.data = response;
            this.done = true;
        });
    }
}
