import { Component, OnInit, Input } from '@angular/core';
import { MainToolbarService } from './main-toolbar.service';
import { Observable } from 'rxjs';
import { CurrentUserService } from 'src/app/core/services/current-user/current-user.service';
import { DiskStatus } from 'src/app/core/model/disk-status.model';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
  diskStatus$: Observable<DiskStatus[]>;
  constructor(
    private titleService: MainToolbarService,
    private currentUserService: CurrentUserService,
    private proxyMonitoringService: ProxyMonitoringService,
    private router: Router,
  ) { }

  get title(): Observable<string> {
    return this.titleService.title$;
  }

  ngOnInit() {
    this.diskStatus$ = this.proxyMonitoringService.getDiskUsage();
  }

  goToMonitoring() {
    this.router.navigate(['private', 'monitoring']);
  }

  isLogged() {
    return this.currentUserService.isLogged;
  }

}
