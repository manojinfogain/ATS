import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSlotListThidComponent } from './panel-slot-list-thid.component';

describe('PanelSlotListThidComponent', () => {
  let component: PanelSlotListThidComponent;
  let fixture: ComponentFixture<PanelSlotListThidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelSlotListThidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSlotListThidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
