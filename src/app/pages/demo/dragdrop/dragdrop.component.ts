import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { MovieService } from './movie.service';
import { config } from './config';
import { Movie } from './movie.models';


export class MyDataSource extends DataSource<Movie | undefined> {
  private initialData: Movie[] = [
    {
      id: 19404,
      title: 'Dilwale Dulhania Le Jayenge',
      overview: 'Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values. Simran has left for India to be married to her childhood fiancé. Raj leaves for India with a mission at his hands, to claim his lady love under the noses of her whole family. Thus begins a saga.',
      poster_path: '\/uC6TTUhPpQCmgldGyYveKRAu8JN.jpg'
    }
  ];
  private dataStream = new BehaviorSubject<(Movie | undefined)[]>(this.initialData)
  private subscription = new Subscription();

  constructor(private movieService: MovieService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(Movie | undefined)[]> {
    this.subscription.add(collectionViewer.viewChange.subscribe((range) => {
      console.log(range);
      this.movieService.get(config.api.topRated)
        .subscribe((data) => {
          this.formatDta(JSON.parse(data._body).results);
        });
    }));
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  formatDta(_body: Movie[]): void {
    console.log(_body);
    this.dataStream.next(_body);
  }
}

export class MyDataSource2 extends DataSource<Movie | undefined> {
  //private length = 100000;
  private pageSize = 100;
  private cachedData = Array.from<Movie>({length: 100000});/*.map((_, i) => {
    return {title: i.toString()} as Movie;
  });*/
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<(Movie | undefined)[]>([]/*this.cachedData*/);
  private subscription = new Subscription();

  connect(collectionViewer: CollectionViewer): Observable<(Movie | undefined)[]> {
    console.log(this.cachedData.length);
    this.setInitialData();
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const startPage = this.getPageForIndex(range.start);
      const endPage = this.getPageForIndex(range.end - 1);
      console.log(startPage, endPage, range.start, range.end);
      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(i);
      }
    }));
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number) {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    // Use `setTimeout` to simulate fetching data from server.
    setTimeout(() => {
      const start = page * this.pageSize;
      /*
      const end = start + this.pageSize;
      const cachedData = this.cachedData.slice(start, end);
      */

      const newData = Array.from({length: this.pageSize}).map((_, i) => {
        return {title: (start + i).toString()} as Movie;
      });

      this.cachedData.splice(start, this.pageSize, ...newData);

      console.log(start, this.cachedData.length);
      this.dataStream.next(this.cachedData);
    }, Math.random() * 1000 + 200);
  }

  private setInitialData() {
    const newData = Array.from({length: this.pageSize}).map((_, i) => {
      return {title: i.toString()} as Movie;
    });

    this.cachedData.splice(0, this.pageSize, ...newData);

    //console.log(start, this.cachedData.length);
    this.dataStream.next(this.cachedData);
  }
}

export class MyDataSource3 extends DataSource<string | undefined> {
  private length = 100000;
  private pageSize = 100;
  private cachedData = Array.from<string>({length: this.length});
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<(string | undefined)[]>(this.cachedData);
  private subscription = new Subscription();

  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const startPage = this.getPageForIndex(range.start);
      const endPage = this.getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(i);
      }
    }));
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number) {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    // Use `setTimeout` to simulate fetching data from server.
    setTimeout(() => {
      const cachedData = [];
      const start = page * this.pageSize;
      const end = start + this.pageSize;
      for (let i = start; i < end; i++) {
        cachedData.push(`Item #${i}`);
      }
      this.dataStream.next(cachedData);

      /*
      this.cachedData.splice(page * this.pageSize, this.pageSize,
          ...Array.from({length: this.pageSize})
              .map((_, i) => `Item #${page * this.pageSize + i}`));
      this.dataStream.next(this.cachedData);
              */
    }, Math.random() * 1000 + 200);
  }
}


@Component({
    selector: 'dng-drag-drop-app-demo',
    templateUrl: './dragdrop.component.html',
    styleUrls: ['dragdrop.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoDragDropComponent {
    todo = [
          {
            display: 'Episode I - The Phantom Menace',
            preview: 'https://upload.wikimedia.org/wikipedia/en/4/40/Star_Wars_Phantom_Menace_poster.jpg'
          },
          {
            display: 'Episode II - Attack of the Clones',
            preview: 'https://upload.wikimedia.org/wikipedia/en/3/32/Star_Wars_-_Episode_II_Attack_of_the_Clones_%28movie_poster%29.jpg'
          },
          {
            display: 'Episode III - Revenge of the Sith',
            preview: 'https://upload.wikimedia.org/wikipedia/en/9/93/Star_Wars_Episode_III_Revenge_of_the_Sith_poster.jpg'
          },
          {
            display: 'Episode IV - A New Hope',
            preview: 'https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg'
          },
          {
            display: 'Episode V - The Empire Strikes Back',
            preview: 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'
          },
          {
            display: 'Star Wars: Episode IX',
            preview: 'https://upload.wikimedia.org/wikipedia/not-available.jpg'
          }
      ];

      done = [
          {
            display: 'Episode VI - Return of the Jedi',
            preview: 'https://upload.wikimedia.org/wikipedia/en/b/b2/ReturnOfTheJediPoster1983.jpg'
          },
          {
            display: 'Episode VII - The Force Awakens',
            preview: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg'
          },
          {
            display: 'Episode VIII - The Last Jedi',
            preview: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Star_Wars_The_Last_Jedi.jpg'
          },
          {
            display: 'Solo: A Star Wars Story',
            preview: 'https://upload.wikimedia.org/wikipedia/en/5/54/Solo_A_Star_Wars_Story_poster.jpg'
          },
          {
            display: 'Rogue One',
            preview: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Rogue_One%2C_A_Star_Wars_Story_poster.png'
          }
      ];

    lists = [
      {
        data: this.todo,
        display: 'Seen'
      },
      {
        data: this.done,
        display: 'Not seen'
      },
      {
        data: [],
        display: 'Trash'
      }
    ];

    dragHandle = true;
    dragPreview = true;
    dragPlaceholder = true;

    constructor(private movieService: MovieService) {
    }
    //ds = new MyDataSource(this.movieService);
    ds = new MyDataSource2();
    //ds = new MyDataSource3();
    /*
    ds = Array.from({length: 100000}).map((_, i) => {
      return {title: i};
    });
    */

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
    }

    movieImagePath(movie: Movie) {
      //console.log(movie);
      return `https://image.tmdb.org/t/p/w370_and_h556_bestv2/${movie.poster_path}`;
    }
}
