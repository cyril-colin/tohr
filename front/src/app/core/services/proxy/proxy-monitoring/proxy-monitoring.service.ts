import { Injectable } from '@angular/core';
import { DiskStatus, mockDiskStatus } from 'src/app/core/model/disk-status.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { map, take, share } from 'rxjs/operators';
import { CurrentProcessInfo } from 'src/app/core/model/current-process-info.model';
import { ExternalLink } from 'src/app/core/model/external-link.model';


@Injectable({
  providedIn: 'root'
})
export class ProxyMonitoringService {
  endpoint = '/api';
  constructor(
    private http: HttpClient,
  ) { }

  getTorrentDestinations(): Observable<TorrentDestination[]> {
    return this.http.get<TorrentDestination[]>(this.endpoint + '/monitoring/torrent-destinations');
  }

  getVersion(): Observable<any> {
    return this.http.get('/assets/version.txt', {responseType: 'text'}).pipe(map(res=> ({version: res})));
  }

  getDiskUsage(): Observable<DiskStatus[]> {
    const request = this.http.get<DiskStatus[]>(this.endpoint + '/monitoring/disk-usage');
    // const request = of(mockDiskStatus);
    return request.pipe(map(status => {
      status.forEach(s => {
        s.size *= 1000;
        s.available *= 1000;
        s.used *= 1000;
      });

      return status;
    }));
  }

  getCurrentProcessInfo(): Observable<CurrentProcessInfo> {
    return this.http.get<CurrentProcessInfo>(this.endpoint + '/monitoring/process-informations');
  }

  getExternalLinks(): Observable<ExternalLink[]> {
    const request = this.http.get<ExternalLink[]>(this.endpoint + '/monitoring/external-links').pipe(share(), take(1));
    return request;
  }
}
