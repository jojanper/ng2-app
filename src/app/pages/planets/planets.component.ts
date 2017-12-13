import { Component, OnInit } from '@angular/core';

import { StarWarsApiService, AppPlanet, Species } from '../../services';


@Component({
  selector: 'dng-planet',
  templateUrl: './planets.component.html',
})
export class PlanetsComponent implements OnInit {

  done = false;
  data: Array<AppPlanet> = [];

  constructor(private api: StarWarsApiService) {}

  ngOnInit() {
    this.api.getData().subscribe(data => {
      if (data.length) {
        this.data = data.slice();
        this.sort();
        this.done = true;
      }
    });
  }

  private sort() {
    // Ascending order by default
    this.data = this.data.sort(function compareDiameter(a, b) {
      if (a.diameter === 'unknown' && b.diameter === 'unknown') {
        return 0;
      }

      const ad = parseInt(a.diameter, 10);
      const bd = parseInt(b.diameter, 10);

      if (a.diameter === 'unknown') {
        return bd;
      }

      if (b.diameter === 'unknown') {
        return -ad;
      }

      return ad - bd;
    });
  }

  toggleOrder() {
    this.data = this.data.reverse();
  }

  renderSpecies(species: Array<Species>) {
    return species.map(item => {
      return `<a class="btn" routerLinkActive="router-link-active" [routerLink]="['/home']">${item.name}</a>`
    }).join(',');
  }
}
