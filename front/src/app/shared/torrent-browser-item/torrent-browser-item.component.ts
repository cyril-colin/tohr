import { Component, OnInit, Input } from '@angular/core';
import { BrowserTorrent } from 'src/app/core/model/torrent';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { ProxyBrowserService } from 'src/app/core/services/proxy/proxy-browser/proxy-browser.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorAreaItem } from '../error-area/error-area.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-torrent-browser-item',
  templateUrl: './torrent-browser-item.component.html',
  styleUrls: ['./torrent-browser-item.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: '*',
      })),
      state('out', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
      })),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out'))
    ])
  ]
})
export class TorrentBrowserItemComponent implements OnInit {
  @Input() torrent: BrowserTorrent;
  @Input() currentDest: TorrentDestination;
  added = false;
  alreadyAdded = false;
  isAdding = false;
  errors: ErrorAreaItem[] = [];
  collapseAnimation: string;
  constructor(
    private proxyBrowserService: ProxyBrowserService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.collapseAnimation = 'out';
  }

  add(torrent: BrowserTorrent, destination: TorrentDestination): void {
    this.isAdding = true;
    this.errors = [];
    this.proxyBrowserService.add(torrent, destination).subscribe({
      next: (res) => {
        this.isAdding = false;
        if (res.result === 'success' && res.arguments['torrent-duplicate']) {
          this.alreadyAdded = true;
        }
        if (res.result === 'success' && !res.arguments['torrent-duplicate']) {
          this.added = true;
        }
        if (res.result !== 'success') {
          this.errors.push({id: 0, message: this.translate.instant('browser.errors.adding')});
          console.error(res);
        }
      },
      error: (err) => {
        this.isAdding = false;
        this.errors.push({id: 0, message: this.translate.instant('browser.errors.500')});
        console.error(err)
      },
    });
  }

  collapse(): void {
    this.collapseAnimation = this.collapseAnimation === 'out' ? 'in' : 'out';
  }

}
