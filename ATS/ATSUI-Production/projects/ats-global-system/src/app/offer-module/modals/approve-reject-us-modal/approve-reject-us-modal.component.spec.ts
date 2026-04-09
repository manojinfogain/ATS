import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectUsModalComponent } from './approve-reject-us-modal.component';

describe('ApproveRejectUsModalComponent', () => {
  let component: ApproveRejectUsModalComponent;
  let fixture: ComponentFixture<ApproveRejectUsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRejectUsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRejectUsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
