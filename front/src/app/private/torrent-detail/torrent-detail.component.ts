import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Torrent } from 'src/app/core/model/torrent';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { DeleteConfirmDialogComponent } from 'src/app/shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { TorrentDataService } from 'src/app/core/services/torrent-data/torrent-data.service';
import { MoveDialogComponent } from 'src/app/shared/move-dialog/move-dialog.component';
import { ProxyTorrentService } from 'src/app/core/services/proxy/proxy-torrent/proxy-torrent.service';
import { MainToolbarService } from 'src/app/shared/main-toolbar/main-toolbar.service';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-torrent-detail',
  templateUrl: './torrent-detail.component.html',
  styleUrls: ['./torrent-detail.component.scss']
})
export class TorrentDetailComponent implements OnInit, OnDestroy {
  private componetDestroyed$ = new Subject();
  torrent$: Observable<Torrent>;
  errors: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private torrentDataService: TorrentDataService,
    private proxyTorrentService: ProxyTorrentService,
    private mainToolbarService: MainToolbarService,
    public modalService: ModalService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.mainToolbarService.setMainTitle('torrentDetail.mainTitle');
    this.refresh();
  }

  openMoveDialog(torrent: Torrent): void {
    const dialogRef = this.modalService.open<MoveDialogComponent>(MoveDialogComponent, torrent);

    dialogRef.instance.validateEvent.pipe(takeUntil(this.componetDestroyed$)).subscribe({
      next: () => {
        dialogRef.instance.close();
        this.refresh();
      }
    });
  }

  openDialog(torrent: Torrent): void {
    const dialogRef = this.modalService.open<DeleteConfirmDialogComponent>(DeleteConfirmDialogComponent, {
      data: torrent
    });

    dialogRef.instance.deleteEvent.pipe(takeUntil(this.componetDestroyed$)).subscribe(result => {
      this.torrentDataService.deleteTorrent(torrent.id, result.deleteData).pipe(takeUntil(this.componetDestroyed$)).subscribe({
        next: _ => {
          dialogRef.instance.close();
          this.router.navigate(['private', 'dashboard']);
        },
        error: err => console.error(err),
      });
    });
  }

  refresh(): void {
    this.route.params.pipe(takeUntil(this.componetDestroyed$)).subscribe({
      next: params => {
        if (isNaN(+params.id)) {
          console.error('Torrent id is not a number : ' + params.id);
          this.errors.push(this.translate.instant('torrentDetail.errors.NaN'));
        } else {
          this.torrent$ = this.proxyTorrentService.getTorrent(+params.id).pipe(
            tap(torrent => {
              this.mainToolbarService.setMainTitle(torrent.name);
            }),
            catchError(err => {
              console.error('Cannot fetch torrent.', err);
              this.errors.push(this.translate.instant('torrentDetail.errors.default'));
              return of(null);
            })
          );
        }
      }
    });
  }

  ngOnDestroy() {
    this.componetDestroyed$.next();
    this.componetDestroyed$.unsubscribe();
  }


}
