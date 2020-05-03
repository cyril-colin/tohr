import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadConfirmDialogComponent } from './download-confirm-dialog.component';

describe('DownloadConfirmDialogComponent', () => {
  let component: DownloadConfirmDialogComponent;
  let fixture: ComponentFixture<DownloadConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
