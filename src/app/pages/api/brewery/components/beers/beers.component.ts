import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dng-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.scss']
})
export class BeersComponent implements OnInit {
  list = [];
  constructor() {
    for (let i = 0; i < 250; i++)
      this.list.push(i);
  }

  ngOnInit() {
  }

}
