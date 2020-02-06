import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarComponent } from './progress-bar.component';
import { SharedModule } from '../shared.module';
import { Torrent } from 'src/app/core/model/torrent';

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

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [
        SharedModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    component.torrent = mockTorrent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
