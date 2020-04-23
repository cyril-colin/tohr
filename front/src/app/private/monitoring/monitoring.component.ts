import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { DiskStatus } from 'src/app/core/model/disk-status.model';
import { CurrentProcessInfo } from 'src/app/core/model/current-process-info.model';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {

  torrentTypes$: Observable<TorrentDestination[]>;
  diskStatus$: Observable<DiskStatus[]>;
  currentProcessInfo$: Observable<CurrentProcessInfo>;

  constructor(
    private proxyMonitoringService: ProxyMonitoringService,
  ) { }

  ngOnInit() {
    this.torrentTypes$ = this.proxyMonitoringService.getTorrentDestinations();
    this.diskStatus$ = this.proxyMonitoringService.getDiskUsage();
    this.currentProcessInfo$ = this.proxyMonitoringService.getCurrentProcessInfo();
  }

}
