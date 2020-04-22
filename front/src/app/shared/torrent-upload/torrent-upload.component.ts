import { Component, OnInit, OnDestroy } from '@angular/core';
import { TorrentDestination } from '../../core/model/torrent-destination';
import { TorrentPost } from 'src/app/core/model/torrent';
import { ErrorAreaItem } from 'src/app/shared/error-area/error-area.component';
import { UploadService } from 'src/app/core/services/upload/upload.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TorrentDataService } from 'src/app/core/services/torrent-data/torrent-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { MainToolbarService } from 'src/app/shared/main-toolbar/main-toolbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-torrent-upload',
  templateUrl: 'torrent-upload.component.html',
  styleUrls: ['torrent-upload.component.scss']
})
export class TorrentUploadComponent implements OnInit, OnDestroy {
  private componetDestroyed$ = new Subject();
  torrentsToAdd: TorrentPost[] = [];
  destinations$: Observable<TorrentDestination[]>;
  destination: TorrentDestination;
  fileNumber = 0;

  errors: ErrorAreaItem[] = [];

  isUploading = false;

  constructor(
    private proxyMonitoringService: ProxyMonitoringService,
    private uploadService: UploadService,
    private router: Router,
    private route: ActivatedRoute,
    private torrentDataService: TorrentDataService,
    private mainToolbarService: MainToolbarService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.mainToolbarService.setMainTitle('uploadForm.mainTitle');
    this.destinations$ = this.proxyMonitoringService.getTorrentDestinations().pipe(
      tap(res => this.destination = res.filter(t => t.default)[0])
    );
  }


  uploadTorrents() {
    if (this.torrentsToAdd.length < 1 || !this.destination) {
      const errors = [{ id: 1, message: this.translate.instant('uploadForm.errors.selectTorrent') }];
      this.errors = errors;
      return;
    }

    this.torrentsToAdd.forEach(t => t.downloadDir = this.destination.path);
    this.isUploading = true;

    this.torrentDataService.addMultipleTorrents(this.torrentsToAdd).pipe(takeUntil(this.componetDestroyed$)).subscribe({
      next: _ => {
        this.isUploading = false;
        this.router.navigate(['..', 'dashboard'], { relativeTo: this.route });
      },
      error: err => {
        console.error(err);
        this.isUploading = false;
        this.errors = [this.getUploadError(err)];
      }
    });
  }


  updateSelectedFiles(files: File[]) {
    this.fileNumber = files.length;
    this.uploadService.getConvertedFiles(files).pipe(takeUntil(this.componetDestroyed$)).subscribe({
      next: torrents => this.torrentsToAdd = torrents,
    });
  }


  selectDestination(des: TorrentDestination) {
    this.destination = des;
  }

  private getUploadError(response: HttpErrorResponse): ErrorAreaItem {
    let errorMessage = null;
    if (500 <= response.status) {
      errorMessage = this.translate.instant('uploadForm.errors.500');
    }

    return { id: response.status, message: errorMessage };
  }

  ngOnDestroy() {
    this.componetDestroyed$.next();
    this.componetDestroyed$.unsubscribe();
  }
}
