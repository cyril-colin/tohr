import { Component, OnInit, Inject, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ProxyTorrentService } from 'src/app/core/services/proxy/proxy-torrent/proxy-torrent.service';
import { Observable, Subject } from 'rxjs';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { Torrent } from 'src/app/core/model/torrent';
import { ErrorAreaItem } from '../error-area/error-area.component';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { MODAL_CONTAINER_DATA, ModalInjectedData } from '../modal/modal-injection';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-move-dialog',
  templateUrl: './move-dialog.component.html',
  styleUrls: ['./move-dialog.component.scss']
})
export class MoveDialogComponent implements OnInit, OnDestroy {
  private componetDestroyed$ = new Subject();
  @Output() validateEvent = new EventEmitter<void>();
  destinations$: Observable<TorrentDestination[]>;
  destination: TorrentDestination;
  errors: ErrorAreaItem[] = [];

  constructor(
    private proxyTorrentService: ProxyTorrentService,
    private proxyMonitoringService: ProxyMonitoringService,
    private translate: TranslateService,
    @Inject(MODAL_CONTAINER_DATA) public injected: ModalInjectedData,
  ) { }

  ngOnInit() {
    this.destinations$ = this.proxyMonitoringService.getTorrentDestinations();
    this.destination = this.injected.data.destination;
  }

  selectDestination(destination: TorrentDestination): void {
    this.destination = destination;
  }

  close() {
    this.injected.ref.dispose();
  }

  doMove()  {
    this.proxyTorrentService.move(this.injected.data.id, this.destination).pipe(takeUntil(this.componetDestroyed$)).subscribe({
      next: _ => this.validateEvent.emit(),
      error: err => {
        console.error('Move failed.', err);
        this.errors.push({id: 0, message: this.translate.instant('moveDialog.errors.cannotMove')});
      }
    });
  }

  ngOnDestroy() {
    this.componetDestroyed$.next();
    this.componetDestroyed$.unsubscribe();
  }



}
