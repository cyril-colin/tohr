import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentBrowserItemComponent } from './torrent-browser-item.component';

describe('TorrentBrowserItemComponent', () => {
  let component: TorrentBrowserItemComponent;
  let fixture: ComponentFixture<TorrentBrowserItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentBrowserItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentBrowserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
