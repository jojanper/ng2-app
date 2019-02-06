import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
selector: 'dng-dragdrop',
templateUrl: './dragdrop.component.html',
styleUrls: ['dragdrop.component.scss'],
})
export class DragDropComponent {
    @Input() lists: Array<Array<any>>;
    @Input() dragHandle = true;
    @Input() dragPreview = true;
    @Input() dragPlaceholder = true;

    drop(event: CdkDragDrop<Array<any>>) {
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
