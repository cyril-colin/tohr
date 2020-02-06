import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainToolbarComponent } from './main-toolbar.component';
import { SideMenuService } from '../side-menu/side-menu.service';
import { TranslateTestingModule } from '../translate-testing.module';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainToolbarComponent ],
      imports: [
        TranslateTestingModule,
      ],
      providers: [
        {provide: SideMenuService, useValue: {open: () => null}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
