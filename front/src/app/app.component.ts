import { Component, Inject } from '@angular/core';
import { SideMenuService } from './shared/side-menu/side-menu.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private sideMenuService: SideMenuService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    ) {
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
