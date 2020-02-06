import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuComponent } from './side-menu.component';
import { SharedModule } from '../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SIDE_MENU_CONTAINER_DATA } from './side-menu-injection';
import { TranslateService, TranslateStore, TranslateLoader, TranslateFakeLoader, TranslateCompiler, TranslateParser } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslateTestingModule } from '../translate-testing.module';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideMenuComponent ],
      imports: [
        RouterTestingModule,
        TranslateTestingModule,
      ],
      providers: [
        { provide: SIDE_MENU_CONTAINER_DATA, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
