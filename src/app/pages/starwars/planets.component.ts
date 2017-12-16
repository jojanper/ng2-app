import { Component, OnInit } from '@angular/core';

import { StarWarsApiService, AppPlanet } from '../../services';


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
        this.data = data.slice();
        this.sort();
        this.done = true;
    });
  }

  private sort() {
    // Ascending order by default
    this.data = this.data.sort((a, b) => {
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
}
