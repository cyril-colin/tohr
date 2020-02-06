import { Component } from '@angular/core';
import { SideMenuService } from './shared/side-menu/side-menu.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private sideMenuService: SideMenuService,
    private translate: TranslateService,
    ) {
      this.translate.setDefaultLang('fr');
      translate.use('fr');
    }

  openSideMenu() {
    this.sideMenuService.open();
  }
}
