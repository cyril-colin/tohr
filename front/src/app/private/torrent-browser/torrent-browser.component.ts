import { Component, OnInit } from '@angular/core';
import { BrowserTorrent } from 'src/app/core/model/torrent';
import { Observable } from 'rxjs';
import { ProxyBrowserService } from 'src/app/core/services/proxy/proxy-browser/proxy-browser.service';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { MainToolbarService } from 'src/app/shared/main-toolbar/main-toolbar.service';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-torrent-browser',
  templateUrl: './torrent-browser.component.html',
  styleUrls: ['./torrent-browser.component.scss']
})
export class TorrentBrowserComponent implements OnInit {

  torrents$: Observable<BrowserTorrent[]>;
  torrentDestinations$: Observable<TorrentDestination[]>;
  form: FormGroup;

  searchResult: BrowserTorrent[];
  defaultDestination: TorrentDestination;

  constructor(
    private proxyBrowserService: ProxyBrowserService,
    private proxyMonitoringService: ProxyMonitoringService,
    private mainToolbarService: MainToolbarService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
      this.mainToolbarService.setMainTitle('browser.mainTitle');
      this.torrentDestinations$ = this.proxyMonitoringService.getTorrentDestinations().pipe(
        tap(res => this.defaultDestination = res.find(r => r.default))
      );

      this.form = this.fb.group({
        search: this.fb.control(null, Validators.required),
        destination: this.fb.control(null, Validators.required),
      });
  }


  search(): void {
    const search = this.form.getRawValue();
    this.proxyBrowserService.search(search).subscribe({
      next: (res) => this.searchResult = res,
      error: (err) => {
        console.error(err);
      }
    });
  }

  add(torrent: BrowserTorrent): void {
    this.proxyBrowserService.add(torrent, this.form.getRawValue().destination).subscribe({
      next: (res) => {
        if (res.result === 'success') {
          this.router.navigate(['private', 'dashboard']);
        } else {
          console.error(res);
        }
      },
      error: (err) => console.error(err),
    });
  }

  selectDestination(destination: TorrentDestination): void {
    this.form.controls.destination.setValue(destination);
  }

}
