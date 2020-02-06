import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmDialogComponent } from './delete-confirm-dialog.component';
import { SharedModule } from '../shared.module';
import { MODAL_CONTAINER_DATA } from '../modal/modal-injection';
import { TranslateTestingModule } from '../translate-testing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DeleteConfirmDialogComponent', () => {
  let component: DeleteConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteConfirmDialogComponent ],
      imports: [
        TranslateTestingModule,
      ],
      providers: [
        { provide: MODAL_CONTAINER_DATA, useValue: {ref: {}, data: {}}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
