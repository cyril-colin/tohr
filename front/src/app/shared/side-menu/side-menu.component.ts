import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/core/services/current-user/current-user.service';
import { SIDE_MENU_CONTAINER_DATA, SideMenuInjectedData } from './side-menu-injection';
import { ProxyMonitoringService } from 'src/app/core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { Observable } from 'rxjs';
import { ExternalLink } from 'src/app/core/model/external-link.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  externalLinks$: Observable<ExternalLink[]>;

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService,
    private proxyMonitoringService: ProxyMonitoringService,
    @Inject(SIDE_MENU_CONTAINER_DATA) public data: SideMenuInjectedData
  ) { }

  ngOnInit() {
    this.externalLinks$ = this.proxyMonitoringService.getExternalLinks();
  }

  close() {
    this.data.ref.dispose();
  }
  logout() {
    this.currentUserService.logout();
    this.router.navigate(['/']);
    this.close();
  }

  isLogged() {
    return this.currentUserService.isLogged;
  }
}
