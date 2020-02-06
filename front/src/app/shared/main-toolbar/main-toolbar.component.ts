import { Component, OnInit, Input } from '@angular/core';
import { SideMenuService } from '../side-menu/side-menu.service';
import { Title } from '@angular/platform-browser';
import { MainToolbarService } from './main-toolbar.service';
import { Observable } from 'rxjs';
import { CurrentUserService } from 'src/app/core/services/current-user/current-user.service';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
  constructor(
    private sideMenuService: SideMenuService,
    private titleService: MainToolbarService,
    private currentUserService: CurrentUserService,
  ) { }

  get title(): Observable<string> {
    return this.titleService.title$;
  }
  openSideMenu() {
    this.sideMenuService.open();
  }

  ngOnInit() {
  }

  isLogged() {
    return this.currentUserService.isLogged;
  }

}
