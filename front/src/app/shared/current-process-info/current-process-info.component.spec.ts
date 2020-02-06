import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentProcessInfoComponent } from './current-process-info.component';
import { TranslateTestingModule } from '../translate-testing.module';

describe('CurrentProcessInfoComponent', () => {
  let component: CurrentProcessInfoComponent;
  let fixture: ComponentFixture<CurrentProcessInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentProcessInfoComponent ],
      imports: [
        TranslateTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentProcessInfoComponent);
    component = fixture.componentInstance;
    component.currentProcessInfo = {
      cpuUsage: 10,
      memoryUsage: 25,
      processUser: 'test'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
