import { Component, OnInit } from '@angular/core';

import { AppObserverArray } from '../../widgets';
import { NetworkService } from '../../services';


export interface Planets {
  name: string,
  diameter: string
}

export class PlanetsObservable extends AppObserverArray<Planets> {
  setPlanets(planets: Array<Planets>): void {
    this.addSubjects(planets);
  }
}

@Component({
  selector: 'dng-planet',
  templateUrl: './planets.component.html',
})
export class PlanetsComponent implements OnInit {

  done = false;
  tableOptions = {
    order: ['name', 'diameter']
  };

  protected planets: PlanetsObservable;
  protected next: string = null;

  protected allPlanets: Array<any> = [];

  constructor(private network: NetworkService) {
    this.planets = new PlanetsObservable();
  }

  ngOnInit() {
    this.fetch('https://swapi.co/api/planets/');
  }

  fetch(url: string) {
    this.network.get(url).subscribe(response => {
      const resp = response as any;
      this.planets.setPlanets(resp.results);
      this.next = resp.next;

      resp.results.forEach((planet) => {
        this.allPlanets.push(planet);
      });

      if (this.next) {
        this.fetch(this.next);
      }
      else {
        // Ascending order by default
        this.allPlanets = this.allPlanets.sort(function compareDiameter(a, b) {
          if (a.diameter === 'unknown' && b.diameter === 'unknown') {
            return 0;
          }

          const ad = parseInt(a.diameter);
          const bd = parseInt(b.diameter);

          if (a.diameter === 'unknown') {
            return bd;
          }

          if (b.diameter === 'unknown') {
            return -ad;
          }

          return ad - bd;
          /*

          if (a.diameter === 'unknown' && b.diameter === 'unknown') {
            return 0;
          }

          if (a.diameter === 'unknown') {
            return -b.diameter;
          }

          if (b.diameter === 'unknown') {
            return a.diameter;
          }

          return a.diameter - b.diameter;
          */
        });

        this.done = true;

        console.log(this.allPlanets);
      }
    });
  }

  nextPage() {
    this.allPlanets = this.allPlanets.reverse();//this.fetch(this.next);
  }
}

