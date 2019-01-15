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
