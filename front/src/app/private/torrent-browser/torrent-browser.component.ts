import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowserTorrent } from 'src/app/core/model/torrent';
import { Observable } from 'rxjs';
import { ProxyBrowserService, SearchData } from 'src/app/core/services/proxy/proxy-browser/proxy-browser.service';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { HeaderCollapseComponent } from 'src/app/shared/header-collapse/header-collapse.component';

@Component({
  selector: 'app-torrent-browser',
  templateUrl: './torrent-browser.component.html',
  styleUrls: ['./torrent-browser.component.scss']
})
export class TorrentBrowserComponent implements OnInit {
  @ViewChild(HeaderCollapseComponent) header: HeaderCollapseComponent;
  torrents$: Observable<BrowserTorrent[]>;
  torrentDestinations$: Observable<TorrentDestination[]>;
  searchMode = true;
  switchLink: string;
  title: string;

  searchResult: BrowserTorrent[] = [];
  selectedDestination: TorrentDestination;
  searching = false;
  searchErrors: string[] = [];
  constructor(
    private proxyBrowserService: ProxyBrowserService,
    private proxyMonitoringService: ProxyMonitoringService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
      this.switchLink = this.translate.instant('torrentBrowserSearch.switchUpload');
      this.torrentDestinations$ = this.proxyMonitoringService.getTorrentDestinations().pipe(
        tap(res => this.selectedDestination = res.find(r => r.default)),
        tap(() => this.title = this.searchTitle),
      );
  }


  search(search: SearchData): void {
    this.searching = true;
    this.selectedDestination = search.destination;
    this.proxyBrowserService.search(search).subscribe({
      next: (res) => {
        this.searching = false;
        if (res.length > 0) {
          this.header.toggleBar();
        }
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


  switchMode() {
    this.searchMode = !this.searchMode;
    this.title = this.searchMode ? this.searchTitle : this.translate.instant('torrentBrowserSearch.titleUpload');
    this.switchLink = this.searchMode ?
      this.translate.instant('torrentBrowserSearch.switchUpload') : this.translate.instant('torrentBrowserSearch.switchSearch');
  }

  get searchTitle() {
    return this.translate.instant('torrentBrowserSearch.title') + ' ' + this.selectedDestination.description;
  }
}
