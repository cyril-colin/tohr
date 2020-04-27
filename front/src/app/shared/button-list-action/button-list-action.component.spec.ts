import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonListActionComponent } from './button-list-action.component';

describe('ButtonListActionComponent', () => {
  let component: ButtonListActionComponent;
  let fixture: ComponentFixture<ButtonListActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonListActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonListActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
