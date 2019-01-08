import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { MovieService } from './movie.service';
import { Movie } from './movie.models';


export class MyDataSource2 extends DataSource<Movie | undefined> {
  private pageSize;
  private cachedData: Array<Movie>;
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<(Movie | undefined)[]>([]);
  private subscription = new Subscription();

  constructor(private movieService: MovieService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(Movie | undefined)[]> {
    this.setInitialData();
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

   const remotePage = page + 1;
   const start = page * this.pageSize;
   this.movieService.getMovies(remotePage, (data) => {
      this.fetchedPages.add(page);
      this.cachedData.splice(start, data.results.length, ...data.results);
      this.dataStream.next(this.cachedData);
    });
  }

  private setInitialData() {
    this.movieService.getMovies(1, (data) => {
          this.fetchedPages.add(0);

          this.pageSize = data.results.length;
          this.cachedData = Array.from<Movie>({length: data.total_results});

          this.cachedData.splice(0, data.results.length, ...data.results);
          this.dataStream.next(this.cachedData);
    });
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

    ds = new MyDataSource2(this.movieService);

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
}
