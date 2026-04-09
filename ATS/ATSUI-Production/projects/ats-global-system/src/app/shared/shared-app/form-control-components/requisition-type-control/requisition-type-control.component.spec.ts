import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionTypeControlComponent } from './requisition-type-control.component';

describe('RequisitionTypeControlComponent', () => {
  let component: RequisitionTypeControlComponent;
  let fixture: ComponentFixture<RequisitionTypeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisitionTypeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionTypeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
