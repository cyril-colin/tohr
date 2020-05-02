import { Component, OnInit, Input } from '@angular/core';
import { Torrent } from 'src/app/core/model/torrent';
import { Router } from '@angular/router';
import { ProxyTorrentService } from 'src/app/core/services/proxy/proxy-torrent/proxy-torrent.service';
import { tap, mergeMap, switchMap, delay } from 'rxjs/operators';
import { ErrorAreaItem } from '../error-area/error-area.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-torrent-item',
  templateUrl: './torrent-item.component.html',
  styleUrls: ['./torrent-item.component.scss']
})
export class TorrentItemComponent implements OnInit {
  @Input() torrent: Torrent;
  isLoading = false;
  errors: ErrorAreaItem[] = [];
  constructor(
    private router: Router,
    private proxyTorrentService: ProxyTorrentService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
  }

  goTorrent(torrent: Torrent): void {
    this.router.navigate(['private', 'torrents', torrent.id]);
  }

  get isPaused() {
    return this.torrent.statusStr === 'TR_STATUS_STOPPED';
  }

  startStop() {
    this.isLoading = true;
    let request = null;
    let potentialError: ErrorAreaItem = null;
    this.errors = [];

    if (this.isPaused) {
      request = this.proxyTorrentService.start(this.torrent.id);
      potentialError = { id:0, message:  this.translate.instant('torrentActions.startError')};
    } else {
      request = this.proxyTorrentService.stop(this.torrent.id);
      potentialError = { id:0, message:  this.translate.instant('torrentActions.stopError')};
    }

    request.pipe(
      mergeMap( _ => this.proxyTorrentService.getTorrent(this.torrent.id)),
      delay(1000),
    ).subscribe({
      next: (res) => {
        this.torrent = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errors.push(potentialError);
      }
    });
  }

}
