import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveDialogComponent } from './move-dialog.component';
import { TranslateTestingModule } from '../translate-testing.module';
import { SharedModule } from '../shared.module';
import { MODAL_CONTAINER_DATA } from '../modal/modal-injection';
import { DestinationListComponent } from '../destination-list/destination-list.component';
import { ErrorAreaComponent } from '../error-area/error-area.component';
import { LoadingPageComponent } from '../loading-page/loading-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MoveDialogComponent', () => {
  let component: MoveDialogComponent;
  let fixture: ComponentFixture<MoveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MoveDialogComponent,
        DestinationListComponent,
        ErrorAreaComponent,
        LoadingPageComponent,
      ],
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
      ],
      providers: [
        { provide: MODAL_CONTAINER_DATA, useValue: {data: {destination: {}}} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
