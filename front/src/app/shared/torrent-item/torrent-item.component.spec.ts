import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentItemComponent } from './torrent-item.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { SharedModule } from '../shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Torrent } from 'src/app/core/model/torrent';
import { Router } from '@angular/router';

const mockTorrent: Torrent = {
  name: 'mock',
  id: 1,
  totalSize: 1000,
  downloadDir: '/mock/path/torrent.torrent',
  percentDone: 50,
  rateDownload: 52,
  rateUpload: 41,
  error: 0,
  errorString: null,
  destination: {
    default: false,
    description: 'description',
    icon: 'menu',
    name: 'Autre',
    path: '/mock/path/torrent.torrent',
    rights: 'rights !'
  }
};

describe('TorrentItemComponent', () => {
  let component: TorrentItemComponent;
  let fixture: ComponentFixture<TorrentItemComponent>;
  const spyRouter = jasmine.createSpyObj('Router', {
    navigate: (target: [], conf: any) => null,
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        {provide: Router, useValue: spyRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentItemComponent);
    component = fixture.componentInstance;
    component.torrent = mockTorrent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go torrent', () => {
    component.goTorrent(mockTorrent);
    expect(spyRouter.navigate).toHaveBeenCalled();
  });
});
