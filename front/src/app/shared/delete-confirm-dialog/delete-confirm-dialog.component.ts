import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MODAL_CONTAINER_DATA, ModalInjectedData } from '../modal/modal-injection';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss']
})
export class DeleteConfirmDialogComponent implements OnInit {
  @Output() deleteEvent = new EventEmitter<{deleteData: boolean}>();
  constructor(
    @Inject(MODAL_CONTAINER_DATA) public injected: ModalInjectedData,
    ) {}

  close(): void {
    this.injected.ref.dispose();
  }

  deleteWithData(): void {
    this.deleteEvent.emit({deleteData: true});
  }

  deleteWithoutData(): void {
    this.deleteEvent.emit({deleteData: false});
  }


  ngOnInit() {
  }


}
