import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchNetworkModalComponent } from './switch-network-modal.component';

describe('SwitchNetworkModalComponent', () => {
  let component: SwitchNetworkModalComponent;
  let fixture: ComponentFixture<SwitchNetworkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchNetworkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchNetworkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
