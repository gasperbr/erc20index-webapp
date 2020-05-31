import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTargetValuesComponent } from './chart-target-values.component';

describe('ChartTargetValuesComponent', () => {
  let component: ChartTargetValuesComponent;
  let fixture: ComponentFixture<ChartTargetValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartTargetValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTargetValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
