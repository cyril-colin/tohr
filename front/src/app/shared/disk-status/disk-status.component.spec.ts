import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiskStatusComponent } from './disk-status.component';
import { DiskStatus } from 'src/app/core/model/disk-status.model';
import { TranslateTestingModule } from '../translate-testing.module';
import { SharedModule } from '../shared.module';


const mockDiskStatus: DiskStatus = {
  fileSystem: 'string',
  size: 100,
  used: 50,
  available: 50,
  use: '89',
};

describe('DiskStatusComponent', () => {
  let component: DiskStatusComponent;
  let fixture: ComponentFixture<DiskStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskStatusComponent);
    component = fixture.componentInstance;
    component.diskStatus = mockDiskStatus;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
