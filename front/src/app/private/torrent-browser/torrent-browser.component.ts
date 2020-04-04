import { Component, OnInit } from '@angular/core';
import { BrowserTorrent } from 'src/app/core/model/torrent';
import { Observable } from 'rxjs';
import { ProxyBrowserService, SearchData } from 'src/app/core/services/proxy/proxy-browser/proxy-browser.service';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { MainToolbarService } from 'src/app/shared/main-toolbar/main-toolbar.service';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-torrent-browser',
  templateUrl: './torrent-browser.component.html',
  styleUrls: ['./torrent-browser.component.scss']
})
export class TorrentBrowserComponent implements OnInit {

  torrents$: Observable<BrowserTorrent[]>;
  torrentDestinations$: Observable<TorrentDestination[]>;

  searchResult: BrowserTorrent[] = [];
  selectedDestination: TorrentDestination;
  searching = false;
  searchErrors: string[] = [];
  constructor(
    private proxyBrowserService: ProxyBrowserService,
    private proxyMonitoringService: ProxyMonitoringService,
    private mainToolbarService: MainToolbarService,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
      this.mainToolbarService.setMainTitle('browser.mainTitle');
      this.torrentDestinations$ = this.proxyMonitoringService.getTorrentDestinations().pipe(
        tap(res => this.selectedDestination = res.find(r => r.default)),
      );
  }


  search(search: SearchData): void {
    this.searching = true;
    this.selectedDestination = search.destination;
    this.proxyBrowserService.search(search).subscribe({
      next: (res) => {
        this.searching = false;
        this.searchResult = res;
      },
      error: (err) => {
        this.searching = false
        this.searchErrors.push(this.translate.instant('browser.errors.search'));
        console.error(err);
      },
      complete: () => {
        this.searching = false;
      }
    });
  }
}
