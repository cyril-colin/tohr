import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAreaComponent } from './error-area.component';

describe('ErrorAreaComponent', () => {
  let component: ErrorAreaComponent;
  let fixture: ComponentFixture<ErrorAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete', () => {
    component.errors = [{id: 1, message: 'dada'}];
    component.deleteError({id: 1, message: 'dada'});
    expect(component.errors).toEqual([]);

  });
});
