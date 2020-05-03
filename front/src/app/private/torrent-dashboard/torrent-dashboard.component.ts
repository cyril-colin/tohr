import { Component, OnInit } from '@angular/core';
import { Observable, timer, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Torrent } from 'src/app/core/model/torrent';
import { TorrentDataService } from 'src/app/core/services/torrent-data/torrent-data.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonListAction } from 'src/app/shared/button-list-action/button-list-action.component';


@Component({
  selector: 'app-torrent-dashboard',
  templateUrl: './torrent-dashboard.component.html',
  styleUrls: ['./torrent-dashboard.component.scss']
})
export class TorrentDashboardComponent implements OnInit {

  torrents$: Observable<Torrent[]>;
  errors: string[] = [];
  sorters: ButtonListAction[] = [];
  constructor(
    public torrentDataService: TorrentDataService,
    private translate: TranslateService,
  ) { }


  ngOnInit() {
    this.torrents$ = this.torrents;
    this.sorters = [
      { label: this.translate.instant('torrentDashboard.filters.name'), id: 'name' },
      { label: this.translate.instant('torrentDashboard.filters.size'), id: 'size' },
      { label: this.translate.instant('torrentDashboard.filters.status'), id: 'status' },
      { label: this.translate.instant('torrentDashboard.filters.date'), id: 'date' },
    ];

  }

  filter(event) {
    this.torrents$ = this.torrents.pipe(
      map(torrents => torrents.filter(t => t.name.toLowerCase().includes(event.nameFilter.toLowerCase()))),
    );
  }

  sortList(action: ButtonListAction) {
    switch (action.id) {
      case 'name':
        this.torrents$ = this.torrents$.pipe(
          map(torrents => torrents.sort((a, b) => a.name.localeCompare(b.name))),
        );
        break;
      case 'size':
        this.torrents$ = this.torrents$.pipe(
          map(torrents => torrents.sort((a, b) => (a.totalSize - b.totalSize))),
        );
        break;
      case 'status':
        this.torrents$ = this.torrents$.pipe(
          map(torrents => torrents.sort((a, b) => (a.status - b.status))),
        );
        break;
      case 'date':
        this.torrents$ = this.torrents$.pipe(
          map(torrents => torrents.sort((a, b) => (a.addedDate - b.addedDate))),
        );
        break;
    }
  }

  get torrents(): Observable<Torrent[]> {
    return timer(0, 5000).pipe(
      switchMap(() => this.torrentDataService.loadInitialData()),
      catchError(error => {
        console.error('Unable to reach the torrent list from server.', error);

        if (error.status === 504) {
          this.errors.push(this.translate.instant('torrentDashboard.errors.504'));
        }

        if (error.status === 500) {
          this.errors.push(this.translate.instant('torrentDashboard.errors.500'));
        }

        return of(null);
      })
    );
  }
}
