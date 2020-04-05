import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentBrowserSearchComponent } from './torrent-browser-search.component';

describe('TorrentBrowserSearchComponent', () => {
  let component: TorrentBrowserSearchComponent;
  let fixture: ComponentFixture<TorrentBrowserSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentBrowserSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentBrowserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
