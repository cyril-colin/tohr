import { Component, OnInit } from '@angular/core';
import { Observable, timer, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Torrent } from 'src/app/core/model/torrent';
import { TorrentDataService } from 'src/app/core/services/torrent-data/torrent-data.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-torrent-dashboard',
  templateUrl: './torrent-dashboard.component.html',
  styleUrls: ['./torrent-dashboard.component.scss']
})
export class TorrentDashboardComponent implements OnInit {

  torrents$: Observable<Torrent[]>;
  errors: string[] = [];
  constructor(
    public torrentDataService: TorrentDataService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
  ) { }


  ngOnInit() {
    this.torrents$ = timer(0, 5000).pipe(
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
