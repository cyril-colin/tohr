import { Component, Inject, AfterViewChecked, AfterContentInit, OnInit } from '@angular/core';
import { SideMenuService } from './shared/side-menu/side-menu.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProxyMonitoringService } from './core/services/proxy/proxy-monitoring/proxy-monitoring.service';
import { CurrentUserService } from './core/services/current-user/current-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  version$: Observable<any>;
  isLogged$: BehaviorSubject<boolean>;
  constructor(
    private sideMenuService: SideMenuService,
    private translate: TranslateService,
    private monitoringService: ProxyMonitoringService,
    private currentUserService: CurrentUserService,
    @Inject(DOCUMENT) private document: Document,
    ) {
      this.isLogged$ = this.currentUserService.isLoggedListener$();
      this.version$ = this.monitoringService.getVersion();
      const supportedLanguages = [ 'en', 'fr'];
      const browserLanguage = supportedLanguages.find(l => l === navigator.language) ? navigator.language : 'en';
      this.translate.setDefaultLang(browserLanguage);
      translate.use(browserLanguage);
      this.document.documentElement.lang = browserLanguage;
    }

  openSideMenu() {
    this.sideMenuService.open();
  }
}
