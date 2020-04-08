import { Component, Inject } from '@angular/core';
import { SideMenuService } from './shared/side-menu/side-menu.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { ProxyMonitoringService } from './core/services/proxy/proxy-monitoring/proxy-monitoring.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  version$: Observable<any>;
  constructor(
    private sideMenuService: SideMenuService,
    private translate: TranslateService,
    private monitoringService: ProxyMonitoringService,
    @Inject(DOCUMENT) private document: Document,
    ) {

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
