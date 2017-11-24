import { Component } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dng-app-dialog',
    templateUrl: './demo-dialog.template.html'
})
export class AppDialogComponent {
    closeResult: string;

    constructor(private modalService: NgbModal) {}

    open(content) {
        let options = {
            size: 'lg'
        } as NgbModalOptions;
        this.modalService.open(content, options).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }
}
