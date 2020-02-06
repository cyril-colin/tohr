import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentDashboardComponent } from './torrent-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateTestingModule } from 'src/app/shared/translate-testing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TorrentDashboardComponent', () => {
  let component: TorrentDashboardComponent;
  let fixture: ComponentFixture<TorrentDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentDashboardComponent ],
      imports: [
        SharedModule,
        TranslateTestingModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
