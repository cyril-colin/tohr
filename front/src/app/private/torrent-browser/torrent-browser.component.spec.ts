import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentBrowserComponent } from './torrent-browser.component';

describe('TorrentBrowserComponent', () => {
  let component: TorrentBrowserComponent;
  let fixture: ComponentFixture<TorrentBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
