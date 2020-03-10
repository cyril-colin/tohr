import { Component, OnInit, Input } from '@angular/core';
import { BrowserTorrent } from 'src/app/core/model/torrent';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { ProxyBrowserService } from 'src/app/core/services/proxy/proxy-browser/proxy-browser.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorAreaItem } from '../error-area/error-area.component';

@Component({
  selector: 'app-torrent-browser-item',
  templateUrl: './torrent-browser-item.component.html',
  styleUrls: ['./torrent-browser-item.component.scss']
})
export class TorrentBrowserItemComponent implements OnInit {
  @Input() torrent: BrowserTorrent;
  @Input() currentDest: TorrentDestination;
  added = false;
  errors: ErrorAreaItem[] = [];
  constructor(
    private proxyBrowserService: ProxyBrowserService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }

  add(torrent: BrowserTorrent, destination: TorrentDestination): void {
    this.errors = [];
    this.proxyBrowserService.add(torrent, destination).subscribe({
      next: (res) => {
        if (res.result === 'success') {
          this.added = true;
        } else {
          console.log(res)
          this.errors.push({id: 0, message: this.translate.instant('browser.errors.adding')});
          console.error(res);
        }
      },
      error: (err) => {
        this.errors.push({id: 0, message: this.translate.instant('browser.errors.500')});
        console.error(err)
      },
    });
  }

}
