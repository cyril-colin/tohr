import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationListComponent } from './destination-list.component';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';

const mockTorrentDestination: TorrentDestination = {
  default: false,
  description: 'descriptioon',
  icon: 'menu',
  name: 'dada',
  path: '/path',
  rights: 'rights',
};
describe('DestinationListComponent', () => {
  let component: DestinationListComponent;
  let fixture: ComponentFixture<DestinationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a destination', () => {
    const emitSpy = spyOn(component.selectEvent, 'emit');
    component.selectDestination(mockTorrentDestination);

    expect(component.selected).toEqual(mockTorrentDestination);
    expect(emitSpy).toHaveBeenCalled();
  });
});
