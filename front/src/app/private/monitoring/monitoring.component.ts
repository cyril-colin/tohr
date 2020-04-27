import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { DiskStatus } from 'src/app/core/model/disk-status.model';
import { CurrentProcessInfo } from 'src/app/core/model/current-process-info.model';
import { CurrentUserService } from 'src/app/core/services/current-user/current-user.service';
import { User } from 'src/app/core/model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {

  currentUser: User;
  torrentTypes$: Observable<TorrentDestination[]>;
  diskStatus$: Observable<DiskStatus[]>;
  currentProcessInfo$: Observable<CurrentProcessInfo>;

  constructor(
    private router: Router,
    private proxyMonitoringService: ProxyMonitoringService,
    private currentUserService: CurrentUserService,
  ) { }

  ngOnInit() {
    this.torrentTypes$ = this.proxyMonitoringService.getTorrentDestinations();
    this.diskStatus$ = this.proxyMonitoringService.getDiskUsage();
    this.currentProcessInfo$ = this.proxyMonitoringService.getCurrentProcessInfo();
    this.currentUser = this.currentUserService.currentUser
  }

  logout() {
    this.currentUserService.logout();
    this.router.navigate(['/login']);
  }

}
