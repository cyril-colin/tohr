import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { MODAL_CONTAINER_DATA, ModalInjectedData } from '../modal/modal-injection';
import { ErrorAreaItem } from '../error-area/error-area.component';

@Component({
  selector: 'app-download-confirm-dialog',
  templateUrl: './download-confirm-dialog.component.html',
  styleUrls: ['./download-confirm-dialog.component.scss']
})
export class DownloadConfirmDialogComponent {
  @Output() confirmEvent = new EventEmitter<void>();

  @Input() errors: ErrorAreaItem[] = [];
  @Input() isLoading = false;
  constructor(
    @Inject(MODAL_CONTAINER_DATA) public injected: ModalInjectedData,
    ) {}

  close(): void {
    this.injected.ref.dispose();
  }

  confirm(): void {
    this.confirmEvent.emit();
  }

}
