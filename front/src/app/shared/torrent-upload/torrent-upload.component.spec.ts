import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentUploadComponent } from './torrent-upload.component';

describe('TorrentUploadComponent', () => {
  let component: TorrentUploadComponent;
  let fixture: ComponentFixture<TorrentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
