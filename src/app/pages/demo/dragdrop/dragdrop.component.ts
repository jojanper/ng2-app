import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
    selector: 'dng-drag-drop-app-demo',
    templateUrl: './dragdrop.component.html',
    styleUrls: ['dragdrop.scss']
})
export class DemoDragDropComponent {
    todo = [
            {
              title: 'Episode I - The Phantom Menace',
              poster: 'https://upload.wikimedia.org/wikipedia/en/4/40/Star_Wars_Phantom_Menace_poster.jpg'
            },
            {
              title: 'Episode II - Attack of the Clones',
              poster: 'https://upload.wikimedia.org/wikipedia/en/3/32/Star_Wars_-_Episode_II_Attack_of_the_Clones_%28movie_poster%29.jpg'
            },
            {
              title: 'Episode III - Revenge of the Sith',
              poster: 'https://upload.wikimedia.org/wikipedia/en/9/93/Star_Wars_Episode_III_Revenge_of_the_Sith_poster.jpg'
            },
            {
              title: 'Episode IV - A New Hope',
              poster: 'https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg'
            },
            {
              title: 'Episode V - The Empire Strikes Back',
              poster: 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'
            }
      ];

      done = [
        {
            title: 'Episode VI - Return of the Jedi',
            poster: 'https://upload.wikimedia.org/wikipedia/en/b/b2/ReturnOfTheJediPoster1983.jpg'
          },
          {
            title: 'Episode VII - The Force Awakens',
            poster: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg'
          },
          {
            title: 'Episode VIII - The Last Jedi',
            poster: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Star_Wars_The_Last_Jedi.jpg'
          }
      ];

    lists = [this.todo, this.done];

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
