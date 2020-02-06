import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentDetailComponent } from './torrent-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from 'src/app/shared/translate-testing.module';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TorrentDetailComponent', () => {
  let component: TorrentDetailComponent;
  let fixture: ComponentFixture<TorrentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentDetailComponent ],
      imports: [
        SharedModule,
        RouterTestingModule,
        TranslateTestingModule,
        OverlayModule,
        HttpClientTestingModule,
      ],
      providers: [
        ModalService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
