import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentDestinationComponent } from './torrent-destination.component';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';

const mockTorrentDestination: TorrentDestination = {
  default: false,
  description: 'descriptioon',
  icon: 'menu',
  name: 'mock',
  path: '/path',
  rights: 'rights',
};

describe('TorrentDestinationComponent', () => {
  let component: TorrentDestinationComponent;
  let fixture: ComponentFixture<TorrentDestinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentDestinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentDestinationComponent);
    component = fixture.componentInstance;
    component.torrentDestination = mockTorrentDestination;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
