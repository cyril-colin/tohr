import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentListFilterComponent } from './torrent-list-filter.component';

describe('TorrentListFilterComponent', () => {
  let component: TorrentListFilterComponent;
  let fixture: ComponentFixture<TorrentListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