/*
{name: "Jakku", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
1
:
{name: "Iktotch", rotation_period: "22", orbital_period: "481", diameter: "unknown", climate: "arid, rocky, windy", …}
2
:
{name: "Tholoth", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
3
:
{name: "Iridonia", rotation_period: "29", orbital_period: "413", diameter: "unknown", climate: "unknown", …}
4
:
{name: "Quermia", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
5
:
{name: "Cerea", rotation_period: "27", orbital_period: "386", diameter: "unknown", climate: "temperate", …}
6
:
{name: "Troiken", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
7
:
{name: "Umbara", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
8
:
{name: "Champala", rotation_period: "27", orbital_period: "318", diameter: "unknown", climate: "temperate", …}
9
:
{name: "Shili", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "temperate", …}
10
:
{name: "Aleen Minor", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
11
:
{name: "Skako", rotation_period: "27", orbital_period: "384", diameter: "unknown", climate: "temperate", …}
12
:
{name: "Polis Massa", rotation_period: "24", orbital_period: "590", diameter: "0", climate: "artificial temperate ", …}
13
:
{name: "Mirial", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
14
:
{name: "Serenno", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
15
:
{name: "Cato Neimoidia", rotation_period: "25", orbital_period: "278", diameter: "0", climate: "temperate, moist", …}
16
:
{name: "Ojom", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "frigid", …}
17
:
{name: "Stewjon", rotation_period: "unknown", orbital_period: "unknown", diameter: "0", climate: "temperate", …}
18
:
{name: "Zolan", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
19
:
{name: "Socorro", rotation_period: "20", orbital_period: "326", diameter: "0", climate: "arid", …}
20
:
{name: "Trandosha", rotation_period: "25", orbital_period: "371", diameter: "0", climate: "arid", …}
21
:
{name: "unknown", rotation_period: "0", orbital_period: "0", diameter: "0", climate: "unknown", …}
22
:
{name: "Concord Dawn", rotation_period: "unknown", orbital_period: "unknown", diameter: "unknown", climate: "unknown", …}
23
:
{name: "Mustafar", rotation_period: "36", orbital_period: "412", diameter: "4200", climate: "hot", …}
24
:
{name: "Endor", rotation_period: "18", orbital_period: "402", diameter: "4900", climate: "temperate", …}
25
:
{name: "Bestine IV", rotation_period: "26", orbital_period: "680", diameter: "6400", climate: "temperate", …}
26
:
{name: "Hoth", rotation_period: "23", orbital_period: "549", diameter: "7200", climate: "frozen", …}
27
:
{name: "Rodia", rotation_period: "29", orbital_period: "305", diameter: "7549", climate: "hot", …}
28
:
{name: "Toydaria", rotation_period: "21", orbital_period: "184", diameter: "7900", climate: "temperate", …}
29
:
{name: "Dagobah", rotation_period: "23", orbital_period: "341", diameter: "8900", climate: "murky", …}
30
:
{name: "Felucia", rotation_period: "34", orbital_period: "231", diameter: "9100", climate: "hot, humid", …}
31
:
{name: "Dantooine", rotation_period: "25", orbital_period: "378", diameter: "9830", climate: "temperate", …}
32
:
{name: "Mygeeto", rotation_period: "12", orbital_period: "167", diameter: "10088", climate: "frigid", …}
33
:
{name: "Haruun Kal", rotation_period: "25", orbital_period: "383", diameter: "10120", climate: "temperate", …}
34
:
{name: "Yavin IV", rotation_period: "24", orbital_period: "4818", diameter: "10200", climate: "temperate, tropical", …}
35
:
{name: "Tatooine", rotation_period: "23", orbital_period: "304", diameter: "10465", climate: "arid", …}
36
:
{name: "Dathomir", rotation_period: "24", orbital_period: "491", diameter: "10480", climate: "temperate", …}
37
:
{name: "Ryloth", rotation_period: "30", orbital_period: "305", diameter: "10600", climate: "temperate, arid, subartic", …}
38
:
{name: "Corellia", rotation_period: "25", orbital_period: "329", diameter: "11000", climate: "temperate", …}
39
:
{name: "Mon Cala", rotation_period: "21", orbital_period: "398", diameter: "11030", climate: "temperate", …}
40
:
{name: "Geonosis", rotation_period: "30", orbital_period: "256", diameter: "11370", climate: "temperate, arid", …}
41
:
{name: "Naboo", rotation_period: "26", orbital_period: "312", diameter: "12120", climate: "temperate", …}
42
:
{name: "Nal Hutta", rotation_period: "87", orbital_period: "413", diameter: "12150", climate: "temperate", …}
43
:
{name: "Tund", rotation_period: "48", orbital_period: "1770", diameter: "12190", climate: "unknown", …}
44
:
{name: "Coruscant", rotation_period: "24", orbital_period: "368", diameter: "12240", climate: "temperate", …}
45
:
{name: "Alderaan", rotation_period: "24", orbital_period: "364", diameter: "12500", climate: "temperate", …}
46
:
{name: "Kashyyyk", rotation_period: "26", orbital_period: "381", diameter: "12765", climate: "tropical", …}
47
:
{name: "Sullust", rotation_period: "20", orbital_period: "263", diameter: "12780", climate: "superheated", …}
48
:
{name: "Utapau", rotation_period: "27", orbital_period: "351", diameter: "12900", climate: "temperate, arid, windy", …}
49
:
{name: "Dorin", rotation_period: "22", orbital_period: "409", diameter: "13400", climate: "temperate", …}
50
:
{name: "Eriadu", rotation_period: "24", orbital_period: "360", diameter: "13490", climate: "polluted", …}
51
:
{name: "Chandrila", rotation_period: "20", orbital_period: "368", diameter: "13500", climate: "temperate", …}
52
:
{name: "Muunilinst", rotation_period: "28", orbital_period: "412", diameter: "13800", climate: "temperate", …}
53
:
{name: "Kalee", rotation_period: "23", orbital_period: "378", diameter: "13850", climate: "arid, temperate, tropical", …}
54
:
{name: "Ord Mantell", rotation_period: "26", orbital_period: "334", diameter: "14050", climate: "temperate", …}
55
:
{name: "Vulpter", rotation_period: "22", orbital_period: "391", diameter: "14900", climate: "temperate, artic", …}
56
:
{name: "Saleucami", rotation_period: "26", orbital_period: "392", diameter: "14920", climate: "hot", …}
57
:
{name: "Glee Anselm", rotation_period: "33", orbital_period: "206", diameter: "15600", climate: "tropical, temperate", …}
58
:
{name: "Malastare", rotation_period: "26", orbital_period: "201", diameter: "18880", climate: "arid, temperate, tropical", …}
59
:
{name: "Kamino", rotation_period: "27", orbital_period: "463", diameter: "19720", climate: "temperate", …}
60
:
{name: "Bespin", rotation_period: "12", orbital_period: "5110", diameter: "118000", climate: "temperate", …}
*/
